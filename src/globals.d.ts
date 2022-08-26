/** The name of the current file (whether script or module). Alias for `os.realpath(std.getFileNameFromStack())`. */
declare const __filename: string;

/** The name of the directory the current file is inside of. */
declare const __dirname: string;

/**
 * An object representing the process's environment variables. You can read
 * from it to read environment variables, write into it to set environment
 * variables, and/or delete properties from it to unset environment variables.
 * Any value you write will be coerced into a string.
 */
declare const env: { [key: string]: string | undefined };

type BaseExecOptions = {
  /** Sets the current working directory for the child process. */
  cwd?: string;

  /** Sets environment variables within the process. */
  env?: { [key: string | number]: string | number | boolean };
};

interface Exec {
  (args: Array<string> | string): void;

  (args: Array<string> | string, options: Record<string, never>): void;

  (
    args: Array<string> | string,
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
    args: Array<string> | string,
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
    args: Array<string> | string,
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
    args: Array<string> | string,
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
    args: Array<string> | string,
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
    args: Array<string> | string,
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

  /** Log all executed commands to stderr. `isOn` is optional and defaults to `true`. Pass `false` to disable logging. */
  enableLogging(isOn?: boolean): void;
}

/** Run a child process using the provided arguments. The first value in the arguments array is the program to run. */
declare const exec: Exec;

/** Alias for `exec(args, { captureOutput: true })` */
declare function $(args: Array<string> | string): {
  stdout: string;
  stderr: string;
};

/** Read the contents of a file from disk, as a string. */
declare function readFile(path: string): string;

/** Write the contents of a string or ArrayBuffer to a file. */
declare function writeFile(path: string, data: string | ArrayBuffer): void;

interface IsDir {
  /** Returns true if the path points to a directory, or if the path points to a symlink which points to a directory. */
  (path: string): boolean;

  /** Maximum number of symlinks to follow before erroring. */
  symlinkLimit: number;
}

/** Returns true if the path points to a directory, or if the path points to a symlink which points to a directory. */
declare var isDir: IsDir;

/** Returns true if the path points to a symlink. */
declare function isLink(path: string): boolean;

/** Delete the file or directory at the specified path. If the directory isn't empty, its contents will be deleted, too. */
declare function remove(path: string): void;

/** Returns true if a file or directory exists at the specified path. */
declare function exists(path: string): boolean;

/** Change the process's current working directory to the specified path. */
declare function cd(path: string): void;

/** Return the process's current working directory. */
declare function pwd(): string;

/** Removes the final component from a path string. */
declare function dirname(path: string): string;

/**
 * The separator character the host operative system uses between path
 * components, ie. the slashes in a filepath. On windows, it's a backslash, and
 * on all other OSes, it's a forward slash.
 */
declare const OS_PATH_SEPARATOR: "/" | "\\";

/**
 * Create a path string from one or more path or path component strings.
 *
 * Trailing slashes and duplicate path separators will be removed. Any slashes
 * or backslashes that do not match the requested path separator character
 * (which defaults to {@link OS_PATH_SEPARATOR}) will be converted to the
 * requested path separator. If multiple strings are passed, they will be
 * joined together using the requested path separator.
 *
 * This function does not resolve `..` or `.`. Use {@link resolvePath} for that.
 *
 * To request a path separator other than {@link OS_PATH_SEPARATOR}, pass an
 * object like `{ separator: "/" }` as the final argument to `makePath`.
 *
 * @param parts strings containing path components that should be present in
 * the returned path string.
 */
declare function makePath(
  ...parts: Array<string | { separator: string }>
): string;

/**
 * Split a path string on / or \\, returning an Array of strings.
 *
 * If the path starts with `/`, the first string in the Array will be empty.
 */
export function splitPath(path: string): Array<string>;

/**
 * Return the last component of a path string.
 */
declare function basename(path: string): string;

/**
 * Returns the absolute path to the root folder of the git/hg repo.
 *
 * This is done by running `git rev-parse --show-toplevel` and `hg root`.
 *
 * If `relativeTo` is provided, the git and hg commands will be executed in that
 */
declare function repoRoot(relativeTo?: string): string;

/**
 * Returns whether the provided path is ignored by git.
 */
declare function isGitignored(path: string): boolean;

/**
 * Return the contents of a directory, as absolute paths. `.` and `..` are
 * omitted.
 *
 * Use the `relativePaths` option to get relative paths instead (relative to
 * the parent directory).
 */
declare function ls(
  dir?: string,
  options?: { relativePaths?: boolean }
): Array<string>;

/** Get the absolute path given a relative path. Symlinks are also resolved. The path's target file/directory must exist. */
declare function realpath(path: string): string;

/**
 * Interpret any `.` or `..` parts from a path, resulting in an absolute path.
 * The path's target file/directory doesn't have to exist.
 *
 * You may optionally pass a `from` argument to specify where leading `.` or
 * `..` parts should be considered relative to. If unspecified, `from` defaults
 * to the process's current working directory, ie `pwd()`.
 */
declare function resolvePath(path: string, from?: string): string;

/** Read a symlink. */
declare function readlink(path: string): string;

/** If they don't exist, create a directories for each of the provided path components. Works the same as `mkdir -p`. */
declare function ensureDir(path: string): string;

/** Options for {@link copy}. */
export type CopyOptions = {
  whenTargetExists?: "overwrite" | "skip" | "error";
};

/** Copy a file or folder from one location to another. Folders are copied recursively. */
export function copy(from: string, to: string, options?: CopyOptions): void;

/**
 * Search the filesystem for files matching the specified glob patterns. Uses [minimatch](https://www.npmjs.com/package/minimatch) with its default options.
 *
 * `followSymlinks` defaults to false.
 */
declare function glob(
  dir: string,
  patterns: Array<string>,
  options?: { followSymlinks?: boolean }
): Array<string>;

/** Print a value or values to stdout. */
declare const echo: typeof console.log;

/** Convert a value to a string, using the same logic as `echo` and `console.log`. */
declare function inspect(value: any): string;

/** Remove ANSI control characters from a string. */
declare function stripAnsi(input: string): string;

/** Wrap a string in double quotes, and escape any double-quotes inside with `\"`. */
declare function quote(input: string): string;

// Colors

/** Wrap a string with the ANSI control characters that will make it print as black text. */
declare function black(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as red text. */
declare function red(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as green text. */
declare function green(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as yellow text. */
declare function yellow(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as blue text. */
declare function blue(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as magenta text. */
declare function magenta(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as cyan text. */
declare function cyan(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as white text. */
declare function white(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as gray text. */
declare function gray(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as grey text. */
declare function grey(input: string | number): string;

// Background Colors

/** Wrap a string with the ANSI control characters that will make it have a black background. */
declare function bgBlack(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a red background. */
declare function bgRed(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a green background. */
declare function bgGreen(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a yellow background. */
declare function bgYellow(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a blue background. */
declare function bgBlue(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a magenta background. */
declare function bgMagenta(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a cyan background. */
declare function bgCyan(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a white background. */
declare function bgWhite(input: string | number): string;

// Modifiers

/** Wrap a string with the ANSI control character that resets all styling. */
declare function reset(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print with a bold style. */
declare function bold(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print with a dimmed style. */
declare function dim(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print italicized. */
declare function italic(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print underlined. */
declare function underline(input: string | number): string;
/** Wrap a string with ANSI control characters such that its foreground (text) and background colors are swapped. */
declare function inverse(input: string | number): string;
/** Wrap a string with ANSI control characters such that it is hidden. */
declare function hidden(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print with a horizontal line through its center. */
declare function strikethrough(input: string | number): string;
