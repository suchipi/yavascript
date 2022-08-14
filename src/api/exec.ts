import * as std from "std";
import * as os from "os";

type BaseExecOptions = {
  /** Sets the current working directory for the child process. */
  cwd?: string;

  /** Sets environment variables within the process. */
  env?: { [key: string | number]: string | number | boolean };
};

interface Exec {
  (args: Array<string>): void;

  (args: Array<string>, options: Record<string, never>): void;

  (
    args: Array<string>,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: true;
      /**
       * If true, stdout and stderr will be collected into strings and returned
       * instead of being printed to the screen.
       *
       * Defaults to false.
       */
      captureOutput: false;
    }
  ): void;

  (
    args: Array<string>,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: false;
      /**
       * If true, stdout and stderr will be collected into strings and returned
       * instead of being printed to the screen.
       *
       * Defaults to false.
       */
      captureOutput: false;
    }
  ): { status: number };

  (
    args: Array<string>,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: false;
    }
  ): { status: number };

  (
    args: Array<string>,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: true;
      /**
       * If true, stdout and stderr will be collected into strings and returned
       * instead of being printed to the screen.
       *
       * Defaults to false.
       */
      captureOutput: true;
    }
  ): { stdout: string; stderr: string };

  (
    args: Array<string>,
    options: BaseExecOptions & {
      /**
       * If true, stdout and stderr will be collected into strings and returned
       * instead of being printed to the screen.
       *
       * Defaults to false.
       */
      captureOutput: true;
    }
  ): { stdout: string; stderr: string };

  (
    args: Array<string>,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: false;
      captureOutput: true;
    }
  ): { stdout: string; stderr: string; status: number };
}

export const exec: Exec = (
  args: Array<string>,
  options: BaseExecOptions & {
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

  let tmpOut: std.FILE | null = null;
  let tmpErr: std.FILE | null = null;
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
  } finally {
    if (tmpOut != null) tmpOut.close();
    if (tmpErr != null) tmpErr.close();
  }
};

export function $(args: Array<string>): {
  stdout: string;
  stderr: string;
} {
  return exec(args, { captureOutput: true });
}