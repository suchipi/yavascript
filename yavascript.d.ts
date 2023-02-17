// NOTE: This copy of yavascript.d.ts reflects what is in git.
// APIs may differ from what you have installed.
// Run `yavascript --print-types > yavascript.d.ts` to get the types
// corresponding to your specific `yavascript` binary.

// ===============
// ---------------
// YavaScript APIs
// ---------------
// ===============
/** Info about the currently-running yavascript binary */
declare const yavascript: {
  /**
   * The version of the currently-running yavascript binary.
   *
   * Will be something formatted like one of these:
   * - "v0.0.7"
   * - "v0.1.3-alpha"
   * - "git-286a3a336849"
   * - "git-286a3a336849-dirty"
   *
   * Or, more formally: either a "V" version string or a "GIT" version string:
   * - "V" version strings start with the character 'v', followed by a semver
   *   version string, optionally followed by the character '-' and any
   *   arbitrary content afterwards.
   * - "GIT" version strings start with the prefix "git-", followed by the
   *   first 12 digits of a git commit SHA, optionally followed by the
   *   character '-' and any arbitrary content afterwards.
   */
  version: string;

  /** The processor architecture we're running on. */
  arch: "x86_64" | "arm64";

  /**
   * The version of the ecma262 standard supported by the currently-running yavascript binary.
   *
   * Will always be in the format "ES" + a year. Is never lower than ES2020.
   */
  ecmaVersion: string;

  /** The compilers yavascript uses internally to load files. */
  compilers: {
    js(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    tsx(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    ts(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    jsx(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    coffee(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    autodetect(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;
  };
};

/**
 * An object representing the process's environment variables. You can read
 * from it to read environment variables, write into it to set environment
 * variables, and/or delete properties from it to unset environment variables.
 * Any value you write will be coerced into a string.
 */
declare const env: { [key: string]: string | undefined };

/**
 * Parse command line --flags into an object of flags and an array of
 * positional arguments. This function is opinionated; if it doesn't meet your
 * needs, you can parse the `scriptArgs` global manually.
 *
 * Flags `--like-this`, `--like_this`, or `--LIKE_THIS` get converted into
 * property names `likeThis` on the returned flags object.
 *
 * Flags like this: `-v` get converted into into property names like this: `v`
 * on the returned flags object.
 *
 * Anything that appears after `--` is considered a positional argument instead
 * of a flag. `--` is not present in the returned positional arguments Array.
 *
 * Single-character flags must have a single leading dash, and multi-character
 * flags must have two leading dashes.
 *
 * Flags with equals signs in them (eg. `--something=42`) are not supported.
 * Write `--something 42` instead.
 *
 * Flags where you specify them multiple times, like `-vvv`, are not supported.
 * Write something like `-v 3` instead.
 *
 * @param hints - An object whose keys are flag names (in camelCase) and whose values indicate what type to treat that flag as. Valid property values are `String`, `Boolean`, `Number`, and `parseScriptArgs.Path`. `parseScriptArgs.Path` will resolve relative paths into absolute paths for you. If no hints object is specified, `parseScriptArgs` will do its best to guess, based on the command-line args.
 * @param argv - An array containing the command line flags you want to parse. If unspecified, `scriptArgs.slice(2)` will be used (we slice 2 in order to skip the yavascript binary and script name). If you pass in an array here, it should only contain command-line flags, not the binary being called.
 *
 * @returns An object with two properties: `flags` and `args`. `flags` is an object whose keys are camelCase flag names and whose values are strings, booleans, or numbers corresponding to the input command-line args. `args` is an Array of positional arguments, as found on the command-line.
 */
declare const parseScriptArgs: {
  /**
   * Parse command line --flags into an object of flags and an array of
   * positional arguments. This function is opinionated; if it doesn't meet your
   * needs, you can parse the `scriptArgs` global manually.
   *
   * Flags `--like-this`, `--like_this`, or `--LIKE_THIS` get converted into
   * property names `likeThis` on the returned flags object.
   *
   * Flags like this: `-v` get converted into into property names like this: `v`
   * on the returned flags object.
   *
   * Anything that appears after `--` is considered a positional argument instead
   * of a flag. `--` is not present in the returned positional arguments Array.
   *
   * Single-character flags must have a single leading dash, and multi-character
   * flags must have two leading dashes.
   *
   * Flags with equals signs in them (eg. `--something=42`) are not supported.
   * Write `--something 42` instead.
   *
   * Flags where you specify them multiple times, like `-vvv`, are not supported.
   * Write something like `-v 3` instead.
   *
   * @param hints - An object whose keys are flag names (in camelCase) and whose values indicate what type to treat that flag as. Valid property values are `String`, `Boolean`, `Number`, and `parseScriptArgs.Path`. `parseScriptArgs.Path` will resolve relative paths into absolute paths for you. If no hints object is specified, `parseScriptArgs` will do its best to guess, based on the command-line args.
   * @param args - An array containing the command line flags you want to parse. If unspecified, `scriptArgs.slice(2)` will be used (we slice 2 in order to skip the yavascript binary and script name). If you pass in an array here, it should only contain command-line flags, not the binary being called.
   *
   * @returns An object with two properties: `flags` and `args`. `flags` is an object whose keys are camelCase flag names and whose values are strings, booleans, or numbers corresponding to the input command-line args. `args` is an Array of positional arguments, as found on the command-line.
   */
  (
    hints?: {
      [key: string]:
        | typeof String
        | typeof Boolean
        | typeof Number
        | typeof parseScriptArgs["Path"];
    },
    args?: Array<string>
  ): {
    flags: { [key: string]: any };
    args: Array<string>;
  };

  /**
   * A hint value for {@link parseScriptArgs}. Behaves similar to the hint value
   * `String`, except that it also resolves relative paths into absolute paths,
   * using the following rules:
   *
   * - paths `./like/this` or `../like/this` get resolved relative to `pwd()`.
   * - paths `like/this` or `this` get resolved relative to `pwd()` as if they had a leading `./`.
   */
  readonly Path: unique symbol;
};

/**
 * Read the contents of a file from disk.
 */
declare const readFile: {
  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   */
  (path: string): string;

  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   */
  (path: string, options: {}): string;

  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   */
  (path: string, options: { binary: false }): string;

  /**
   * Read the contents of a file from disk, as an ArrayBuffer.
   */
  (path: string, options: { binary: true }): ArrayBuffer;
};

/**
 * Write the contents of a string or ArrayBuffer to a file.
 *
 * Strings are written using the UTF-8 encoding.
 */
declare function writeFile(path: string, data: string | ArrayBuffer): void;

/**
 * Function which returns true if the path points to a directory, or if the
 * path points to a symlink which points to a directory. Otherwise, it returns
 * false.
 */
interface IsDir {
  /**
   * Returns true if the path points to a directory, or if the path points to
   * a symlink which points to a directory. Otherwise, returns false.
   */
  (path: string): boolean;

  /**
   * Maximum number of symlinks to follow before erroring. Defaults to 100.
   */
  symlinkLimit: number;
}

/**
 * Function which returns true if the path points to a directory, or if the
 * path points to a symlink which points to a directory. Otherwise, it returns
 * false.
 */
declare const isDir: IsDir;

/**
 * Returns true if the path points to a symlink.
 */
declare function isLink(path: string): boolean;

/**
 * Delete the file or directory at the specified path.
 *
 * If the directory isn't empty, its contents will be deleted, too.
 *
 * Provides the same functionality as the command `rm -rf`.
 */
declare function remove(path: string): void;

/**
 * Returns true if a file or directory exists at the specified path.
 *
 * Provides the same functionality as the command `test -e`.
 */
declare function exists(path: string): boolean;

/**
 * Create directories for each of the provided path components,
 * if they don't already exist.
 *
 * Provides the same functionality as the command `mkdir -p`.
 */
declare function ensureDir(path: string): string;

/**
 * Options for {@link copy}.
 */
declare type CopyOptions = {
  /**
   * What to do when attempting to copy something into a location where
   * something else already exists.
   *
   * Defaults to "error".
   */
  whenTargetExists?: "overwrite" | "skip" | "error";

  /**
   * If provided, this function will be called multiple times as `copy`
   * traverses the filesystem, to help you understand what's going on and/or
   * troubleshoot things. In most cases, it makes sense to use a logging
   * function here, like so:
   *
   * ```js
   * copy("./source", "./destination", { trace: console.log });
   * ```
   */
  trace?: (...args: Array<any>) => void;
};

/**
 * Copy a file or folder from one location to another.
 * Folders are copied recursively.
 *
 * Provides the same functionality as the command `cp -R`.
 */
declare function copy(from: string, to: string, options?: CopyOptions): void;

/** An object that represents a filesystem path. */
declare class Path {
  /** The character used to separate path segments on this OS. */
  static readonly OS_SEGMENT_SEPARATOR: "/" | "\\";

  /**
   * The character used to separate entries within the PATH environment
   * variable on this OS.
   */
  static readonly OS_ENV_VAR_SEPARATOR: ":" | ";";

  /** Split one or more path strings into an array of path segments. */
  static splitToSegments(inputParts: Array<string> | string): Array<string>;

  /**
   * Search the provided path string or strings for a path separator character,
   * and return it. If none is found, return `fallback`, which defaults to the
   * OS's path segment separator.
   */
  static detectSeparator<Fallback extends string | null = string>(
    input: Array<string> | string,
    // @ts-ignore might be instantiated with a different subtype
    fallback: Fallback = Path.OS_SEGMENT_SEPARATOR
  ): string | Fallback;

  /** Join together one or more paths. */
  static join(...inputs: Array<string | Path | Array<string | Path>>): string;

  /**
   * Turns the input path(s) into an absolute path by resolving all `.` and `..`
   * segments, using `pwd()` as a base dir to use when resolving leading `.` or
   * `..` segments.
   */
  static resolve(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): string;

  /**
   * Concatenates the input path(s) and then resolves all non-leading `.` and
   * `..` segments.
   */
  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): string;

  /**
   * Return whether the provided path string is absolute; that is, whether it
   * starts with either `/` or a drive letter (ie `C:`).
   */
  static isAbsolute(path: string): boolean;

  /** A tagged template literal function that creates a `Path` object. */
  static tag(
    strings: TemplateStringsArray,
    ...values: ReadonlyArray<string | Path | Array<string | Path>>
  ): Path;

  /**
   * Returns a tagged template literal that creates a `Path` object. `dir` is
   * used as a prefix for every `Path` object created.
   */
  static tagUsingBase(dir: string | Path): typeof Path.tag;

  /**
   * An array of the path segments that make up this path.
   *
   * For `/tmp/foo.txt`, it'd be `["", "tmp", "foo.txt"]`.
   *
   * For `C:\something\somewhere.txt`, it'd be `["C:", "something", "somewhere.txt"]`.
   */
  segments: Array<string>;

  /**
   * The path separator that should be used to turn this path into a string.
   *
   * Will be either `/` or `\`.
   */
  separator: string;

  /** Create a new Path object using the provided input(s). */
  constructor(...inputs: Array<string | Path | Array<string | Path>>);

  /** Create a new Path object using the provided segments and separator. */
  static from(segments: Array<string>, separator: string): Path;

  /**
   * Turn this path into an absolute path by resolving all `.` and `..`
   * segments, using `from` as a base dir to use when resolving leading `.` or
   * `..` segments.
   *
   * If `from` is unspecified, it defaults to `pwd()`.
   */
  resolve(from?: string | Path): Path;

  /**
   * Resolve all non-leading `.` and `..` segments in this path.
   */
  normalize(): Path;

  /**
   * Create a new path by appending another path's segments after this path's
   * segments.
   *
   * The returned path will use this path's separator.
   */
  concat(other: string | Path | Array<string | Path>): Path;

  /**
   * Return whether this path is absolute; that is, whether it starts with
   * either `/` or a drive letter (ie `C:`).
   */
  isAbsolute(): boolean;

  /**
   * Turn this path into a string by joining its segments using its separator.
   */
  toString(): string;
}

/**
 * The absolute path to the current file (whether script or module).
 *
 * Behaves the same as in Node.js, except that it's present within ES modules.
 */
declare const __filename: string;

/**
 * The absolute path to the directory the current file is inside of.
 *
 * Behaves the same as in Node.js, except that it's present within ES modules.
 */
declare const __dirname: string;

/**
 * Return the last component of a path string.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function basename(path: string | Path): string;

/**
 * Read the contents of one of more files from disk as one UTF-8 string,
 * print that string to stdout, then return it.
 */
declare function cat(...paths: Array<string | Path>): string;

/**
 * Change the process's current working directory to the specified path. If no
 * path is specified, moves to the user's home directory.
 *
 * Provides the same functionality as the shell builtin of the same name.
 */
declare function cd(path?: string | Path): void;

/** A string representing who a permission applies to. */
declare type ChmodPermissionsWho =
  | "user"
  | "group"
  | "others"
  | "all"
  | "u"
  | "g"
  | "o"
  | "a"
  | "ug"
  | "go"
  | "uo";

/** A string representing the access level for the given permission. */
declare type ChmodPermissionsWhat =
  | "read"
  | "write"
  | "execute"
  | "readwrite"
  | "none"
  | "full"
  | "r"
  | "w"
  | "x"
  | "rw"
  | "rx"
  | "wx"
  | "rwx";

/**
 * Set the permission bits for the specified file.
 *
 * @param permissions The permission bits to set. This can be a number, a string containing an octal number, or an object.
 * @param path The path to the file.
 */
declare function chmod(
  permissions:
    | number
    | string
    | Record<ChmodPermissionsWho, ChmodPermissionsWhat>,
  path: string | Path
): void;

/**
 * Removes the final component from a path string.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function dirname(path: string | Path): string;

/**
 * Print one or more values to stdout.
 */
declare const echo: typeof console.log;

/**
 * Returns the file extension of the file at a given path.
 *
 * If the file has no extension (eg `Makefile`, etc), then `''` will be returned.
 *
 * Pass `{ full: true }` to get compound extensions, eg `.d.ts` or `.test.js` instead of just `.ts`/`.js`.
 */
declare function extname(
  pathOrFilename: string | Path,
  options?: { full?: boolean }
): string;

/**
 * Return the contents of a directory, as absolute paths. `.` and `..` are
 * omitted.
 *
 * Use the `relativePaths` option to get relative paths instead (relative to
 * the parent directory).
 */
declare function ls(
  dir?: string | Path,
  options?: { relativePaths?: boolean }
): Array<string>;

/**
 * Print data to stdout using C-style format specifiers.
 */
declare function printf(format: string, ...args: Array<any>): void;

/**
 * Return the process's current working directory.
 *
 * Provides the same functionality as the shell builtin of the same name.
 */
declare function pwd(): string;

/**
 * Read a symlink.
 *
 * Returns the target of the symlink, which may be absolute or relative.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function readlink(path: string | Path): string;

/**
 * Get the absolute path given a relative path. Symlinks are also resolved.
 *
 * The path's target file/directory must exist.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function realpath(path: string | Path): string;

/**
 * If the file at `path` exists, update its creation/modification timestamps.
 *
 * Otherwise, create an empty file at that path.
 *
 * @param path The target path for the file.
 */
declare function touch(path: string | Path): void;

declare type BaseExecOptions = {
  /** Sets the current working directory for the child process. */
  cwd?: string;

  /** Sets environment variables within the process. */
  env?: { [key: string | number]: string | number | boolean };

  /**
   * If provided, this function will be called multiple times as `exec`
   * runs, to help you understand what's going on and/or troubleshoot things.
   * In most cases, it makes sense to use a logging function here, like so:
   *
   * ```js
   * exec(["echo", "hi"], { trace: console.log });
   * ```
   */
  trace?: (...args: Array<any>) => void;
};

declare interface Exec {
  (args: Array<string> | string): void;

  (args: Array<string> | string, options: Record<string, never>): void;

  (args: Array<string> | string, options: BaseExecOptions): void;

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
  ):
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

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
    }
  ):
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

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
      captureOutput: true;
    }
  ):
    | { stdout: string; stderr: string; status: number; signal: undefined }
    | { stdout: string; stderr: string; status: undefined; signal: number };
}

