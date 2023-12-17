import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { toArgv } from "./to-argv";
import { pwd } from "../commands/pwd";
import { env } from "../env";
import { makeErrorWithProperties } from "../../error-with-properties";
import { traceAll } from "../trace-all";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { Path } from "../path";
import childProcessHelpText from "./ChildProcess.help.md";
import { setHelpText } from "../help";
import { setBytecodeClassToString } from "../../set-bytecode-class-tostring";

export type ChildProcessOptions = {
  cwd?: string | Path;
  env?: { [key: string | number]: string | number | boolean };
  stdio?: {
    in?: FILE;
    out?: FILE;
    err?: FILE;
  };
  trace?: (...args: Array<any>) => void;
};

export type ChildProcessState =
  | Readonly<{ id: "unstarted" }>
  | Readonly<{
      id: "running";
      pid: number;
    }>
  | Readonly<{
      id: "signaled";
      signal: number;
    }>
  | Readonly<{
      id: "exited";
      status: number;
    }>;

export class ChildProcess {
  args: Array<string>;
  cwd: Path;
  env: { [key: string]: string };
  stdio: {
    in: FILE;
    out: FILE;
    err: FILE;
  };
  trace?: (...args: Array<any>) => void;

  state: ChildProcessState = { id: "unstarted" };

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

    this.trace = options.trace ?? traceAll.getDefaultTrace();

    if (this.trace != null) {
      assert.type(
        this.trace,
        types.Function,
        "when present, 'options.trace' must be a function"
      );
    }
  }

  /** returns pid */
  start(): number {
    if (this.trace) {
      this.trace.call(null, "ChildProcess.start:", this.args);
    }

    if (this.state.id !== "unstarted") {
      throw new Error(
        `Attempted to call 'start()' on a ChildProcess that had state '${this.state.id}'. This is not allowed; ChildProcess objects represent a single execution of a process. To re-run something, create a new ChildProcess.`
      );
    }

    const pid = os.exec(this.args, {
      block: false,
      cwd: this.cwd.toString(),
      env: this.env,
      stdin: this.stdio.in.fileno(),
      stdout: this.stdio.out.fileno(),
      stderr: this.stdio.err.fileno(),
    });

    this.state = { id: "running", pid };

    return pid;
  }

  waitUntilComplete():
    | { status: number; signal: undefined }
    | { status: undefined; signal: number } {
    switch (this.state.id) {
      case "unstarted": {
        throw new Error(
          "Cannot wait for a child process that hasn't yet been started. Call start() first."
        );
      }
      case "exited": {
        const { status } = this.state;
        return { status, signal: undefined };
      }
      case "signaled": {
        const { signal } = this.state;
        return { status: undefined, signal };
      }
      case "running": {
        const pid = this.state.pid;
        while (true) {
          const [ret, waitpidStatus] = os.waitpid(pid);
          if (ret == pid) {
            if (os.WIFEXITED(waitpidStatus)) {
              const status = os.WEXITSTATUS(waitpidStatus);
              this.state = { id: "exited", status };

              const ret = { status, signal: undefined };
              if (this.trace) {
                this.trace.call(
                  null,
                  "ChildProcess result:",
                  this.args,
                  "->",
                  ret
                );
              }
              return ret;
            } else if (os.WIFSIGNALED(waitpidStatus)) {
              const signal = os.WTERMSIG(waitpidStatus);
              this.state = { id: "signaled", signal };

              const ret = { status: undefined, signal };
              if (this.trace) {
                this.trace.call(
                  null,
                  "ChildProcess result:",
                  this.args,
                  "->",
                  ret
                );
              }
              return ret;
            }
          }
        }
      }
    }
  }
}

setBytecodeClassToString(ChildProcess);

setHelpText(ChildProcess, childProcessHelpText);
