import * as std from "std";
import * as os from "os";
import { parseArgString } from "./parseArgString";
import { pwd } from "./paths";
import { env } from "./env";
import { makeErrorWithProperties } from "../error-with-properties";

let logging = false;

function enableLogging(isOn: boolean = true) {
  logging = isOn;
}

type ChildProcessOptions = {
  cwd?: string;
  env?: { [key: string | number]: string | number | boolean };
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

  pid: number | null = null;

  constructor(args: Array<string>, options: ChildProcessOptions = {}) {
    this.args = args;
    this.cwd = options.cwd || pwd();

    const baseEnv = options.env || env;

    this.env = {};
    for (const [key, value] of Object.entries(baseEnv)) {
      if (value != null) {
        this.env[String(key)] = String(value);
      }
    }

    this.stdio = {
      in: std.in,
      out: std.out,
      err: std.err,
    };
  }

  /** returns pid */
  start(): number {
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
          return { status: os.WEXITSTATUS(status), signal: undefined };
        } else if (os.WIFSIGNALED(status)) {
          return { status: undefined, signal: os.WTERMSIG(status) };
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
  } = {}
): any => {
  const {
    failOnNonZeroStatus = true,
    captureOutput = false,
    cwd,
    env,
  } = options;

  if (typeof args === "string") {
    args = parseArgString(args);
  }

  const child = new ChildProcess(args, { cwd, env });

  if (logging) {
    std.err.puts("+ exec: " + JSON.stringify(args) + "\n");
  }

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

    if (logging) {
      std.err.puts(
        "+ exec result: " +
          JSON.stringify(args) +
          ` -> ${JSON.stringify(result)}\n`
      );
    }

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
    if (logging) {
      std.err.puts(`+ exec error: ${inspect(err)}\n`);
    }
    throw err;
  } finally {
    if (tmpOut != null) tmpOut.close();
    if (tmpErr != null) tmpErr.close();
  }
};

exec.enableLogging = enableLogging;

export { exec };

export function $(args: Array<string> | string): {
  stdout: string;
  stderr: string;
} {
  return exec(args as any, { captureOutput: true });
}