/** Run a child process using the provided arguments. The first value in the arguments array is the program to run. */
declare const exec: Exec;

/** Alias for `exec(args, { captureOutput: true })` */
declare function $(args: Array<string> | string): {
  stdout: string;
  stderr: string;
};

/**
 * Options for {@link glob}.
 */
declare type GlobOptions = {
  /**
   * Whether to treat symlinks to directories as if they themselves were
   * directories, traversing into them.
   *
   * Defaults to false.
   */
  followSymlinks?: boolean;

  /**
   * If provided, this function will be called multiple times as `glob`
   * traverses the filesystem, to help you understand what's going on and/or
   * troubleshoot things. In most cases, it makes sense to use a logging
   * function here, like so:
   *
   * ```js
   * glob(["./*.js"], { trace: console.log });
   * ```
   */
  trace?: (...args: Array<any>) => void;

  /**
   * Directory to interpret glob patterns relative to. Defaults to `pwd()`.
   */
  dir?: string;
};

/**
 * Search the filesystem for files matching the specified glob patterns.
 *
 * Uses [minimatch](https://www.npmjs.com/package/minimatch) with its default
 * options.
 */
declare function glob(
  patterns: string | Array<string>,
  options?: GlobOptions
): Array<string>;

/**
 * Remove ANSI control characters from a string.
 */
declare function stripAnsi(input: string): string;

/**
 * Wrap a string in double quotes, and escape any double-quotes inside using `\"`.
 */
declare function quote(input: string): string;

/**
 * Clear the contents and scrollback buffer of the tty by printing special characters into stdout.
 */
declare function clear(): void;

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

