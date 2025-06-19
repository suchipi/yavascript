import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { toArgv } from "./to-argv";
import { pwd } from "../commands/pwd";
import { env } from "../env";
import { makeErrorWithProperties } from "../../error-with-properties";
import { logger } from "../logger";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { Path } from "../path";

export enum ChildProcessStateKind {
  UNSTARTED = "UNSTARTED",
  STARTED = "STARTED",
  STOPPED = "STOPPED",
  CONTINUED = "CONTINUED",
  EXITED = "EXITED",
  SIGNALED = "SIGNALED",
}

export type ChildProcessState =
  | {
      id: ChildProcessStateKind.UNSTARTED;
    }
  | {
      id: ChildProcessStateKind.STARTED;
      pid: number;
    }
  | {
      id: ChildProcessStateKind.STOPPED;
      pid: number;
    }
  | {
      id: ChildProcessStateKind.CONTINUED;
      pid: number;
    }
  | {
      id: ChildProcessStateKind.EXITED;
      oldPid: number;
      status: number;
    }
  | {
      id: ChildProcessStateKind.SIGNALED;
      oldPid: number;
      signal: number;
    };

export type ChildProcessOptions = {
  cwd?: string | Path;
  env?: { [key: string | number]: string | number | boolean };
  stdio?: {
    in?: FILE;
    out?: FILE;
    err?: FILE;
  };
  logging?: {
    trace?: (...args: Array<any>) => void;
  };
};

export class ChildProcess {
  args: Array<string>;
  cwd: Path;
  env: { [key: string]: string };
  stdio: {
    in: FILE;
    out: FILE;
    err: FILE;
  };

  private _logging: {
    trace: (...args: Array<any>) => void;
  };

  private _state: ChildProcessState = { id: ChildProcessStateKind.UNSTARTED };

  get state() {
    this._updateState();
    return this._state;
  }

  get pid() {
    this._updateState();
    return this._getPidRaw();
  }

  constructor(
    args: string | Path | Array<string | number | Path>,
    options: ChildProcessOptions = {}
  ) {
    // type of `args` gets checked in `toArgv`
    this.args = toArgv(args);

    const cwd = options.cwd;
    if (cwd == null) {
      this.cwd = pwd();
    } else if (is(cwd, types.Path)) {
      this.cwd = cwd;
    } else if (is(cwd, types.string)) {
      this.cwd = new Path(cwd);
    } else {
      throw makeErrorWithProperties(
        "when present, 'cwd' option must be either a string or a Path object",
        { received: cwd },
        TypeError
      );
    }

    const baseEnv = options.env || env;

    assert.type(
      baseEnv,
      types.object,
      "when present, 'env' option must be an object"
    );

    this.env = {};
    for (const [key, value] of Object.entries(baseEnv)) {
      if (value != null) {
        this.env[String(key)] = String(value);
      }
    }

    this.stdio = {
      in: options?.stdio?.in ?? std.in,
      out: options?.stdio?.out ?? std.out,
      err: options?.stdio?.err ?? std.err,
    };

    assert.type(
      this.stdio.in,
      types.FILE,
      "when present, 'stdio.in' option must be a FILE object"
    );
    assert.type(
      this.stdio.out,
      types.FILE,
      "when present, 'stdio.out' option must be a FILE object"
    );
    assert.type(
      this.stdio.err,
      types.FILE,
      "when present, 'stdio.err' option must be a FILE object"
    );

    this._logging = {
      trace: options.logging?.trace ?? logger.trace,
    };

    assert.type(
      this._logging.trace,
      types.Function,
      "when present, 'options.logging.trace' must be a function"
    );
  }

  /** returns pid */
  start(): number {
    this._logging.trace.call(null, "ChildProcess.start:", this.args);

    const pid = os.exec(this.args, {
      block: false,
      cwd: this.cwd.toString(),
      env: this.env,
      stdin: this.stdio.in.fileno(),
      stdout: this.stdio.out.fileno(),
      stderr: this.stdio.err.fileno(),
    });

    this._state = {
      id: ChildProcessStateKind.STARTED,
      pid,
    };

    return pid;
  }

  private _getPidRaw() {
    const state = this._state;
    switch (state.id) {
      case ChildProcessStateKind.UNSTARTED:
        return null;
      case ChildProcessStateKind.STARTED:
      case ChildProcessStateKind.STOPPED:
      case ChildProcessStateKind.CONTINUED:
        return state.pid;
      case ChildProcessStateKind.EXITED:
      case ChildProcessStateKind.SIGNALED:
        return state.oldPid;
      default: {
        const here: never = state;
        throw new Error(
          `Unhandled ChildProcessStateKind: ${(state as any).id}`
        );
      }
    }
  }

  private _updateState() {
    switch (this._state.id) {
      case ChildProcessStateKind.UNSTARTED:
      case ChildProcessStateKind.EXITED:
      case ChildProcessStateKind.SIGNALED:
        return;
      case ChildProcessStateKind.STARTED:
      case ChildProcessStateKind.STOPPED:
      case ChildProcessStateKind.CONTINUED:
        this._waitpid(false);
        break;
      default: {
        const here: never = this._state;
        throw new Error(
          `Unhandled ChildProcessStateKind: ${(this._state as any).id}`
        );
      }
    }
  }

  private _waitpid(block: boolean) {
    const pid = this._getPidRaw();
    if (!pid) {
      return;
    }

    const flags = block ? 0 : os.WNOHANG;
    const [ret, status] = os.waitpid(pid, flags);
    if (ret === pid) {
      if (os.WIFEXITED(status)) {
        this._state = {
          id: ChildProcessStateKind.EXITED,
          oldPid: pid,
          status: os.WEXITSTATUS(status),
        };
        this._logging.trace.call(
          null,
          "ChildProcess result:",
          this.args,
          "->",
          this._state
        );
      } else if (os.WIFSIGNALED(status)) {
        this._state = {
          id: ChildProcessStateKind.SIGNALED,
          oldPid: pid,
          signal: os.WTERMSIG(status),
        };
        this._logging.trace.call(
          null,
          "ChildProcess result:",
          this.args,
          "->",
          this._state
        );
      } else if (os.WIFSTOPPED(status)) {
        this._state = {
          id: ChildProcessStateKind.STOPPED,
          pid,
        };
        this._logging.trace.call(null, "ChildProcess stopped:", this.args);
      } else if (os.WIFCONTINUED(status)) {
        this._state = {
          id: ChildProcessStateKind.CONTINUED,
          pid,
        };
        this._logging.trace.call(null, "ChildProcess continued:", this.args);
      }
    }

    return false;
  }

  waitUntilComplete():
    | { status: number; signal: undefined }
    | { status: undefined; signal: number } {
    do {
      const rawState = this._state;
      idSwitch: switch (rawState.id) {
        case ChildProcessStateKind.UNSTARTED: {
          throw new Error(
            "The ChildProcess hasn't yet started. Call ChildProcess's start() method before calling waitUntilComplete()."
          );
        }
        case ChildProcessStateKind.EXITED: {
          return { status: rawState.status, signal: undefined };
        }
        case ChildProcessStateKind.SIGNALED: {
          return { status: undefined, signal: rawState.signal };
        }
        case ChildProcessStateKind.STARTED:
        case ChildProcessStateKind.CONTINUED:
        case ChildProcessStateKind.STOPPED: {
          this._waitpid(true);
          break idSwitch;
        }

        default: {
          const here: never = rawState;
          throw new Error(
            `Unhandled ChildProcessStateKind: ${(rawState as any).id}`
          );
        }
      }
    } while (true);
  }
}
