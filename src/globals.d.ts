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