/** Split `str` on newline and then return lines matching `pattern`. */
declare const grepString: {
  /** Split `str` on newline and then return lines matching `pattern`. */
  (str: string, pattern: string | RegExp): Array<string>;

  /** Split `str` on newline and then return lines matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: false }
  ): Array<string>;

  /** Split `str` on newline and then return lines NOT matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: true }
  ): Array<string>;

  /** Split `str` on newline and then return lines matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { details: false }
  ): Array<string>;

  /** Split `str` on newline and then return lines matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: false; details: false }
  ): Array<string>;

  /** Split `str` on newline and then return lines NOT matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: true; details: false }
  ): Array<string>;

  /** Split `str` on newline and then return info about lines matching `pattern`. */
  (str: string, pattern: string | RegExp, options: { details: true }): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;

  /** Split `str` on newline and then return info about lines matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: false; details: true }
  ): Array<string>;

  /** Split `str` on newline and then return info about lines NOT matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: true; details: true }
  ): Array<string>;
};

/** Read the content at `path`, split it on newline, and then return lines matching `pattern`. */
declare const grepFile: {
  /** Read the content at `path`, split it on newline,  and then return lines matching `pattern`. */
  (path: string, pattern: string | RegExp): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines matching `pattern`. */
  (
    path: string,
    pattern: string | RegExp,
    options: { inverse: false }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines NOT matching `pattern`. */
  (
    path: string,
    pattern: string | RegExp,
    options: { inverse: true }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines matching `pattern`. */
  (
    path: string,
    pattern: string | RegExp,
    options: { details: false }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines matching `pattern`. */
  (
    path: string,
    pattern: string | RegExp,
    options: { inverse: false; details: false }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines NOT matching `pattern`. */
  (
    path: string,
    pattern: string | RegExp,
    options: { inverse: true; details: false }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return info about lines matching `pattern`. */
  (path: string, pattern: string | RegExp, options: { details: true }): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;

  /** Read the content at `path`, split it on newline,  and then return info about lines matching `pattern`. */
  (
    path: string,
    pattern: string | RegExp,
    options: { inverse: false; details: true }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return info about lines NOT matching `pattern`. */
  (
    path: string,
    pattern: string | RegExp,
    options: { inverse: true; details: true }
  ): Array<string>;
};

interface String {
  // Same as grepString but without the first argument.
  grep: {
    /** Split the string on newline and then return lines matching `pattern`. */
    (pattern: string | RegExp): Array<string>;

    /** Split the string on newline and then return lines matching `pattern`. */
    (pattern: string | RegExp, options: { inverse: false }): Array<string>;

    /** Split the string on newline and then return lines NOT matching `pattern`. */
    (pattern: string | RegExp, options: { inverse: true }): Array<string>;

    /** Split the string on newline and then return lines matching `pattern`. */
    (pattern: string | RegExp, options: { details: false }): Array<string>;

    /** Split the string on newline and then return lines matching `pattern`. */
    (
      pattern: string | RegExp,
      options: { inverse: false; details: false }
    ): Array<string>;

    /** Split the string on newline and then return lines NOT matching `pattern`. */
    (
      pattern: string | RegExp,
      options: { inverse: true; details: false }
    ): Array<string>;

    /** Split the string on newline and then return info about lines matching `pattern`. */
    (pattern: string | RegExp, options: { details: true }): Array<{
      lineNumber: number;
      lineContent: string;
      matches: RegExpMatchArray;
    }>;

    /** Split the string on newline and then return info about lines matching `pattern`. */
    (
      pattern: string | RegExp,
      options: { inverse: false; details: true }
    ): Array<string>;

    /** Split the string on newline and then return info about lines NOT matching `pattern`. */
    (
      pattern: string | RegExp,
      options: { inverse: true; details: true }
    ): Array<string>;
  };
}

declare type TypeValidator<T> = (value: any) => value is T;

declare type CoerceToTypeValidator<V extends CoerceableToTypeValidator> =
  V extends StringConstructor
    ? TypeValidator<string>
    : V extends NumberConstructor
    ? TypeValidator<number>
    : V extends BooleanConstructor
    ? TypeValidator<boolean>
    : V extends BigIntConstructor
    ? TypeValidator<BigInt>
    : V extends SymbolConstructor
    ? TypeValidator<Symbol>
    : V extends RegExpConstructor
    ? TypeValidator<RegExp>
    : V extends ArrayConstructor
    ? TypeValidator<Array<unknown>>
    : V extends SetConstructor
    ? TypeValidator<Set<unknown>>
    : V extends MapConstructor
    ? TypeValidator<Map<unknown, unknown>>
    : V extends ObjectConstructor
    ? TypeValidator<{
        [key: string | number | symbol]: unknown;
      }>
    : V extends DateConstructor
    ? TypeValidator<Date>
    : V extends FunctionConstructor
    ? TypeValidator<Function>
    : V extends ArrayBufferConstructor
    ? TypeValidator<ArrayBuffer>
    : V extends SharedArrayBufferConstructor
    ? TypeValidator<SharedArrayBuffer>
    : V extends DataViewConstructor
    ? TypeValidator<DataView>
    : V extends Int8ArrayConstructor
    ? TypeValidator<Int8Array>
    : V extends Uint8ArrayConstructor
    ? TypeValidator<Uint8Array>
    : V extends Uint8ClampedArrayConstructor
    ? TypeValidator<Uint8ClampedArray>
    : V extends Int16ArrayConstructor
    ? TypeValidator<Int16Array>
    : V extends Uint16ArrayConstructor
    ? TypeValidator<Uint16Array>
    : V extends Int32ArrayConstructor
    ? TypeValidator<Int32Array>
    : V extends Uint32ArrayConstructor
    ? TypeValidator<Uint32Array>
    : V extends Float32ArrayConstructor
    ? TypeValidator<Float32Array>
    : V extends Float64ArrayConstructor
    ? TypeValidator<Float64Array>
    : V extends RegExp
    ? TypeValidator<string>
    : V extends {}
    ? TypeValidator<{
        [key in keyof V]: CoerceToTypeValidator<V[key]>;
      }>
    : V extends []
    ? TypeValidator<[]>
    : V extends [any]
    ? TypeValidator<Array<CoerceToTypeValidator<V[0]>>>
    : V extends Array<any>
    ? TypeValidator<Array<unknown>>
    : V extends {
        new (...args: any): any;
      }
    ? TypeValidator<InstanceType<V>>
    : TypeValidator<V>;

declare type CoerceableToTypeValidator =
  | boolean
  | number
  | string
  | bigint
  | undefined
  | null
  | RegExp
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor
  | RegExpConstructor
  | ArrayConstructor
  | SetConstructor
  | MapConstructor
  | ObjectConstructor
  | DateConstructor
  | FunctionConstructor
  | ArrayBufferConstructor
  | SharedArrayBufferConstructor
  | DataViewConstructor
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | {}
  | []
  | [any]
  | Array<any>
  | {
      new (...args: any): any;
    };

declare type UnwrapTypeFromCoerceableOrValidator<
  V extends CoerceableToTypeValidator | TypeValidator<any> | unknown
> = V extends TypeValidator<infer T>
  ? T
  : V extends CoerceableToTypeValidator
  ? CoerceToTypeValidator<V> extends TypeValidator<infer T>
    ? T
    : never
  : unknown;

declare const types: {
  // basic types
  any: TypeValidator<any>;
  unknown: TypeValidator<unknown>;
  anyObject: TypeValidator<{
    [key: string | number | symbol]: any;
  }>;
  unknownObject: TypeValidator<{}>;
  object: TypeValidator<{}>;
  Object: TypeValidator<{}>;
  arrayOfAny: TypeValidator<Array<any>>;
  arrayOfUnknown: TypeValidator<Array<unknown>>;
  array: TypeValidator<Array<unknown>>;
  Array: TypeValidator<unknown[]>;
  anyArray: TypeValidator<Array<any>>;
  boolean: TypeValidator<boolean>;
  Boolean: TypeValidator<boolean>;
  string: TypeValidator<string>;
  String: TypeValidator<string>;
  null: TypeValidator<null>;
  undefined: TypeValidator<undefined>;
  nullish: TypeValidator<null | undefined>;
  void: TypeValidator<null | undefined>;
  numberIncludingNanAndInfinities: TypeValidator<number>;
  number: TypeValidator<number>;
  Number: TypeValidator<number>;
  NaN: TypeValidator<number>;
  Infinity: TypeValidator<number>;
  NegativeInfinity: TypeValidator<number>;
  integer: TypeValidator<number>;
  bigint: TypeValidator<bigint>;
  BigInt: TypeValidator<bigint>;
  never: TypeValidator<never>;
  anyFunction: TypeValidator<(...args: any) => any>;
  unknownFunction: TypeValidator<(...args: Array<unknown>) => unknown>;
  Function: TypeValidator<(...args: Array<unknown>) => unknown>;
  false: TypeValidator<false>;
  true: TypeValidator<true>;
  falsy: TypeValidator<false | null | undefined | "" | 0>;
  truthy: <T>(target: false | "" | 0 | T | null | undefined) => target is T;
  nonNullOrUndefined: <T>(target: T | null | undefined) => target is T;
  Error: TypeValidator<Error>;
  Symbol: TypeValidator<symbol>;
  symbol: TypeValidator<symbol>;
  RegExp: TypeValidator<RegExp>;
  Date: TypeValidator<Date>;
  anyMap: TypeValidator<Map<any, any>>;
  unknownMap: TypeValidator<Map<unknown, unknown>>;
  map: TypeValidator<Map<unknown, unknown>>;
  Map: TypeValidator<Map<unknown, unknown>>;
  anySet: TypeValidator<Set<any>>;
  unknownSet: TypeValidator<Set<unknown>>;
  set: TypeValidator<Set<unknown>>;
  Set: TypeValidator<Set<unknown>>;
  ArrayBuffer: TypeValidator<ArrayBuffer>;
  SharedArrayBuffer: TypeValidator<SharedArrayBuffer>;
  DataView: TypeValidator<DataView>;
  TypedArray: TypeValidator<
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
  >;
  Int8Array: TypeValidator<Int8Array>;
  Uint8Array: TypeValidator<Uint8Array>;
  Uint8ClampedArray: TypeValidator<Uint8ClampedArray>;
  Int16Array: TypeValidator<Int16Array>;
  Uint16Array: TypeValidator<Uint16Array>;
  Int32Array: TypeValidator<Int32Array>;
  Uint32Array: TypeValidator<Uint32Array>;
  Float32Array: TypeValidator<Float32Array>;
  Float64Array: TypeValidator<Float64Array>;

  // type constructors
  exactString<T extends string>(str: T): TypeValidator<T>;
  exactNumber<T extends number>(num: T): TypeValidator<T>;
  exactBigInt<T extends bigint>(num: T): TypeValidator<T>;
  exactSymbol<T extends symbol>(sym: T): TypeValidator<T>;
  hasClassName<Name extends string>(
    name: Name
  ): TypeValidator<{
    constructor: Function & {
      name: Name;
    };
  }>;
  hasToStringTag(name: string): TypeValidator<any>;
  instanceOf<
    Klass extends Function & {
      prototype: any;
    }
  >(
    klass: Klass
  ): TypeValidator<Klass["prototype"]>;
  stringMatching(regexp: RegExp): TypeValidator<string>;
  symbolFor(key: string): TypeValidator<symbol>;
  arrayOf<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(
    typeValidator: T
  ): TypeValidator<Array<UnwrapTypeFromCoerceableOrValidator<T>>>;
  intersection: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth> &
        UnwrapTypeFromCoerceableOrValidator<Ninth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth> &
        UnwrapTypeFromCoerceableOrValidator<Ninth> &
        UnwrapTypeFromCoerceableOrValidator<Tenth>
    >;
  };
  and: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth> &
        UnwrapTypeFromCoerceableOrValidator<Ninth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth> &
        UnwrapTypeFromCoerceableOrValidator<Ninth> &
        UnwrapTypeFromCoerceableOrValidator<Tenth>
    >;
  };
  union: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
      | UnwrapTypeFromCoerceableOrValidator<Ninth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
      | UnwrapTypeFromCoerceableOrValidator<Ninth>
      | UnwrapTypeFromCoerceableOrValidator<Tenth>
    >;
  };
  or: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
      | UnwrapTypeFromCoerceableOrValidator<Ninth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
      | UnwrapTypeFromCoerceableOrValidator<Ninth>
      | UnwrapTypeFromCoerceableOrValidator<Tenth>
    >;
  };
  mapOf<
    K extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
    V extends TypeValidator<any> | CoerceableToTypeValidator | unknown
  >(
    keyType: K,
    valueType: V
  ): TypeValidator<
    Map<
      UnwrapTypeFromCoerceableOrValidator<K>,
      UnwrapTypeFromCoerceableOrValidator<V>
    >
  >;
  setOf<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(
    itemType: T
  ): TypeValidator<Set<UnwrapTypeFromCoerceableOrValidator<T>>>;
  maybe<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(
    itemType: T
  ): TypeValidator<UnwrapTypeFromCoerceableOrValidator<T> | undefined | null>;
  objectWithProperties<
    T extends {
      [key: string | number | symbol]:
        | TypeValidator<any>
        | CoerceableToTypeValidator
        | unknown;
    }
  >(
    properties: T
  ): TypeValidator<{
    [key in keyof T]: UnwrapTypeFromCoerceableOrValidator<T[key]>;
  }>;
  objectWithOnlyTheseProperties<
    T extends {
      [key: string | number | symbol]:
        | TypeValidator<any>
        | CoerceableToTypeValidator
        | unknown;
    }
  >(
    properties: T
  ): TypeValidator<{
    [key in keyof T]: UnwrapTypeFromCoerceableOrValidator<T[key]>;
  }>;

  mappingObjectOf<
    Values extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
    Keys extends TypeValidator<any> | CoerceableToTypeValidator | unknown
  >(
    keyType: Keys,
    valueType: Values
  ): TypeValidator<
    Record<
      UnwrapTypeFromCoerceableOrValidator<Keys> extends string | number | symbol
        ? UnwrapTypeFromCoerceableOrValidator<Keys>
        : never,
      UnwrapTypeFromCoerceableOrValidator<Values>
    >
  >;
  record<
    Values extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
    Keys extends TypeValidator<any> | CoerceableToTypeValidator | unknown
  >(
    keyType: Keys,
    valueType: Values
  ): TypeValidator<
    Record<
      UnwrapTypeFromCoerceableOrValidator<Keys> extends string | number | symbol
        ? UnwrapTypeFromCoerceableOrValidator<Keys>
        : never,
      UnwrapTypeFromCoerceableOrValidator<Values>
    >
  >;
  partialObjectWithProperties<
    T extends {
      [key: string | number | symbol]:
        | TypeValidator<any>
        | CoerceableToTypeValidator
        | unknown;
    }
  >(
    properties: T
  ): TypeValidator<{
    [key in keyof T]:
      | UnwrapTypeFromCoerceableOrValidator<T[key]>
      | null
      | undefined;
  }>;
  tuple: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>,
        UnwrapTypeFromCoerceableOrValidator<Seventh>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>,
        UnwrapTypeFromCoerceableOrValidator<Seventh>,
        UnwrapTypeFromCoerceableOrValidator<Eighth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>,
        UnwrapTypeFromCoerceableOrValidator<Seventh>,
        UnwrapTypeFromCoerceableOrValidator<Eighth>,
        UnwrapTypeFromCoerceableOrValidator<Ninth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>,
        UnwrapTypeFromCoerceableOrValidator<Seventh>,
        UnwrapTypeFromCoerceableOrValidator<Eighth>,
        UnwrapTypeFromCoerceableOrValidator<Ninth>,
        UnwrapTypeFromCoerceableOrValidator<Tenth>
      ]
    >;
  };

  coerce: <V extends CoerceableToTypeValidator | TypeValidator<any> | unknown>(
    value: V
  ) => TypeValidator<UnwrapTypeFromCoerceableOrValidator<V>>;

  FILE: TypeValidator<FILE>;
  Module: TypeValidator<{ [key: string]: unknown }>;
  Path: TypeValidator<Path>;
  JSX: {
    unknownElement: TypeValidator<
      JSX.Element<{ [key: string | symbol | number]: unknown }, unknown>
    >;
    anyElement: TypeValidator<JSX.Element<any, any>>;
    Element: TypeValidator<
      JSX.Element<{ [key: string | symbol | number]: unknown }, unknown>
    >;
    Fragment: TypeValidator<JSX.Fragment>;
  };
};

declare const is: <T extends TypeValidator<any> | CoerceableToTypeValidator>(
  value: any,
  type: T
) => value is UnwrapTypeFromCoerceableOrValidator<T>;

declare const assert: {
  /**
   * Throws an error if `value` is not truthy.
   *
   * @param value - The value to test for truthiness
   * @param message - An optional error message to use. If unspecified, "Assertion failed" will be used.
   */
  <ValueType>(
    value: ValueType,
    message?: string
  ): asserts value is ValueType extends null | undefined | false | 0 | ""
    ? never
    : ValueType;

  /**
   * Throws an error if `value` is not of the type `type`.
   *
   * `type` should be either a {@link TypeValidator}, or a value which can be coerced into one via {@link types.coerce}.
   */
  type: <T extends TypeValidator<any> | CoerceableToTypeValidator>(
    value: any,
    type: T,
    optionalMessage?: string
  ) => asserts value is UnwrapTypeFromCoerceableOrValidator<T>;
};

/**
 * The data source of a pipe operation; either an in-memory object, or a
 * file stream.
 *
 * - Use `maxLength` to limit how much data to read.
 * - Use `until` to stop reading once a certain byte or character has been
 *   read.
 * - Use `path` or `fd` to open a file.
 */
declare type PipeSource =
  | { data: string; maxLength?: number; until?: string | byte }
  | ArrayBuffer
  | { data: ArrayBuffer; maxLength?: number; until?: string | byte }
  | SharedArrayBuffer
  | { data: SharedArrayBuffer; maxLength?: number; until?: string | byte }
  | TypedArray
  | { data: TypedArray; maxLength?: number; until?: string | byte }
  | DataView
  | { data: DataView; maxLength?: number; until?: string | byte }
  | FILE
  | {
      data: FILE;
      maxLength?: number;
      until?: string | byte;
    }
  | { path: string; maxLength?: number; until?: string | byte }
  | { fd: number; maxLength?: number; until?: string | byte };

/**
 * The target destination of a pipe operation; either an in-memory object, or a
 * file stream.
 *
 * - Use `intoExisting` to put data into an existing object or file handle.
 * - Use `intoNew` to put data into a new object.
 * - Use `path` or `fd` to create a new file handle and put data into it.
 */
declare type PipeDestination =
  | ArrayBuffer
  | SharedArrayBuffer
  | DataView
  | TypedArray
  | FILE
  | ArrayBufferConstructor
  | SharedArrayBufferConstructor
  | DataViewConstructor
  | TypedArrayConstructor
  | StringConstructor
  | { path: string }
  | { fd: number };

/**
 * Copy data from one source into the given target. Returns the number of bytes
 * written, and the target that data was written into.
 */
declare function pipe<Dest extends PipeDestination>(
  from: PipeSource,
  to: Dest
): {
  bytesTransferred: number;
  target: Dest extends
    | ArrayBuffer
    | SharedArrayBuffer
    | DataView
    | FILE
    | { path: string }
    | { fd: number }
    ? Dest
    : Dest extends
        | ArrayBufferConstructor
        | SharedArrayBufferConstructor
        | DataViewConstructor
        | TypedArrayConstructor
        | DataViewConstructor
    ? Dest["prototype"]
    : Dest extends StringConstructor
    ? string
    : never;
};

/**
 * Launch the Yavascript REPL (read-eval-print-loop).
 *
 * @param context Variables to make available as globals within the repl.
 * @param lang The langauge to use in the repl. Defaults to "javascript".
 */
declare function startRepl(
  context?: { [key: string]: any },
  lang?:
    | "js"
    | "javascript"
    | "ts"
    | "typescript"
    | "jsx"
    | "tsx"
    | "coffee"
    | "coffeescript"
): void;

/**
 * Returns the absolute path to the root folder of the git/hg repo.
 *
 * This is done by running `git rev-parse --show-toplevel` and `hg root`.
 *
 * If `relativeTo` is provided, the git and hg commands will be executed in
 * that folder instead of in `pwd()`.
 */
declare function repoRoot(relativeTo?: string): string;

/**
 * Returns whether the provided path is ignored by git.
 */
declare function isGitignored(path: string): boolean;

/**
 * Configures the default value of `trace` in functions which receive `trace`
 * as an option.
 *
 * - If called with `true`, the default value of `trace` in all functions which
 *   receive a `trace` option will be changed to `console.error`.
 * - If called with `false`, the default value of `trace` in all functions which
 *   receive a `trace` option will be changed to `undefined`.
 * - If called with any other value, the provided value will be used as the
 *   default value of `trace` in all functions which receive a `trace` option.
 *
 * If you would like to make your own functions use the default value of
 * `trace` as set by this function (in order to get the same behavior as
 * yavascript API functions which do so), call `traceAll.getDefaultTrace()` to
 * get the value which should be used as the default value.
 */
declare const traceAll: ((
  trace: boolean | undefined | ((...args: Array<any>) => void)
) => void) & {
  getDefaultTrace(): ((...args: Array<any>) => void) | undefined;
};

declare namespace JSX {
  /**
   * A string containing the expression that should be called to create JSX
   * elements.
   *
   * Defaults to "JSX.createElement".
   *
   * If changed, any JSX code loaded afterwards will use a different
   * expression.
   *
   * Note that if you change this, you need to verify that the following
   * expression always evaluates to `true` (by changing {@link types.JSX.Element}
   * and {@link types.JSX.Fragment}):
   * ```jsx
   * types.JSX.Element(<a />) && types.JSX.Fragment(<></>)
   * ```
   *
   * Failure to uphold this guarantee indicates a bug.
   */
  export let pragma: string;

  /**
   * A string containing the expression that should be used as the first
   * parameter when creating JSX fragment elements.
   *
   * Defaults to "JSX.Fragment".
   *
   * If changed, any JSX code loaded afterwards will use a different
   * expression.
   *
   * Note that if you change this, you need to verify that the following
   * expression always evaluates to `true` (by changing {@link types.JSX.Element}
   * and {@link types.JSX.Fragment}):
   * ```jsx
   * types.JSX.Element(<a />) && types.JSX.Fragment(<></>)
   * ```
   *
   * Failure to uphold this guarantee indicates a bug.
   */
  export let pragmaFrag: string;

  export const Element: unique symbol;

  export interface Element<
    Props = { [key: string | symbol | number]: any },
    Type = any
  > {
    $$typeof: typeof Element;
    type: Type;
    props: Props;
    key: string | number | null;
  }

  /**
   * The value which gets passed into the JSX element constructor (as
   * determined by {@link JSX.pragma}) when JSX fragment syntax is used (unless
   * {@link JSX.pragmaFrag} is changed).
   */
  export const Fragment: unique symbol;

  export type Fragment = Element<{}, typeof Fragment>;

  /**
   * The JSX element constructor, which gets invoked whenever JSX syntax is
   * used (unless {@link JSX.pragma} is changed).
   */
  export const createElement: {
    <Type extends string | typeof Fragment | ((...args: any) => any)>(
      type: Type
    ): Element<{}, Type>;
    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Props extends { [key: string | number | symbol]: any }
    >(
      type: Type,
      props: Props
    ): Element<Props, Type>;

    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Props extends { [key: string | number | symbol]: any },
      Children extends Array<any>
    >(
      type: Type,
      props: Props,
      ...children: Children
    ): Element<Props & { children: Children }, Type>;

    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Children extends Array<any>
    >(
      type: Type,
      ...children: Children
    ): Element<{ children: Children }, Type>;
  };
}

declare const YAML: {
  /**
   * Parse a YAML document (`input`) into a JSON-compatible value.
   */
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any
  ): any;

  /**
   * Convert a JSON-compatible value into a YAML document.
   */
  stringify(
    input: any,
    replacer?:
      | ((this: any, key: string, value: any) => any)
      | (number | string)[]
      | null,
    indent?: number
  ): string;
};

