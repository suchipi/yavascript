import * as std from "std";
import * as os from "os";
import * as util from "node-inspect-extracted";
import inspect from "./inspect";
import kleur from "kleur";
import minimatch from "minimatch";

// @ts-ignore assignment to value incorrectly typed as read-only
kleur.enabled = true;

const _env = std.getenviron();

const env = new Proxy(_env, {
  get(target, property, receiver) {
    if (typeof property === "symbol") return undefined;
    return std.getenv(property) || undefined;
  },

  set(target, property, value, receiver) {
    if (typeof property === "symbol") return false;

    if (value == null) {
      delete _env[property];
      std.unsetenv(property);
    } else {
      const strValue = String(value);
      _env[property] = strValue;
      std.setenv(property, strValue);
    }

    return true;
  },

  deleteProperty(target, property) {
    if (typeof property === "symbol") return false;

    std.unsetenv(property);
    delete _env[property];
    return true;
  },

  ownKeys(target) {
    return Object.keys(std.getenviron());
  },

  has(target, property) {
    if (typeof property === "symbol") return false;

    const result = std.getenv(property);
    return typeof result !== "undefined";
  },
});

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

const exec: Exec = (
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

function $(args: Array<string>): {
  stdout: string;
  stderr: string;
} {
  return exec(args, { captureOutput: true });
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

function isDir(path: string): boolean {
  const stats = os.stat(path);
  return Boolean(os.S_IFDIR & stats.mode);
}

function remove(path: string): void {
  if (isDir(path)) {
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

const OS_PATH_SEPARATOR = os.platform === "win32" ? "\\" : "/";

function makePath(...parts: Array<string | { separator: string }>) {
  const lastPart = parts[parts.length - 1];
  let options: { separator: string } | null = null;
  if (typeof lastPart === "object") {
    options = lastPart as any;
  }

  let separator = OS_PATH_SEPARATOR;
  if (options != null && options.separator) {
    separator = options.separator;
  }

  let stringParts = (
    parts.filter((part) => typeof part === "string") as any as Array<string>
  )
    .map((part) => part.split(separator))
    .filter(Boolean)
    .flat(1)
    .filter(Boolean);

  const wrongSeparator = separator === "\\" ? "/" : "\\";

  let resultingString = stringParts
    .map((part) => {
      return part.replace(
        new RegExp("\\" + wrongSeparator + "+", "g"),
        separator
      );
    })
    .join(separator);

  if (typeof parts[0] === "string" && parts[0].startsWith(separator)) {
    resultingString = separator + resultingString;
  }

  return resultingString;
}

function dirname(path: string) {
  const separator = path.includes("\\") ? "\\" : "/";
  const cleanPath = makePath(path, { separator });
  return cleanPath.split(separator).slice(0, -1).join(separator);
}

function ls(
  dir: string = pwd(),
  options: { relativePaths?: boolean } = { relativePaths: false }
): Array<string> {
  if (!isDir(dir)) {
    throw new Error(`Not a directory: ${dir}`);
  }
  let children = os
    .readdir(dir)
    .filter((child) => child !== "." && child !== "..");
  if (!options.relativePaths) {
    const parent = realpath(dir);
    children = children.map((child) => makePath(parent, child));
  }

  return children;
}

function glob(
  dir: string,
  patterns: Array<string>,
  { followSymlinks = false } = {}
): Array<string> {
  if (!exists(dir)) {
    throw new Error(`No such directory: ${dir} (from ${pwd()})`);
  }

  const matches: Array<string> = [];

  function find(searchDir: string) {
    const children = os.readdir(dir);
    for (const child of children) {
      if (child === ".") continue;
      if (child === "..") continue;

      const fullName = searchDir === "." ? child : searchDir + "/" + child;

      if (patterns.every((pattern) => minimatch(fullName, pattern))) {
        matches.push(fullName);

        try {
          let stat: os.Stats;
          if (followSymlinks) {
            stat = os.stat(fullName);
          } else {
            stat = os.lstat(fullName);
          }
          if (os.S_IFDIR & stat.mode) {
            find(fullName);
          }
        } catch (err) {
          // ignore I/O and access errors when searching
        }
      }
    }
  }

  find(dir);

  return matches;
}

function repoRoot(relativeTo: string = pwd()): string {
  if (exists(relativeTo) && !isDir(relativeTo)) {
    relativeTo = dirname(relativeTo);
  }

  try {
    const gitRootRun = exec(["git", "rev-parse", "--show-toplevel"], {
      captureOutput: true,
      failOnNonZeroStatus: false,
      cwd: relativeTo,
    });
    if (gitRootRun.status === 0) {
      return gitRootRun.stdout.trim();
    }
  } catch (err) {}

  try {
    const hgRootRun = exec(["hg", "root"], {
      captureOutput: true,
      failOnNonZeroStatus: false,
      cwd: relativeTo,
    });
    if (hgRootRun.status === 0) {
      return hgRootRun.stdout.trim();
    }
  } catch (err) {}

  throw new Error(
    `Fatal: ${relativeTo} is not within a git or hg repo, or git/hg were not found in PATH`
  );
}

function isGitignored(path: string): boolean {
  const result = exec(["git", "check-ignore", path], {
    failOnNonZeroStatus: false,
    captureOutput: true,
  });
  if (result.status !== 0 && result.status !== 1) {
    throw new Error("git check-ignore failed: " + result.stderr.trim());
  }
  return result.status === 0;
}

const baseApi = {
  echo: console.log,
  cd,
  pwd,
  realpath: os.realpath.bind(os),
  readlink: os.readlink
    ? os.readlink.bind(os)
    : () => {
        throw new Error(`readlink is not yet supported in ${os.platform}`);
      },
  ls,
  dirname,

  env,
  exec,
  $,

  readFile,
  writeFile,
  isDir,
  exists,
  remove,
  glob,

  OS_PATH_SEPARATOR,
  makePath,

  repoRoot,
  isGitignored,

  inspect,
  stripAnsi: util.stripVTControlCharacters,
  quote: JSON.stringify.bind(JSON),
};

const api = Object.assign(baseApi, kleur as Omit<typeof kleur, "enabled">);

// @ts-ignore deleting property that doesn't exist on type (due to Omit cast)
delete api.enabled;

Object.assign(globalThis, api);

Object.defineProperties(globalThis, {
  __filename: {
    get() {
      return os.realpath(std.getFileNameFromStack(1));
    },
  },
  __dirname: {
    get() {
      const filename = os.realpath(std.getFileNameFromStack(1));
      return dirname(filename);
    },
  },
});
