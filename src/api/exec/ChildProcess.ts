import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { parseArgString } from "./parse-arg-string";
import { pwd } from "../commands/pwd";
import { env } from "../env";
import { makeErrorWithProperties } from "../../error-with-properties";
import { traceAll } from "../trace-all";
import { is } from "../is";
import { assert } from "../assert";
import type { Path } from "../path";
import childProcessHelpText from "./ChildProcess.help.md";
import { setHelpText } from "../help";

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

export class ChildProcess {
  args: Array<string>;
  cwd: string;
  env: { [key: string]: string };
  stdio: {
    in: FILE;
    out: FILE;
    err: FILE;
  };
  trace?: (...args: Array<any>) => void;

  pid: number | null = null;

  constructor(args: string | Array<string>, options: ChildProcessOptions = {}) {
    if (is(args, types.string)) {
      this.args = parseArgString(args);
    } else if (is(args, types.arrayOf(types.string))) {
      this.args = args;
    } else {
      throw makeErrorWithProperties(
        "'args' argument must be either a string or an array of strings",
        { received: args }
      );
    }

    const cwd = options.cwd;
    if (cwd == null) {
      this.cwd = pwd();
    } else if (is(cwd, types.Path)) {
      this.cwd = cwd.toString();
    } else if (is(cwd, types.string)) {
      this.cwd = cwd;
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

    this.pid = os.exec(this.args, {
      block: false,
      cwd: this.cwd,
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
          if (this.trace) {
            this.trace.call(null, "ChildProcess result:", this.args, "->", ret);
          }
          return ret;
        } else if (os.WIFSIGNALED(status)) {
          const ret = { status: undefined, signal: os.WTERMSIG(status) };
          if (this.trace) {
            this.trace.call(null, "ChildProcess result:", this.args, "->");
          }
          return ret;
        }
      }
    }
  }
}

setHelpText(ChildProcess, childProcessHelpText);