declare const CSV: {
  /**
   * Parse a CSV string into an Array of Arrays of strings.
   *
   * The outer array holds the rows, and the inner arrays hold the items in
   * each row.
   */
  parse(input: string): Array<Array<string>>;

  /**
   * Convert an Array of Arrays of strings into a CSV string.
   *
   * The outer array holds the rows, and the inner arrays hold the items in
   * each row.
   */
  stringify(input: Array<Array<string>>): string;
};

interface RegExpConstructor {
  /** See https://github.com/tc39/proposal-regex-escaping */
  escape(str: any): string;
}

// prettier-ignore
/** Any integer in the range [0, 255]. */
declare type byte =
|   0 |   1 |   2 |   3 |   4 |   5 |   6 |   7 |   8 |   9 |  10 |  11 |  12 |  13 |  14 |  15 
|  16 |  17 |  18 |  19 |  20 |  21 |  22 |  23 |  24 |  25 |  26 |  27 |  28 |  29 |  30 |  31 
|  32 |  33 |  34 |  35 |  36 |  37 |  38 |  39 |  40 |  41 |  42 |  43 |  44 |  45 |  46 |  47 
|  48 |  49 |  50 |  51 |  52 |  53 |  54 |  55 |  56 |  57 |  58 |  59 |  60 |  61 |  62 |  63 
|  64 |  65 |  66 |  67 |  68 |  69 |  70 |  71 |  72 |  73 |  74 |  75 |  76 |  77 |  78 |  79 
|  80 |  81 |  82 |  83 |  84 |  85 |  86 |  87 |  88 |  89 |  90 |  91 |  92 |  93 |  94 |  95 
|  96 |  97 |  98 |  99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 
| 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 
| 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 
| 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 
| 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 
| 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 
| 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 
| 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 
| 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 
| 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255;

