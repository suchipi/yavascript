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

  pid: number | null = null;

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

    this.pid = os.exec(this.args, {
      block: false,
      cwd: this.cwd.toString(),
      env: this.env,
      stdin: this.stdio.in.fileno(),
      stdout: this.stdio.out.fileno(),
      stderr: this.stdio.err.fileno(),
    });
    return this.pid;
  }

  waitUntilComplete():
    | { status: number; signal: undefined }
    | { status: undefined; signal: number } {
    const pid = this.pid;
    if (pid == null) {
      throw new Error(
        "Cannot wait for a child process that hasn't yet been started"
      );
    }

    while (true) {
      const [ret, status] = os.waitpid(pid);
      if (ret == pid) {
        if (os.WIFEXITED(status)) {
          const ret = { status: os.WEXITSTATUS(status), signal: undefined };
          this._logging.trace.call(
            null,
            "ChildProcess result:",
            this.args,
            "->",
            ret
          );
          return ret;
        } else if (os.WIFSIGNALED(status)) {
          const ret = { status: undefined, signal: os.WTERMSIG(status) };
          this._logging.trace.call(
            null,
            "ChildProcess result:",
            this.args,
            "->"
          );
          return ret;
        }
      }
    }
  }
}
