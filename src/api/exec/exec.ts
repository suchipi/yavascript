import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { parseArgString } from "./parse-arg-string";
import { pwd } from "../commands/pwd";
import { env } from "../env";
import { makeErrorWithProperties } from "../../error-with-properties";
import traceAll from "../traceAll";
import { is } from "../is";
import { assert } from "../assert";
import type { Path } from "../path";

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

class ChildProcess {
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
    if (is.string(args)) {
      this.args = parseArgString(args);
    } else if (is.Array(args)) {
      for (const item of args) {
        if (!is.string(item)) {
          throw makeErrorWithProperties(
            "'args' argument must be an array of strings",
            {
              actual: args,
            },
            TypeError
          );
        }
      }
      this.args = args;
    } else {
      throw makeErrorWithProperties(
        "'args' argument must be either a string or an array of strings",
        {
          actual: args,
        }
      );
    }

    const cwd = options.cwd;
    if (cwd == null) {
      this.cwd = pwd();
    } else if (is.Path(cwd)) {
      this.cwd = cwd.toString();
    } else if (is.string(cwd)) {
      this.cwd = cwd;
    } else {
      throw makeErrorWithProperties(
        "when present, 'cwd' option must be either a string or a Path object",
        {
          actual: cwd,
        },
        TypeError
      );
    }

    const baseEnv = options.env || env;

    assert.object(baseEnv, "when present, 'env' option must be an object");

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

    assert.FILE(
      this.stdio.in,
      "when present, 'stdio.in' option must be a FILE object"
    );
    assert.FILE(
      this.stdio.out,
      "when present, 'stdio.out' option must be a FILE object"
    );
    assert.FILE(
      this.stdio.err,
      "when present, 'stdio.err' option must be a FILE object"
    );

    this.trace = options.trace ?? traceAll.getDefaultTrace();

    if (this.trace != null) {
      assert.function(
        this.trace,
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

const exec = (
  args: Array<string> | string,
  options: {
    cwd?: string;
    env?: { [key: string | number]: string | number | boolean };
    failOnNonZeroStatus?: boolean;
    captureOutput?: boolean;
    trace?: (...args: Array<any>) => void;
  } = {}
): any => {
  // 'args' type gets checked in ChildProcess constructor
  assert.object(
    options,
    "'options' argument must be either an object or undefined"
  );

  const {
    failOnNonZeroStatus = true,
    captureOutput = false,
    cwd,
    env,
    trace = traceAll.getDefaultTrace(),
  } = options;

  assert.boolean(
    failOnNonZeroStatus,
    "when present, 'failOnNonZeroStatus' option must be a boolean"
  );
  assert.boolean(
    captureOutput,
    "when present, 'captureOutput' option must be a boolean"
  );

  if (trace != null) {
    assert.function(trace, "when present, 'options.trace' must be a function");
  }

  if (typeof args === "string") {
    args = parseArgString(args);
  }

  const child = new ChildProcess(args, { cwd, env, trace });

  let tmpOut: FILE | null = null;
  let tmpErr: FILE | null = null;
  if (captureOutput) {
    tmpOut = std.tmpfile();
    child.stdio.out = tmpOut;
    tmpErr = std.tmpfile();
    child.stdio.err = tmpErr;
  }

  let result: ReturnType<typeof child.waitUntilComplete> | null = null;
  try {
    child.start();
    result = child.waitUntilComplete();

    if (failOnNonZeroStatus && result.status !== 0) {
      throw makeErrorWithProperties(
        `Command failed: ${JSON.stringify(args)}`,
        result
      );
    }

    if (!captureOutput) {
      if (failOnNonZeroStatus) {
        return undefined;
      } else {
        return result;
      }
    }

    if (tmpOut != null && tmpErr != null) {
      // need to seek to beginning to read the data that was written
      tmpOut.seek(0, std.SEEK_SET);
      tmpErr.seek(0, std.SEEK_SET);
      const stdout = tmpOut.readAsString();
      const stderr = tmpErr.readAsString();

      return { stdout, stderr, ...result };
    } else {
      throw new Error(
        "Internal error: tmpOut and tmpErr weren't set, but attempted to return stdout and stderr. This indicates a bug in the exec function"
      );
    }
  } catch (err) {
    if (trace) {
      trace("exec error:", err);
    }
    throw err;
  } finally {
    if (tmpOut != null) tmpOut.close();
    if (tmpErr != null) tmpErr.close();
  }
};

export { exec };

export function $(args: Array<string> | string): {
  stdout: string;
  stderr: string;
} {
  return exec(args as any, { captureOutput: true });
}