// Convenience aliases to provide parity with TypeScript types.
declare var number: NumberConstructor;
declare var string: StringConstructor;
declare var boolean: BooleanConstructor;
declare var bigint: BigIntConstructor;
declare var symbol: SymbolConstructor;

declare type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;
declare type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

// ==========================================
// ------------------------------------------
// QuickJS APIs, which YavaScript builds upon
// ------------------------------------------
// ==========================================
// Definitions of the globals and modules added by quickjs-libc

/**
 * Provides the command line arguments. The first argument is the script name.
 */
declare var scriptArgs: Array<string>;

/**
 * Print the arguments separated by spaces and a trailing newline.
 *
 * Non-string args are coerced into a string via [ToString](https://tc39.es/ecma262/#sec-tostring).
 * Objects can override the default `ToString` behavior by defining a `toString` method.
 */
declare var print: (...args: Array<any>) => void;

/**
 * Object that provides functions for logging information.
 */
declare var console: {
  /** Same as {@link print}(). */
  log: typeof print;

  /** Same as {@link print}(). */
  warn: typeof print;

  /** Same as {@link print}(). */
  error: typeof print;

  /** Same as {@link print}(). */
  info: typeof print;
};

/** An object representing a file handle. */
declare interface FILE {
  /**
   * Human-readable description of where this FILE points.
   *
   * If `target` is a number, the FILE was opened with fdopen, and `target` is
   * the fd. Otherwise, `target` will be an arbitrary string that describes the
   * file; it may be the absolute path to the file, the relative path to the
   * file at time of its opening, or some other string like "stdin" or
   * "tmpfile".
   *
   * You should *not* use this property for anything other than logging and
   * debugging. It is *only* provided for debugging and/or troubleshooting
   * purposes. The value of this property could change at any time when
   * upgrading yavascript, even if upgrading by a minor or patch release.
   */
  target: string | number;

  /**
   * Close the file handle. Note that for files other than stdin/stdout/stderr,
   * the file will be closed automatically when the `FILE` object is
   * garbage-collected.
   */
  close(): void;

  /** Outputs the string with the UTF-8 encoding. */
  puts(...strings: Array<string>): void;

  /**
   * Formatted printf.
   *
   * The same formats as the standard C library `printf` are supported. Integer format types (e.g. `%d`) truncate the Numbers or BigInts to 32 bits. Use the `l` modifier (e.g. `%ld`) to truncate to 64 bits.
   */
  printf(fmt: string, ...args: Array<any>): void;

  /** Flush the buffered file. Wrapper for C `fflush`. */
  flush(): void;

  /** Sync the buffered file to disk. Wrapper for C `fsync`. */
  sync(): void;

  /**
   * Seek to a given file position (whence is `std.SEEK_*`).
   *
   * `offset` can be a number or a bigint.
   */
  seek(offset: number, whence: number): void;

  /** Return the current file position. */
  tell(): number;

  /** Return the current file position as a bigint. */
  tello(): BigInt;

  /** Return true if end of file. */
  eof(): boolean;

  /** Return the associated OS handle. */
  fileno(): number;

  /** Read `length` bytes from the file to the ArrayBuffer `buffer` at byte position `position` (wrapper to the libc `fread`). Returns the number of bytes read, or `0` if the end of the file has been reached.  */
  read(buffer: ArrayBuffer, position: number, length: number): number;

  /** Write `length` bytes from the ArrayBuffer `buffer` at byte position `position` into the file (wrapper to the libc `fwrite`). Returns the number of bytes written. */
  write(buffer: ArrayBuffer, position: number, length: number): number;

  /**
   * Return the next line from the file, assuming UTF-8 encoding, excluding the trailing line feed or EOF.
   *
   * If the end of the file has been reached, then `null` will be returned instead of a string.
   *
   * Note: Although the trailing line feed has been removed, a carriage return (`\r`) may still be present.
   */
  getline(): string | null;

  /** Read `maxSize` bytes from the file and return them as a string assuming UTF-8 encoding. If `maxSize` is not present, the file is read up its end. */
  readAsString(maxSize?: number): string;

  /** Return the next byte from the file. Return -1 if the end of file is reached. */
  getByte(): number;

  /** Write one byte to the file. */
  putByte(value: number): void;
}

declare module "quickjs:std" {
  /**
   * Exit the process with the provided status code.
   *
   * @param statusCode The exit code; 0 for success, nonzero for failure.
   */
  export function exit(statusCode: number): void;

  /**
   * Evaluate the string `code` as a script (global eval).
   *
   * @param code - The code to evaluate.
   * @param options - An optional object containing the following optional properties:
   * @property backtraceBarrier - Boolean (default = false). If true, error backtraces do not list the stack frames below the evalScript.
   * @returns The result of the evaluation.
   */
  export function evalScript(
    code: string,
    options?: { backtraceBarrier?: boolean }
  ): any;

  /**
   * Evaluate the file `filename` as a script (global eval).
   *
   * @param filename - The relative or absolute path to the file to load. Relative paths are resolved relative to the process's current working directory.
   * @returns The result of the evaluation.
   */
  export function loadScript(filename: string): any;

  /**
   * Evaluate the file `filename` as a module. Effectively a synchronous dynamic `import()`.
   *
   * @param filename - The relative or absolute path to the file to import. Relative paths are resolved relative to the file calling `importModule`, or `basename` if present.
   * @param basename - If present and `filename` is a relative path, `filename` will be resolved relative to this basename.
   * @returns The result of the evaluation (module namespace object).
   */
  export function importModule(
    filename: string,
    basename?: string
  ): { [key: string]: any };

