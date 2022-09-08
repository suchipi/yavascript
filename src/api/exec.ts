import * as std from "std";
import * as os from "os";
import { parseArgString } from "./parseArgString";

let logging = false;

function enableLogging(isOn: boolean = true) {
  logging = isOn;
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

  if (logging) {
    std.err.puts("+ exec: " + JSON.stringify(args) + "\n");
  }

  let tmpOut: FILE | null = null;
  let tmpErr: FILE | null = null;
  if (captureOutput) {
    tmpOut = std.tmpfile();
    tmpErr = std.tmpfile();
  }

  try {
    const execOpts: os.ExecOptions = {};
    if (captureOutput) {
      execOpts.stdout = tmpOut!.fileno();
      execOpts.stderr = tmpErr!.fileno();
    } else {
      execOpts.stdin = std.in.fileno();
      execOpts.stdout = std.out.fileno();
      execOpts.stderr = std.err.fileno();
    }

    if (cwd != null) {
      execOpts.cwd = cwd;
    }

    if (env != null) {
      execOpts.env = env;
    }

    const status = os.exec(args, execOpts);

    if (logging) {
      std.err.puts(
        "+ exec result: " + JSON.stringify(args) + ` -> ${status}\n`
      );
    }

    if (failOnNonZeroStatus && status !== 0) {
      const err = new Error(`Command failed: ${JSON.stringify(args)}`);
      // @ts-ignore property status not found on error
      err.status = status;
      throw err;
    }

    if (!captureOutput) {
      if (failOnNonZeroStatus) {
        return undefined;
      } else {
        return { status };
      }
    }

    if (tmpOut != null && tmpErr != null) {
      // need to seek to beginning to read the data that was written
      tmpOut.seek(0, std.SEEK_SET);
      tmpErr.seek(0, std.SEEK_SET);
      const stdout = tmpOut.readAsString();
      const stderr = tmpErr.readAsString();

      return { stdout, stderr, status };
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
