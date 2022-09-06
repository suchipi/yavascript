
// NOTE: This copy of yavascript.d.ts reflects what is in git.
// APIs may differ from what you have installed.
// If available, consult the copy of yavascript.d.ts that was distributed with your install.


// ---------------
// YavaScript APIs
// ---------------

// -----------
// --- env ---
// -----------

/**
 * An object representing the process's environment variables. You can read
 * from it to read environment variables, write into it to set environment
 * variables, and/or delete properties from it to unset environment variables.
 * Any value you write will be coerced into a string.
 */
declare const env: { [key: string]: string | undefined };

// ------------
// --- exec ---
// ------------

declare type BaseExecOptions = {
  /** Sets the current working directory for the child process. */
  cwd?: string;

  /** Sets environment variables within the process. */
  env?: { [key: string | number]: string | number | boolean };
};

declare interface Exec {
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

// -------------
// --- paths ---
// -------------

/**
 * Change the process's current working directory to the specified path.
 *
 * Provides the same functionality as the shell builtin of the same name.
 */
declare function cd(path: string): void;

/**
 * Return the process's current working directory.
 *
 * Provides the same functionality as the shell builtin of the same name.
 */
declare function pwd(): string;

/**
 * Get the absolute path given a relative path. Symlinks are also resolved.
 *
 * The path's target file/directory must exist.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function realpath(path: string): string;

/**
 * Removes the final component from a path string.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function dirname(path: string): string;

/**
 * Return the last component of a path string.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function basename(path: string): string;

/**
 * Returns the file extension of the file at a given path.
 *
 * If the file has no extension (eg `Makefile`, etc), then `''` will be returned.
 *
 * Pass `{ full: true }` to get compound extensions, eg `.d.ts` or `.test.js` instead of just `.ts`/`.js`.
 */
declare function extname(
  pathOrFilename: string,
  options?: { full?: boolean }
): string;

/**
 * A namespace object providing several path-string-related APIs.
 */
declare const paths: {
  /**
   * The separator character the host operating system uses between path
   * components, ie. the slashes in a filepath. On windows, it's a backslash, and
   * on all other OSes, it's a forward slash.
   */
  OS_PATH_SEPARATOR: "/" | "\\";

  /**
   * Split a path string (or array of path strings) on / or \\, returning an
   * Array of strings.
   *
   * Trailing slashes and duplicate path separators will be removed.
   *
   * If the path starts with `/`, the first string in the Array will be empty.
   */
  split(path: string | Array<string>): Array<string>;

  /**
   * Detect which path separator is present in the given path or array of
   * paths: `\` or `/`.
   *
   * If neither is present, `/` will be returned.
   */
  detectSeparator(input: string | Array<string>): string;

  /**
   * Create a path string from one or more path or path component strings.
   * {@link paths.OS_PATH_SEPARATOR} will be used to combine parts.
   *
   * This function does not resolve `..` or `.`. Use {@link paths.resolve} for that.
   */
  join(...parts: Array<string>): string;

  /**
   * Resolves all `..` and `.` components in a path, returning an absolute
   * path.
   *
   * Use `from` to specify where leading `.` or `..` characters should be
   * resolved relative to. If unspecified, it defaults to `pwd()`.
   */
  resolve(path: string, from?: string): string;

  /**
   * Returns whether the path starts with either a leading slash or a windows
   * drive letter.
   */
  isAbsolute(path: string): boolean;
};

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

// ------------
// --- repo ---
// ------------

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

// ------------------
// --- filesystem ---
// ------------------

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

/**
 * Read a symlink.
 *
 * Returns the target of the symlink, which may be absolute or relative.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function readlink(path: string): string;

/**
 * Read the contents of a file from disk, as a UTF-8 string.
 */
declare function readFile(path: string): string;

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

// ------------
// --- glob ---
// ------------

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
   * glob(pwd(), ["./*.js"], { trace: console.log });
   * ```
   */
  trace?: (...args: Array<any>) => void;
};

/**
 * Search the filesystem for files matching the specified glob patterns.
 *
 * Uses [minimatch](https://www.npmjs.com/package/minimatch) with its default
 * options.
 */
declare function glob(
  dir: string,
  patterns: Array<string>,
  options?: GlobOptions
): Array<string>;

// ----------
// --- is ---
// ----------

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

declare const is: {
  string(value: any): value is string;
  String(value: any): value is string;
  number(value: any): value is number;
  Number(value: any): value is number;
  boolean(value: any): value is boolean;
  Boolean(value: any): value is boolean;
  bigint(value: any): value is bigint;
  BigInt(value: any): value is BigInt;
  symbol(value: any): value is symbol;
  Symbol(value: any): value is symbol;
  null(value: any): value is null;
  undefined(value: any): value is undefined;
  void(value: any): value is null | undefined;
  object(value: any): value is {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Object(value: any): value is {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Array(value: any): value is unknown[];
  function(value: any): value is Function & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Function(value: any): value is Function & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  tagged(value: any, tag: string): boolean;
  instanceOf<T>(value: any, klass: new (...args: any) => T): value is T;
  Error(value: any): value is Error;
  Infinity(value: any): value is number;
  NegativeInfinity(value: any): value is number;
  NaN(value: any): value is number;
  Date(value: any): value is Date;
  RegExp(value: any): value is RegExp;
  Map(value: any): value is Map<unknown, unknown>;
  Set(value: any): value is Set<unknown>;
  WeakMap(value: any): value is Map<unknown, unknown>;
  WeakSet(value: any): value is Set<unknown>;
  ArrayBuffer(value: any): value is ArrayBuffer;
  SharedArrayBuffer(value: any): value is SharedArrayBuffer;
  DataView(value: any): value is DataView;
  TypedArray(value: any): value is TypedArray;
  Int8Array(value: any): value is Int8Array;
  Uint8Array(value: any): value is Uint8Array;
  Uint8ClampedArray(value: any): value is Uint8ClampedArray;
  Int16Array(value: any): value is Int16Array;
  Uint16Array(value: any): value is Uint16Array;
  Int32Array(value: any): value is Int32Array;
  Uint32Array(value: any): value is Uint32Array;
  Float32Array(value: any): value is Float32Array;
  Float64Array(value: any): value is Float64Array;
  Promise(value: any): value is Promise<unknown>;
  Generator(value: any): value is Generator<unknown, any, unknown>;
  GeneratorFunction(value: any): value is GeneratorFunction;
  AsyncFunction(value: any): value is ((...args: any) => Promise<unknown>) & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  AsyncGenerator(value: any): value is AsyncGenerator<unknown, any, unknown>;
  AsyncGeneratorFunction(value: any): value is AsyncGeneratorFunction;
};

// ---------------
// --- console ---
// ---------------

/**
 * Print one or more values to stdout.
 */
declare const echo: typeof console.log;

// ---------------
// --- strings ---
// ---------------

/**
 * Remove ANSI control characters from a string.
 */
declare function stripAnsi(input: string): string;

/**
 * Wrap a string in double quotes, and escape any double-quotes inside using `\"`.
 */
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

// -------------------------------------------
// --- other globals and convenience types ---
// -------------------------------------------

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

declare var std: typeof import("std");
declare var os: typeof import("os");

// ------------------------------------------
// QuickJS APIs, which YavaScript builds upon
// ------------------------------------------

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

declare module "std" {
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
  export function getFileNameFromStack(stackLevels: number): string;

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
  export function puts(str: string): void;

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

  /** An object representing a file handle. */
  export class FILE {
    /** Close the file.  */
    close(): void;

    /** Outputs the string with the UTF-8 encoding. */
    puts(str: string): void;

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
    seek(
      offset: number,
      whence: typeof SEEK_SET | typeof SEEK_CUR | typeof SEEK_END
    ): void;

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
}

declare module "os" {
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

  /** `dup` Unix system call. */
  export function dup(fd: number): number;

  /** `dup2` Unix system call. */
  export function dup2(oldfd: number, newfd: number): number;

  /** `pipe` Unix system call. Return two handles as `[read_fd, write_fd]`. */
  export function pipe(): null | [number, number];

  /** Sleep for `delay_ms` milliseconds. */
  export function sleep(delay_ms: number): void;

  export type Timer = number & { __is: "Timer" };

  /** Call the function func after delay ms. Return a handle to the timer. */
  export function setTimeout(func: () => void, delay: number): Timer;

  /** Cancel a timer. */
  export function clearTimeout(handle: Timer): void;

  /** Return a string representing the platform: "linux", "darwin", "win32" or "js". */
  export var platform: "linux" | "darwin" | "win32" | "js";

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