  /**
   * Return the resolved path to a module.
   *
   * @param filename - The relative or absolute path to the file to import. Relative paths are resolved relative to the file calling `importModule`, or `basename` if present.
   * @param basename - If present and `filename` is a relative path, `filename` will be resolved relative to this basename.
   * @returns The resolved module path.
   */
  export function resolveModule(filename: string, basename?: string): string;

  /**
   * Load the file `filename` and return it as a string assuming UTF-8 encoding.
   *
   * @param filename - The relative or absolute path to the file to load. Relative paths are resolved relative to the process's current working directory.
   */
  export function loadFile(filename: string): string;

  /**
   * Read the script of module filename from an active stack frame, then return it as a string.
   *
   * If there isn't a valid filename for the specified stack frame, an error will be thrown.
   *
   * @param stackLevels - How many levels up the stack to search for a filename. Defaults to 0, which uses the current stack frame.
   */
  export function getFileNameFromStack(stackLevels?: number): string;

  /**
   * Return a boolean indicating whether the provided value is a FILE object.
   *
   * @param value - The value to check.
   * @returns Whether the value was a `FILE` or not.
   */
  export function isFILE(value: any): boolean;

  /**
   * Open a file (wrapper to the libc `fopen()`).
   * Return the FILE object.
   *
   * @param filename - The relative or absolute path to the file to open. Relative paths are resolved relative to the process's current working directory.
   * @param flags - A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
   * @returns The opened FILE object.
   */
  export function open(filename: string, flags: string): FILE;

  /**
   * Open a process by creating a pipe (wrapper to the libc `popen()`).
   * Return the FILE object.
   *
   * @param command - The command line to execute. Gets passed via `/bin/sh -c`.
   * @param flags - A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
   * @returns The opened FILE object.
   */
  export function popen(command: string, flags: string): FILE;

  /**
   * Open a file from a file handle (wrapper to the libc `fdopen()`).
   * Return the FILE object.
   *
   * @param fd - The file handle to open.
   * @param flags - A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
   * @returns The opened FILE object.
   */
  export function fdopen(fd: number, flags: string): FILE;

  /**
   * Open a temporary file.
   * Return the FILE object.
   *
   * @returns The opened FILE object.
   */
  export function tmpfile(): FILE;

  /** Equivalent to `std.out.puts(str)`. */
  export function puts(...strings: Array<string>): void;

  /** Equivalent to `std.out.printf(fmt, ...args)` */
  export function printf(fmt: string, ...args: Array<any>): void;

  /** Equivalent to the libc sprintf(). */
  export function sprintf(fmt: string, ...args: Array<any>): void;

  /** Wrapper to the libc file stdin. */
  var in_: FILE;

  export { in_ as in };

  /** Wrapper to the libc file stdout. */
  export var out: FILE;

  /** Wrapper to the libc file stderr. */
  export var err: FILE;

  /** Constant for {@link FILE.seek}. Declares that pointer offset should be relative to the beginning of the file. See also libc `fseek()`. */
  export var SEEK_SET: number;

  /** Constant for {@link FILE.seek}. Declares that the offset should be relative to the current position of the FILE handle. See also libc `fseek()`. */
  export var SEEK_CUR: number;

  /** Constant for {@link FILE.seek}. Declares that the offset should be relative to the end of the file. See also libc `fseek()`. */
  export var SEEK_END: number;

  /** Manually invoke the cycle removal algorithm (garbage collector). The cycle removal algorithm is automatically started when needed, so this function is useful in case of specific memory constraints or for testing. */
  export function gc(): void;

  /** Return the value of the environment variable `name` or `undefined` if it is not defined. */
  export function getenv(name: string): string | undefined;

  /** Set the value of the environment variable `name` to the string `value`. */
  export function setenv(name: string, value: string): void;

  /** Delete the environment variable `name`. */
  export function unsetenv(name: string): void;

  /** Return an object containing the environment variables as key-value pairs. */
  export function getenviron(): { [key: string]: string | undefined };

  interface UrlGet {
    /**
     * Download `url` using the `curl` command line utility. Returns string
     * when the http status code is between 200 and 299, and throws otherwise.
     *
     * Pass an object with { full: true } as the second argument to get
     * response headers and status code.
     */
    (url: string): string;

    /**
     * Download `url` using the `curl` command line utility. Returns string
     * when the http status code is between 200 and 299, and throws otherwise.
     *
     * Pass an object with { full: true } as the second argument to get
     * response headers and status code.
     */
    (url: string, options: { binary: false }): string;

    /**
     * Download `url` using the `curl` command line utility. Returns string
     * when the http status code is between 200 and 299, and throws otherwise.
     *
     * Pass an object with { full: true } as the second argument to get
     * response headers and status code.
     */
    (url: string, options: { full: false }): string;

    /**
     * Download `url` using the `curl` command line utility. Returns string
     * when the http status code is between 200 and 299, and throws otherwise.
     *
     * Pass an object with { full: true } as the second argument to get
     * response headers and status code.
     */
    (url: string, options: { binary: false; full: false }): string;

    /**
     * Download `url` using the `curl` command line utility. Returns
     * ArrayBuffer when the http status code is between 200 and 299, and throws
     * otherwise.
     *
     * Pass an object with { full: true } as the second argument to get
     * response headers and status code.
     */
    (url: string, options: { binary: true }): ArrayBuffer;

    /**
     * Download `url` using the `curl` command line utility. Returns
     * ArrayBuffer when the http status code is between 200 and 299, and throws
     * otherwise.
     *
     * Pass an object with { full: true } as the second argument to get
     * response headers and status code.
     */
    (url: string, options: { binary: true; full: false }): ArrayBuffer;

    /**
     * Download `url` using the `curl` command line utility.
     *
     * Returns an object with three properties:
     *
     * - `response`: response body content (string)
     * - `responseHeaders`: headers separated by CRLF (string)
     * - `status`: status code (number)
     */
    (url: string, options: { full: true }): {
      status: number;
      response: string;
      responseHeaders: string;
    };

    /**
     * Download `url` using the `curl` command line utility.
     *
     * Returns an object with three properties:
     *
     * - `response`: response body content (string)
     * - `responseHeaders`: headers separated by CRLF (string)
     * - `status`: status code (number)
     */
    (url: string, options: { full: true; binary: false }): {
      status: number;
      response: string;
      responseHeaders: string;
    };

    /**
     * Download `url` using the `curl` command line utility.
     *
     * Returns an object with three properties:
     *
     * - `response`: response body content (ArrayBuffer)
     * - `responseHeaders`: headers separated by CRLF (string)
     * - `status`: status code (number)
     */
    (url: string, options: { full: true; binary: true }): {
      status: number;
      response: ArrayBuffer;
      responseHeaders: string;
    };
  }

  export var urlGet: UrlGet;

  /**
   * Parse `str` using a superset of JSON.parse. The following extensions are accepted:
   *
   * - Single line and multiline comments
   * - unquoted properties (ASCII-only Javascript identifiers)
   * - trailing comma in array and object definitions
   * - single quoted strings
   * - `\f` and `\v` are accepted as space characters
   * - leading plus in numbers
   * - octal (0o prefix) and hexadecimal (0x prefix) numbers
   */
  export function parseExtJSON(str: string): any;
}

declare module "quickjs:os" {
  /**
   * Open a file handle. Returns a number; the file descriptor.
   *
   * @param filename - The path to the file to open.
   * @param flags - Numeric flags that set the mode to use when opening the file. See `os.O_*`
   * @param mode - Octal access mask. Defaults to 0o666.
   */
  export function open(filename: string, flags: number, mode?: number): number;

  /** POSIX open flag, used in {@link open}. */
  export var O_RDONLY: number;

  /** POSIX open flag, used in {@link open}. */
  export var O_WRONLY: number;

  /** POSIX open flag, used in {@link open}. */
  export var O_RDWR: number;

  /** POSIX open flag, used in {@link open}. */
  export var O_APPEND: number;

  /** POSIX open flag, used in {@link open}. */
  export var O_CREAT: number;

  /** POSIX open flag, used in {@link open}. */
  export var O_EXCL: number;

  /** POSIX open flag, used in {@link open}. */
  export var O_TRUNC: number;

  /** Windows-specific open flag: open the file in text mode. The default is binary mode. Used in {@link open}. */
  export var O_TEXT: number;

  /** Close the file with descriptor `fd`. */
  export function close(fd: number): void;

  interface OsSeek {
    /** Seek in the file. Use `std.SEEK_*` for `whence`. `offset` is either a number or a bigint. If `offset` is a bigint, a bigint is returned too. */
    (fd: number, offset: number, whence: number): number;

    /** Seek in the file. Use `std.SEEK_*` for `whence`. `offset` is either a number or a bigint. If `offset` is a bigint, a bigint is returned too. */
    (fd: number, offset: BigInt, whence: number): BigInt;
  }

  /** Seek in the file. Use `std.SEEK_*` for `whence`. `offset` is either a number or a bigint. If `offset` is a bigint, a bigint is returned too. */
  export var seek: OsSeek;

  /** Read `length` bytes from the file with descriptor `fd` to the ArrayBuffer `buffer` at byte position `offset`. Return the number of read bytes. */
  export function read(
    fd: number,
    buffer: ArrayBuffer,
    offset: number,
    length: number
  ): number;

  /** Write `length` bytes to the file with descriptor `fd` from the ArrayBuffer `buffer` at byte position `offset`. Return the number of written bytes. */
  export function write(
    fd: number,
    buffer: ArrayBuffer,
    offset: number,
    length: number
  ): number;

  /** Return `true` if the file opened with descriptor `fd` is a TTY (terminal). */
  export function isatty(fd: number): boolean;

  /** Return the TTY size as `[width, height]` or `null` if not available. */
  export function ttyGetWinSize(fd: number): null | [number, number];

  /** Set the TTY in raw mode. */
  export function ttySetRaw(fd: number): void;

