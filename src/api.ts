import * as std from "std";
import * as os from "os";
import * as util from "node-inspect-extracted";
import inspect from "./inspect";
import kleur from "kleur";

// @ts-ignore assignment to value incorrectly typed as read-only
kleur.enabled = true;

const env = new Proxy(
  {},
  {
    get(target, property, receiver) {
      if (typeof property === "symbol") return undefined;
      return std.getenv(property) || undefined;
    },

    set(target, property, value, receiver) {
      if (typeof property === "symbol") return false;

      if (value == null) {
        std.unsetenv(property);
      } else {
        std.setenv(property, value);
      }

      return true;
    },

    deleteProperty(target, property) {
      if (typeof property === "symbol") return false;

      std.unsetenv(property);
      return true;
    },
  }
);

interface Exec {
  (args: Array<string>): void;

  (args: Array<string>, options: Record<string, never>): void;

  (
    args: Array<string>,
    options: {
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
    options: {
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
    options: {
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
    options: {
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
    options: {
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
    options: {
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

const exec: Exec = (
  args: Array<string>,
  { failOnNonZeroStatus = true, captureOutput = false } = {}
): any => {
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

function $(args: Array<string>): {
  stdout: string;
  stderr: string;
  status: number;
} {
  return exec(args, { captureOutput: true, failOnNonZeroStatus: false });
}

function readFile(path: string): string {
  return std.loadFile(path);
}

function writeFile(path: string, data: string | ArrayBuffer): void {
  const file = std.open(path, "w");
  try {
    if (typeof data === "string") {
      file.puts(data);
    } else {
      file.write(data, 0, data.byteLength);
    }
  } finally {
    file.close();
  }
}

function remove(path: string): void {
  const stats = os.lstat(path);
  if (os.S_IFDIR & stats.mode) {
    const children = os
      .readdir(path)
      .filter((child) => child !== "." && child !== "..")
      .map((child) => path + "/" + child);

    for (const child of children) {
      remove(child);
    }
  }

  os.remove(path);
}

function exists(path: string): boolean {
  try {
    os.access(path, os.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function cd(path: string): void {
  os.chdir(path);
}

function pwd(): string {
  return os.getcwd();
}

function glob(...inputs: Array<string>): Array<string> {
  throw new Error("not yet implemented");
}

const baseApi = {
  echo: console.log,
  cd,
  pwd,

  env,
  exec,
  $,

  readFile,
  writeFile,
  exists,
  remove,
  glob,

  inspect,
  stripAnsi: util.stripVTControlCharacters,
  quote: JSON.stringify.bind(JSON),
};

const api = Object.assign(baseApi, kleur as Omit<typeof kleur, "enabled">);

// @ts-ignore deleting property that doesn't exist on type (due to Omit cast)
delete api.enabled;

export default api;