  /** Remove a file. */
  export function remove(filename: string): void;

  /** Rename a file. */
  export function rename(oldname: string, newname: string): void;

  /** Return the canonicalized absolute pathname of `path`. */
  export function realpath(path: string): string;

  /** Return the current working directory. */
  export function getcwd(): string;

  /** Change the current directory. */
  export function chdir(path: string): void;

  /** Create a directory at `path`. */
  export function mkdir(path: string, mode?: number): void;

  export type Stats = {
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blocks: number;
    atime: number;
    mtime: number;
    ctime: number;
  };

  /**
   * Return a stats object with the following fields:
   *
   * - `dev`
   * - `ino`
   * - `mode`
   * - `nlink`
   * - `uid`
   * - `gid`
   * - `rdev`
   * - `size`
   * - `blocks`
   * - `atime`
   * - `mtime`
   * - `ctime`
   *
   * The times are specified in milliseconds since 1970. `lstat()` is the same as `stat()` except that it returns information about the link itself.
   */
  export function stat(path: string): Stats;

  /**
   * Return a stats object with the following fields:
   *
   * - `dev`
   * - `ino`
   * - `mode`
   * - `nlink`
   * - `uid`
   * - `gid`
   * - `rdev`
   * - `size`
   * - `blocks`
   * - `atime`
   * - `mtime`
   * - `ctime`
   *
   * The times are specified in milliseconds since 1970. `lstat()` is the same as `stat()` except that it returns information about the link itself.
   */
  export function lstat(path: string): Stats;

  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_IFMT: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_IFIFO: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_IFCHR: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_IFDIR: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_IFBLK: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_IFREG: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_IFSOCK: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_IFLNK: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_ISGID: number;
  /** Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`. */
  export var S_ISUID: number;

  /**
   * Change the access and modification times of the file path.
   *
   * The times are specified in milliseconds since 1970.
   */
  export function utimes(path: string, atime: number, mtime: number): void;

  /** Create a link at `linkpath` containing the string `target`. */
  export function symlink(target: string, linkpath: string): void;

  /** Return the link target. */
  export function readlink(path: string): string;

  /** Return an array of strings containing the filenames of the directory `path`. */
  export function readdir(path: string): Array<string>;

  /** Add a read handler to the file with descriptor `fd`. `func` is called each time there is data pending for `fd`. A single read handler per file handle is supported. Use `func = null` to remove the handler. */
  export function setReadHandler(fd: number, func: null | (() => void)): void;

  /** Add a write handler to the file with descriptor `fd`. `func` is called each time data can be written to `fd`. A single write handler per file handle is supported. Use `func = null` to remove the handler. */
  export function setWriteHandler(fd: number, func: null | (() => void)): void;

  /** Call the function `func` when the signal `signal` happens. Only a single handler per signal number is supported. Use `null` to set the default handler or `undefined` to ignore the signal. Signal handlers can only be defined in the main thread. */
  export function signal(
    signal: number,
    func: null | undefined | (() => void)
  ): void;

  /** POSIX signal number. */
  export var SIGINT: number;

  /** POSIX signal number. */
  export var SIGABRT: number;

  /** POSIX signal number. */
  export var SIGFPE: number;

  /** POSIX signal number. */
  export var SIGILL: number;

  /** POSIX signal number. */
  export var SIGSEGV: number;

  /** POSIX signal number. */
  export var SIGTERM: number;

  /** Send the signal `sig` to the process `pid`. Use `os.SIG*` constants. */
  export function kill(pid: number, sig: number): void;

  export type ExecOptions = {
    /** Boolean (default = true). If true, wait until the process is terminated. In this case, `exec` returns the exit code if positive or the negated signal number if the process was interrupted by a signal. If false, do not block and return the process id of the child. */
    block?: boolean;

    /** Boolean (default = true). If true, the file is searched in the `PATH` environment variable. */
    usePath?: boolean;

    /** String (default = `args[0]`). Set the file to be executed. */
    file?: string;

    /** String. If present, set the working directory of the new process. */
    cwd?: string;

    /** If present, set the file descriptor in the child for stdin. */
    stdin?: number;

    /** If present, set the file descriptor in the child for stdout. */
    stdout?: number;

    /** If present, set the file descriptor in the child for stderr. */
    stderr?: number;

    /** Object. If present, set the process environment from the object key-value pairs. Otherwise use the same environment as the current process. To get the current process's environment variables as on object, use `std.getenviron()`. */
    env?: { [key: string | number]: string | number | boolean };

    /** Integer. If present, the process uid with `setuid`. */
    uid?: number;

    /** Integer. If present, the process gid with `setgid`. */
    gid?: number;
  };

  /** Execute a process with the arguments args, and the provided options (if any). */
  export function exec(args: Array<string>, options?: ExecOptions): number;

  /**
   * `waitpid` Unix system call. Returns the array [ret, status].
   *
   * From man waitpid(2):
   *
   * waitpid(): on success, returns the process ID of the child whose state has changed; if WNOHANG was specified and one or more child(ren) specified by pid exist, but have not yet changed state, then 0 is returned.
   */
  export function waitpid(pid: number, options?: number): [number, number];

  /** Constant for the `options` argument of `waitpid`. */
  export var WNOHANG: number;
  /** Constant for the `options` argument of `waitpid`. */
  export var WUNTRACED: number;

  /** Function to be used to interpret the 'status' return value of `waitpid`. */
  export function WEXITSTATUS(status: number): number;
  /** Function to be used to interpret the 'status' return value of `waitpid`. */
  export function WTERMSIG(status: number): number;
  /** Function to be used to interpret the 'status' return value of `waitpid`. */
  export function WSTOPSIG(status: number): number;

  /** Function to be used to interpret the 'status' return value of `waitpid`. */
  export function WIFEXITED(status: number): boolean;
  /** Function to be used to interpret the 'status' return value of `waitpid`. */
  export function WIFSIGNALED(status: number): boolean;
  /** Function to be used to interpret the 'status' return value of `waitpid`. */
  export function WIFSTOPPED(status: number): boolean;
  /** Function to be used to interpret the 'status' return value of `waitpid`. */
  export function WIFCONTINUED(status: number): boolean;

  /** `dup` Unix system call. */
  export function dup(fd: number): number;

  /** `dup2` Unix system call. */
  export function dup2(oldfd: number, newfd: number): number;

  /** `pipe` Unix system call. Return two handles as `[read_fd, write_fd]`. */
  export function pipe(): null | [number, number];

  /** Sleep for `delay_ms` milliseconds. */
  export function sleep(delay_ms: number): void;

  export type OSTimer = { [Symbol.toStringTag]: "OSTimer" };

  /** Call the function func after delay ms. Return a handle to the timer. */
  export function setTimeout(
    func: (...args: any) => any,
    delay: number
  ): OSTimer;

  /** Cancel a timer. */
  export function clearTimeout(handle: OSTimer): void;

  /** Return a string representing the platform: "linux", "darwin", "win32", "freebsd", or "js" (emscripten). */
  export var platform: "linux" | "darwin" | "win32" | "freebsd" | "js";

  /**
   * Things that can be put into Worker.postMessage.
   *
   * NOTE: This is effectively the same stuff as supported by the structured
   * clone algorithm, but without support for Map/Set (not supported in
   * QuickJS yet).
   */
  export type StructuredClonable =
    | string
    | number
    | boolean
    | null
    | undefined
    | Boolean
    | String
    | Date
    | RegExp
    | ArrayBuffer
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array
    | DataView
    | Array<StructuredClonable>
    | SharedArrayBuffer
    // Map and Set not yet supported
    // | Map<StructuredClonable, StructuredClonable>
    // | Set<StructuredClonable>
    | { [key: string | number]: StructuredClonable };

  export class Worker {
    /**
     * Constructor to create a new thread (worker) with an API close to the
     * `WebWorkers`. `moduleFilename` is a string specifying the module
     * filename which is executed in the newly created thread. As for
     * dynamically imported module, it is relative to the current script or
     * module path. Threads normally don’t share any data and communicate
     * between each other with messages. Nested workers are not supported.
     */
    constructor(moduleFilename: string);

    /**
     * In the created worker, Worker.parent represents the parent worker and is
     * used to send or receive messages.
     */
    static parent: Worker;

    /**
     * Send a message to the corresponding worker. msg is cloned in the
     * destination worker using an algorithm similar to the HTML structured
     * clone algorithm. SharedArrayBuffer are shared between workers.
     *
     * Current limitations: Map and Set are not supported yet.
     */
    postMessage(msg: StructuredClonable): void;

    /**
     * Set a function which is called each time a message is received. The
     * function is called with a single argument. It is an object with a data
     * property containing the received message. The thread is not terminated
     * if there is at least one non null onmessage handler.
     */
    onmessage: null | ((event: { data: StructuredClonable }) => void);
  }

  /** constant for {@link access}(); test for read permission. */
  export var R_OK: number;

  /** constant for {@link access}(); test for write permission. */
  export var W_OK: number;

  /** constant for {@link access}(); test for execute (search) permission. */
  export var X_OK: number;

  /** constant for {@link access}(); test for existence of file. */
  export var F_OK: number;

  /** `access` Unix system call; checks if a file is readable, writable, executable, and/or exists (use {@link R_OK}, {@link W_OK}, {@link X_OK}, and/or {@link F_OK} for `accessMode`). Throws a descriptive error (with errno property) if the requested access is not available; otherwise, returns undefined. */
  export function access(path: string, accessMode: number): void;

  /** gets the path to the executable which is executing this JS code. might be a relative path or symlink. */
  export function execPath(): string;

  /** changes the access permission bits of the file at `path` using the octal number `mode`. */
  export function chmod(path: string, mode: number): void;
}

/**
 * Options for {@link inspect}.
 */
declare interface InspectOptions {
  /** Whether to display non-enumerable properties. Defaults to false. */
  all?: boolean;

  /** Whether to invoke getter functions. Defaults to false. */
  followGetters?: boolean;

  /** Whether to display the indexes of iterable entries. Defaults to false. */
  indexes?: boolean;

  /** Hide object details after 𝑁 recursions. Defaults to Infinity. */
  maxDepth?: number;

  /** If true, don't identify well-known symbols as `@@…`. Defaults to false. */
  noAmp?: boolean;

  /** If true, don't format byte-arrays as hexadecimal. Defaults to false. */
  noHex?: boolean;

  /** If true, don't display function source code. Defaults to false. */
  noSource?: boolean;

  /** Whether to show `__proto__` properties if possible. Defaults to false. */
  proto?: boolean;

  /** Whether to sort properties alphabetically. When false, properties are sorted by creation order. Defaults to false. */
  sort?: boolean;

  /** Options that control whether and how ANSI terminal escape sequences for colours should be added to the output. Defaults to false, meaning no colours. */
  colours?: boolean | 256 | 8 | InspectColours;

  /** Prefix string to use for indentation. Defaults to '\t'. */
  indent?: string;
}

declare interface InspectColours {
  off?: string | number;
  red?: string | number;
  grey?: string | number;
  green?: string | number;
  darkGreen?: string | number;
  punct?: string | number;
  keys?: string | number;
  keyEscape?: string | number;
  typeColour?: string | number;
  primitive?: string | number;
  escape?: string | number;
  date?: string | number;
  hexBorder?: string | number;
  hexValue?: string | number;
  hexOffset?: string | number;
  reference?: string | number;
  srcBorder?: string | number;
  srcRowNum?: string | number;
  srcRowText?: string | number;
  nul?: string | number;
  nulProt?: string | number;
  undef?: string | number;
  noExts?: string | number;
  frozen?: string | number;
  sealed?: string | number;
  regex?: string | number;
  string?: string | number;
  symbol?: string | number;
  symbolFade?: string | number;
  braces?: string | number;
  quotes?: string | number;
  empty?: string | number;
  dot?: string | number;
}

declare interface InspectFunction {
  /**
   * Generate a human-readable representation of a value.
   *
   * @param value - Value to inspect
   * @param options - Additional settings for refining output
   * @returns A string representation of `value`.
   */
  (value: any, options?: InspectOptions): string;

  /**
   * Generate a human-readable representation of a value.
   *
   * @param value - Value to inspect
   * @param key - The value's corresponding member name
   * @param options - Additional settings for refining output
   * @returns A string representation of `value`.
   */
  (value: any, key?: string | symbol, options?: InspectOptions): string;
}

/**
 * Generate a human-readable representation of a value.
 *
 * @param value - Value to inspect
 * @param key - The value's corresponding member name
 * @param options - Additional settings for refining output
 * @returns A string representation of `value`.
 */
declare var inspect: InspectFunction;

/**
 * A class which represents a module namespace object. Note, however, that
 * instances of this class cannot be constructed manually, and must instead be
 * obtained from `import * as`, `import()`, `std.importModule`, or `require`.
 *
 * The static properties on `Module` let you configure the module loader
 * (import/export/require). You can use these properties to add support for
 * importing new filetypes.
 */
declare class Module {
  /** A module namespace object has arbitrary exports. */
  [key: string | number | symbol]: any;

  /**
   * Module objects are not constructable.
   *
   * You must instead obtain them using import or require.
   */
  private constructor();

  /**
   * Returns true if `target` is a module namespace object.
   */
  static [Symbol.hasInstance](target: any): target is Module;

  /**
   * A list of filetype extensions that may be omitted from an import specifier
   * string.
   *
   * Defaults to `[".js"]`. You can add more strings to this array to
   * make the engine search for additional files when resolving a
   * require/import.
   *
   * See the doc comment on {@link require} for more information.
   *
   * NOTE: If you add a new extension to this array, you will likely also want
   * to add to {@link Module.compilers}.
   */
  static searchExtensions: Array<string>;

  /**
   * User-defined functions which will handle getting the JavaScript code
   * associated with a module.
   *
   * The key for each property in this object should be a file extension
   * string with a leading dot, eg `".jsx"`. The value for each property should
   * be a function which receives (1) the filepath to a module, and (2) that
   * file's content as a UTF-8 string, and the function should return a string
   * containing JavaScript code that corresponds to that module. In most cases,
   * these functions will compile the contents of the file from one format into JavaScript.
   *
   * The function does not have to use the second 'content' argument it
   * receives (ie. when loading binary files).
   *
   * By adding to this object, you can make it possible to import non-js
   * filetypes; compile-to-JS languages like JSX, TypeScript, and CoffeeScript
   * can be compiled at import time, and asset files like .txt files or .png
   * files can be converted into an appropriate data structure at import time.
   *
   * As an example, to make it possible to import .txt files, you might do:
   * ```js
   * import * as std from "std";
   *
   * Module.compilers[".txt"] = (filename, content) => {
   *   return `export default ${JSON.stringify(content)}`;
   * }
   * ```
   * (leveraging `JSON.stringify`'s ability to escape quotes).
   *
   * Then, later in your code, you can do:
   * ```js
   * import names from "./names.txt";
   * ```
   *
   * And `names` will be a string containing the contents of names.txt.
   *
   * NOTE: When adding to this object, you may also wish to add to
   * {@link Module.searchExtensions}.
   */
  static compilers: {
    [extensionWithDot: string]: (filename: string, content: string) => string;
  };

  /**
   * Create a virtual built-in module whose exports consist of the own
   * enumerable properties of `obj`.
   */
  static define(name: string, obj: { [key: string]: any }): void;

  /**
   * Resolves a require/import request from `fromFile` into a canonicalized path.
   *
   * To change native module resolution behavior, replace this function with
   * your own implementation.
   */
  static resolve(name: string, fromFile: string): string;

  /**
   * Reads the contents of the given resolved module name into a string.
   *
   * To change native module loading behavior, replace this function with your
   * own implementation.
   */
  static read(modulePath: string): string;
}

/**
 * Synchronously import a module.
 *
 * `source` will be resolved relative to the calling file.
 *
 * If `source` does not have a file extension, and a file without an extension
 * cannot be found, the engine will check for files with the extensions in
 * {@link Module.searchExtensions}, and use one of those if present. This
 * behavior also happens when using normal `import` statements.
 *
 * For example, if you write:
 *
 * ```js
 * import something from "./somewhere";
 * ```
 *
 * but there's no file named `somewhere` in the same directory as the file
 * where that import appears, and `Module.searchExtensions` is the default
 * value:
 *
 * ```js
 * [".js"]
 * ```
 *
 * then the engine will look for `somewhere.js`. If that doesn't exist, the
 * engine will look for `somewhere/index.js`. If *that* doesn't exist, an error
 * will be thrown.
 *
 * If you add more extensions to `Module.searchExtensions`, then the engine
 * will use those, too. It will search in the same order as the strings appear
 * in the `Module.searchExtensions` array.
 */
declare var require: ((source: string) => any) & {
  /**
   * Resolves the normalized path to a modules, relative to the calling file.
   */
  resolve: (source: string) => string;
};

declare var setTimeout: typeof import("quickjs:os").setTimeout;
declare var clearTimeout: typeof import("quickjs:os").clearTimeout;

declare type Interval = { [Symbol.toStringTag]: "Interval" };

declare function setInterval(func: (...args: any) => any, ms: number): Interval;
declare function clearInterval(interval: Interval): void;

interface StringConstructor {
  /**
   * A no-op template literal tag.
   *
   * https://github.com/tc39/proposal-string-cooked
   */
  cooked(
    strings: readonly string[] | ArrayLike<string>,
    ...substitutions: any[]
  ): string;

  /**
   * Remove leading minimum indentation from the string.
   * The first line of the string must be empty.
   *
   * https://github.com/tc39/proposal-string-dedent
   */
  dedent: {
    /**
     * Remove leading minimum indentation from the string.
     * The first line of the string must be empty.
     *
     * https://github.com/tc39/proposal-string-dedent
     */
    (input: string): string;

    /**
     * Remove leading minimum indentation from the template literal.
     * The first line of the string must be empty.
     *
     * https://github.com/tc39/proposal-string-dedent
     */
    (
      strings: readonly string[] | ArrayLike<string>,
      ...substitutions: any[]
    ): string;

    /**
     * Wrap another template tag function such that tagged literals
     * become dedented before being passed to the wrapped function.
     *
     * https://www.npmjs.com/package/string-dedent#usage
     */
    <
      Func extends (
        strings: readonly string[] | ArrayLike<string>,
        ...substitutions: any[]
      ) => string
    >(
      input: Func
    ): Func;
  };
}

interface ObjectConstructor {
  /**
   * Convert the specified value to a primitive value.
   *
   * The provided hint indicates a preferred return type, which may or may not
   * be respected by the engine.
   *
   * See the abstract operation "ToPrimitive" in the ECMAScript standard for
   * more info.
   */
  toPrimitive(
    input: any,
    hint: "string" | "number" | "default"
  ): string | number | bigint | boolean | undefined | symbol | null;
}

interface SymbolConstructor {
  /**
   * A method that changes the result of using the `typeof` operator on the
   * object. Called by the semantics of the typeof operator.
   *
   * Note that the following semantics will come into play when use of the
   * `typeof` operator causes the engine to call a `Symbol.typeofValue` method
   * on an object:
   *
   * - If the method returns any value other than one of the string values
   *   which are normally the result of using the `typeof` operator, the engine
   *   behaves as if no `Symbol.typeofValue` method was present on the object.
   * - If an error is thrown from this method, or an error is thrown while
   *   accessing this property, the error will be silently ignored, and the
   *   engine will behave as if no `Symbol.typeofValue` method was present on
   *   the object.
   * - If this property is present on an object, but the value of that property
   *   is not a function, the engine will not consider that value when
   *   determining the result of the `typeof` operation (it'll ignore it).
   */
  readonly typeofValue: unique symbol;
}
