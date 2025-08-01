// NOTE: This copy of yavascript.d.ts reflects what is in git.
// APIs may differ from what you have installed.
// Run `yavascript --print-types > yavascript.d.ts` to get the types
// corresponding to your specific `yavascript` binary.

// ===============
// ---------------
// YavaScript APIs
// ---------------
// ===============
/**
 * Prints a link to the YavaScript help docs for the currently-running version
 * of YavaScript.
 *
 * For the latest help docs, see:
 * https://github.com/suchipi/yavascript/blob/main/meta/generated-docs/README.md
 */
declare function help(): void;

/**
 * The `yavascript` global contains metadata about the currently-running
 * yavascript binary, as well as access to yavascript's compilers for
 * compile-to-js languages.
 */
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

  /**
   * The processor architecture of the currently-running `yavascript` binary.
   */
  arch: "x86_64" | "arm64";

  /**
   * The version of the ecma262 standard supported by the currently-running
   * yavascript binary.
   *
   * Currently, this is always "ES2020", but if future versions of yavascript
   * support a newer version of the standard, this will change. In that event,
   * this property will always be in the format of "ES" + a year, and will never
   * be lower than ES2020.
   */
  ecmaVersion: string;

  /**
   * The compilers yavascript uses internally to load files.
   *
   * Each function returns a JavaScript source code string.
   */
  compilers: {
    /**
     * The function yavascript uses internally to load JavaScript files.
     *
     * You might think this would be a no-op, but we do some CommonJS/ECMAScript
     * Module interop transformations here.
     */
    js(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    /**
     * The function yavascript uses internally to load [TypeScript JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) files.
     *
     * yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load TypeScript JSX syntax. yavascript doesn't do typechecking of TypeScript syntax.
     */
    tsx(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    /**
     * The function yavascript uses internally to load [TypeScript](https://www.typescriptlang.org/) files.
     *
     * yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load TypeScript syntax. yavascript doesn't do typechecking of TypeScript syntax.
     */
    ts(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    /**
     * The function yavascript uses internally to load JSX files.
     *
     * yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load JSX syntax.
     *
     * See {@link JSX} for info about configuring JSX pragma, swapping out the
     * default `createElement` implementation, etc.
     */
    jsx(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    /**
     * The function yavascript uses internally to load [CoffeeScript](https://coffeescript.org/) files.
     *
     * yavascript embeds CoffeeScript 2.7.0.
     */
    coffee(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    /**
     * The function yavascript uses internally to load [Civet](https://civet.dev/) files.
     *
     * yavascript embeds Civet 0.9.0.
     */
    civet(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    /**
     * The function yavascript uses internally to load files which don't have an
     * extension.
     *
     * It tries to parse the file as each of the following languages, in order,
     * until it finds one which doesn't have a syntax error:
     *
     * - JSX
     * - TSX
     * - Civet
     * - CoffeeScript
     *
     * If none of the languages work, the file's original content gets used so
     * that a syntax error can be reported to the user.
     */
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
 * A function which reads an environment variable and returns an appropriate
 * boolean based on the string value of the environment variable.
 *
 * - If the environment variable is not set, The `fallback` parameter is returned.
 * - If the value is "1", "true", "True", or "TRUE", the boolean `true` is returned.
 * - If the value is "0", "false", "False", or "FALSE", the boolean `false` is returned.
 * - If the environment variable is defined but its value isn't one of the
 *   values listed above, a warning is printed and the `fallback` parameter is returned.
 *
 * Generally, the `fallback` parameter is set to `true`, `false`, or `null`.
 *
 * @param key The environment variable to read.
 * @param fallback Value to return if the environment variable is unset or not
 * coercable to boolean.
 * @param logging logger override for the warning printed when an environment
 * variable has an unsupported value. Defaults to {@link logger}.
 */
declare function readEnvBool<T>(
  key: string,
  fallback: T,
  logging?: {
    warn?: (...args: Array<any>) => void;
  }
): boolean | T;

/**
 * A function which parses command line `--flags` into an object of flags and an
 * array of positional arguments. This function is opinionated; if it doesn't
 * meet your needs, you can parse the {@link scriptArgs} global manually.
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
 * `parseScriptArgs` accepts two optional parameters: `hints` and `argv`.
 *
 * ## hints
 *
 * If present, `hints` should be an object whose keys are flag names (in
 * lowerCamelCase) and whose values indicate what type to treat that flag as.
 * Valid property values are `String`, `Boolean`, `Number`, and `Path`. `Path`
 * will resolve relative paths into absolute paths for you. If no hints object
 * is specified, `parseScriptArgs` will do its best to guess the types.
 *
 * ## argv
 *
 * The `argv` parameter, if present, should be an array containing the command
 * line flags you want to parse. If you don't provide one, `scriptArgs.slice(2)`
 * will be used (we slice 2 in order to skip the yavascript binary and script
 * name). If you pass in an array here, it should only contain command-line
 * flags, not the binary being called.
 *
 * ## Return Value
 *
 * `parseScriptArgs` returns an object with three properties: `flags`, `args`,
 * and `metadata`.
 *
 * - `flags` is an object whose keys are lowerCamelCase flag names and whose
 *   values are strings, booleans, numbers, or `Path`s corresponding to the
 *   input command-line args.
 * - `args` is an Array of positional arguments, as found on the command-line.
 * - `metadata` contains information about what name and type the flags got
 *   mapped to.
 *
 * @param hints - An object whose keys are flag names (in lowerCamelCase) and
 * whose values indicate what type to treat that flag as. Valid property values
 * are `String`, `Boolean`, `Number`, and `Path`. `Path` will resolve relative
 * paths into absolute paths for you. If no hints object is specified,
 * `parseScriptArgs` will do its best to guess, based on the command-line args.
 * @param argv - An array containing the command line flags you want to parse.
 * If unspecified, `scriptArgs.slice(2)` will be used (we slice 2 in order to
 * skip the yavascript binary and script name). If you pass in an array here, it
 * should only contain command-line flags, not the binary being called.
 *
 * @returns A {@link ParseScriptArgsResult}, which is an object with three
 * properties: `flags`, `args`, and `metadata`. `flags` is an object whose keys
 * are camelCase flag names and whose values are strings, booleans, numbers, or
 * `Path`s corresponding to the input command-line args. `args` is an Array of
 * positional arguments, as found on the command-line. `metadata` contains
 * information about what name and type the flags got mapped to.
 */
declare function parseScriptArgs(
  hints?: {
    [key: string]: typeof String | typeof Boolean | typeof Number | typeof Path;
  },
  args?: Array<string>
): ParseScriptArgsResult;

/**
 * The return type of {@link parseScriptArgs}.
 *
 * The `flags` property contains the values for any command-line `--flags`, with
 * key names converted to `lowerCamelCase`.
 *
 * The `args` property contains an array of those command-line arguments which
 * weren't associated with a flag.
 *
 * The `metadata` property contains information about the parsing process,
 * including what case changes were applied to the keys, which hints were used,
 * and which properties had their type guessed because no corresponding hint was
 * available.
 */
declare interface ParseScriptArgsResult {
  /**
   * The values for any command-line `--flags`, with key names converted to `lowerCamelCase`.
   */
  flags: { [key: string]: any };
  /**
   * An array of those command-line arguments which weren't associated with a flag.
   */
  args: Array<string>;
  /**
   * Information about the parsing process, including what case changes were
   * applied to the keys, which hints were used, and which properties had their
   * type guessed because no corresponding hint was available.
   */
  metadata: {
    /**
     * An object whose keys are the verbatim flags from the command-line, and
     * whose values are the lowerCamelCase names they were converted to in the
     * `flags` property of the {@link ParseScriptArgsResult}.
     */
    keys: {
      [key: string]: string | undefined;
    };
    /**
     * An object whose keys are the lowerCamelCase flag names, and whose values
     * are strings indicating the hint values that were specified for those
     * flags.
     */
    hints: {
      [key: string]: "path" | "number" | "boolean" | "string" | undefined;
    };
    /**
     * An object indicating which flags we inferred the type of, because no
     * corresponding hint was present.
     *
     * The keys are the lowerCamelCase flag names, and the values are strings
     * indicating what type we guessed for that flag.
     *
     * If you're seeing incorrect inference, consider passing a `hints` argument
     * to {@link parseScriptArgs}.
     */
    guesses: {
      [key: string]: "number" | "boolean" | "string" | undefined;
    };
  };
}

/**
 * Read the contents of a file from disk.
 *
 * With no options specified, it reads the file as UTF-8 and returns a string:
 *
 * ```ts
 * const contents = readFile("README.md");
 * console.log(contents);
 * // "# yavascript\n\nYavaScript is a cross-platform bash-like script runner and repl which is distributed as a single\nstatically-linked binary..."
 * ```
 *
 * But, if you pass `{ binary: true }` as the second argument, it returns an
 * ArrayBuffer containing the raw bytes from the file:
 *
 * ```ts
 * const contents = readFile("README.md", { binary: true });
 * console.log(contents);
 * // ArrayBuffer {
 * //   │0x00000000│ 23 20 79 61 76 61 73 63 72 69 70 74 0A 0A 59 61
 * //   │0x00000010│ 76 61 53 63 72 69 70 74 20 69 73 20 61 20 63 72
 * //   │0x00000020│ 6F 73 73 2D 70 6C 61 74 66 6F 72 6D 20 62 61 73
 * //   │0x00000030│ 68 2D 6C 69 6B 65 20 73 63 72 69 70 74 20 72 75
 * // ...
 * ```
 */
declare const readFile: {
  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   */
  (path: string | Path): string;

  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   */
  (path: string | Path, options: {}): string;

  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   */
  (path: string | Path, options: { binary: false }): string;

  /**
   * Read the contents of a file from disk, as an ArrayBuffer.
   */
  (path: string | Path, options: { binary: true }): ArrayBuffer;
};

/**
 * Write the contents of a string or ArrayBuffer to a file.
 *
 * Strings are written using the UTF-8 encoding.
 */
declare function writeFile(
  path: string | Path,
  data: string | ArrayBuffer
): void;

/**
 * Function which returns true if the path points to a regular file.
 */
declare function isFile(path: string | Path): boolean;

/**
 * Function which returns true if the path points to a directory, or if the
 * path points to a symlink which points to a directory. Otherwise, it returns
 * false.
 */
declare function isDir(path: string | Path): boolean;

/**
 * Returns true if the path points to a symlink.
 */
declare function isLink(path: string | Path): boolean;

/**
 * Returns true if the resource at the provided path can be executed by the
 * current user.
 *
 * If nothing exists at that path, an error will be thrown.
 */
declare function isExecutable(path: string | Path): boolean;

/**
 * Returns true if the resource at the provided path can be read by the current
 * user.
 *
 * If nothing exists at that path, an error will be thrown.
 */
declare function isReadable(path: string | Path): boolean;

/**
 * Returns true if a resource at the provided path could be written to by the
 * current user.
 */
declare function isWritable(path: string | Path): boolean;

/**
 * Delete the file or directory at the specified path.
 *
 * If the directory isn't empty, its contents will be deleted, too.
 *
 * Provides the same functionality as the command `rm -rf`.
 */
declare function remove(path: string | Path): void;

/**
 * Returns true if a file or directory exists at the specified path.
 *
 * Provides the same functionality as the command `test -e`.
 */
declare function exists(path: string | Path): boolean;

/**
 * Copies a file or folder from one location to another.
 * Folders are copied recursively.
 *
 * Provides the same functionality as the command `cp -R`.
 */
declare function copy(
  from: string | Path,
  to: string | Path,
  options?: CopyOptions
): void;

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

  /** Options which control logging. */
  logging?: {
    /**
     * If provided, this function will be called multiple times as `copy`
     * traverses the filesystem, to help you understand what's going on and/or
     * troubleshoot things. In most cases, it makes sense to use a logging
     * function here, like so:
     *
     * ```js
     * copy("./source", "./destination", {
     *   logging: { trace: console.log },
     * });
     * ```
     *
     * Defaults to the current value of {@link logger.trace}. `logger.trace`
     * defaults to a no-op function.
     */
    trace?: (...args: Array<any>) => void;

    /**
     * An optional, user-provided logging function to be used for informational
     * messages.
     *
     * Defaults to the current value of {@link logger.info}. `logger.info`
     * defaults to a function which writes to stderr.
     */
    info?: (...args: Array<any>) => void;
  };
};

/**
 * Rename the file or directory at the specified path.
 *
 * Provides the same functionality as the command `mv`.
 */
declare function rename(from: string | Path, to: string | Path): void;

/**
 * A class which represents a filesystem path. The class contains various
 * methods that make it easy to work with filesystem paths; there are methods
 * for adding/removing path components, converting between absolute and relative
 * paths, getting the basename and dirname, and more.
 *
 * All functions in yavascript which accept path strings as arguments also
 * accept Path objects. As such, it is recommended that all filesystem paths in
 * your programs are Path objects rather than strings.
 *
 * Every Path object has two properties: `segments` and `separator`. `segments`
 * is an Array of strings containing all the non-slash portions of the path. For
 * example, the path "one/two/three" would have segments `["one", "two",
 * "three"]`. `separator` is which slash is used to separate the segments;
 * either `"/"` or `"\"`.
 *
 * A Path object can represent either a POSIX-style path or a win32-style path.
 * For the win32 style, UNC paths are supported. POSIX-style paths starting with
 * "/" (eg. "/usr/bin") have an empty string at the beginning of their segments
 * array to represent the left-hand-side of the leading slash. For instance,
 * "/usr/bin" would have segments `["", "usr", "bin"]`.
 */
declare class Path {
  /**
   * The character used to separate path segments on the current operating
   * system where yavascript is running.
   *
   * Its value is either a forward slash (`"/"`) or a backslash (`"\"`). Its value
   * is a backslash on windows, and a forward slash on all other operating
   * systems.
   */
  static readonly OS_SEGMENT_SEPARATOR: "/" | "\\";

  /**
   * The character used to separate entries within the system's `PATH`
   * environment variable on the current operating system where yavascript is
   * running.
   *
   * The `PATH` environment variable contains a list of folders wherein
   * command-line programs can be found, separated by either a colon (`:`) or a
   * semicolon (`;`). The value of `OS_ENV_VAR_SEPARATOR` is a semicolon on
   * windows, and a colon on all other operating systems.
   *
   * The `PATH` environment variable can be accessed by yavascript programs via
   * `env.PATH`. Therefore, one can contain a list of all entries in the `PATH`
   * environment variable via:
   *
   * ```ts
   * const folders: Array<string> = env.PATH.split(Path.OS_ENV_VAR_SEPARATOR);
   * ```
   */
  static readonly OS_ENV_VAR_SEPARATOR: ":" | ";";

  /**
   * A Set of filename extension strings that command-line programs may end with
   * on the current operating system where yavascript is running. For instance,
   * on Windows, programs often end with ".exe". Each of these strings contains
   * a leading dot (`.`).
   *
   * On windows, this value is based on the `PATHEXT` environment variable,
   * which defaults to ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC"
   * on Windows Vista and up. If `PATHEXT` is not defined, that default value is
   * used.
   *
   * On all other operating systems, this Set is empty.
   */
  static readonly OS_PROGRAM_EXTENSIONS: ReadonlySet<string>;

  /**
   * Converts a string (or array of strings) into an array of path segment
   * strings (the parts between the slashes).
   *
   * Example:
   *
   * ```ts
   * const input = ["hi", "there/every/one", "yeah\\yup"];
   * const result = Path.splitToSegments(input);
   * // result is ["hi", "there", "every", "one", "yeah", "yup"]
   * ```
   */
  static splitToSegments(inputParts: Array<string> | string): Array<string>;

  /**
   * Searches the provided path string or strings for a path separator character
   * (either forward slash or backslash), and returns the one it finds. If
   * neither is found, it returns the `fallback` arg, which defaults to the
   * current OS's path segment separator (`Path.OS_SEGMENT_SEPARATOR`).
   */
  static detectSeparator<Fallback extends string | null = string>(
    input: Array<string> | string,
    // @ts-ignore might be instantiated with a different subtype
    fallback: Fallback = Path.OS_SEGMENT_SEPARATOR
  ): string | Fallback;

  /**
   * Creates a new Path by concatenating the input path(s) and then resolving all
   * non-leading `.` and `..` segments. In other words:
   *
   * - Segments containing `.` are removed
   * - Segments containing `..` are removed, along with the segment preceding
   *   them.
   *
   * Note that any `.` or `..` segments at the beginning of the path (ie.
   * "leading segments") are not removed.
   */
  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): Path;

  /**
   * Returns a boolean indicating whether the provided path is absolute; that
   * is, whether it starts with either a slash (`/` or `\`) or a drive letter
   * (ie `C:`).
   *
   * Note that Windows UNC Paths (eg. `\\MYSERVER\share$\`) are considered
   * absolute.
   */
  static isAbsolute(path: string | Path): boolean;

  /**
   * Creates a new Path containing the user-provided segments and separator. In
   * most cases, you won't need to do this, and can use `new Path(...)` instead.
   *
   * If unspecified, the `separator` parameter defaults to
   * `Path.OS_SEGMENT_SEPARATOR`.
   */
  static fromRaw(segments: Array<string>, separator?: string): Path;

  /**
   * Creates a new Path object using the provided input(s), which will be
   * concatenated together in order left-to-right.
   */
  constructor(...inputs: Array<string | Path | Array<string | Path>>);

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
   * Will be either `"/"` or `"\"`.
   */
  separator: string;

  /**
   * Creates a new Path by resolving all non-leading `.` and `..` segments in
   * the target Path. In other words:
   *
   * - Segments containing `.` are removed
   * - Segments containing `..` are removed, along with the segment preceding
   *   them.
   *
   * Note that any `.` or `..` segments at the beginning of the path (ie.
   * "leading segments") are not removed.
   */
  normalize(): Path;

  /**
   * Creates a new Path by appending additional path segments onto the end of
   * the target Path's segments.
   *
   * The returned Path will use the same separator as the target Path.
   */
  concat(...other: Array<string | Path | Array<string | Path>>): Path;

  /**
   * Returns a boolean indicating whether the target Path is absolute; that
   * is, whether it starts with either a slash (`/` or `\`) or a drive letter
   * (ie `C:`).
   *
   * Note that Windows UNC Paths (eg. `\\MYSERVER\share$\`) are considered
   * absolute.
   */
  isAbsolute(): boolean;

  /**
   * Creates a new Path object containing the same segments and separator as
   * the target Path.
   *
   * Note that although it contains the same segments, the new Path does not use
   * the same Array instance for segments as the target Path is was cloned from.
   */
  clone(): this;

  /**
   * Creates a new Path which expresses the target Path relative to `dir`.
   *
   * @param dir - The directory to create a new path relative to.
   * @param options - Options that affect the resulting path (see {@link PathRelativeToOptions}).
   */
  relativeTo(dir: Path | string, options?: PathRelativeToOptions): Path;

  /**
   * Turns the target Path into a string by joining its segments using its
   * separator as the delimiter.
   */
  toString(): string;

  /**
   * Alias for `toString`. The presence of this method causes Path objects to be
   * serialized as strings when they (or an object referencing them) get(s) passed
   * into JSON.stringify.
   */
  toJSON(): string;

  /**
   * Returns the final segment of the target Path. If the target Path has no
   * segments, an empty string (`""`) is returned.
   */
  basename(): string;

  /**
   * Returns the trailing file extension of this path.
   *
   * @param options - Works the same as the options parameter for the global {@link extname} (see {@link ExtnameOptions}).
   */
  extname(options?: ExtnameOptions): string;

  /**
   * Creates a new Path containing all of the segments in the target Path except
   * for the last one; ie. the path to the directory that contains the target Path.
   */
  dirname(): Path;

  /**
   * Returns a boolean indicating whether the target Path starts with the
   * provided value, by comparing one path segment at a time.
   *
   * The starting segments of the target Path must *exactly* match the segments in the
   * provided value.
   *
   * This means that, given two Paths A and B:
   *
   * ```
   *   A: Path { /home/user/.config }
   *   B: Path { /home/user/.config2 }
   * ```
   *
   * Path B does *not* start with Path A, because `".config" !== ".config2"`.
   */
  startsWith(value: string | Path | Array<string | Path>): boolean;

  /**
   * Returns a boolean indicating whether the target Path ends with the provided
   * value, by comparing one path segment at a time.
   *
   * The ending segments of the target Path must *exactly* match the segments in the
   * provided value.
   *
   * This means that, given two Paths A and B:
   *
   * ```
   *   A: Path { /home/1user/.config }
   *   B: Path { user/.config }
   * ```
   *
   * Path A does *not* end with Path B, because `"1user" !== "user"`.
   */
  endsWith(value: string | Path | Array<string | Path>): boolean;

  /**
   * Returns the index at which `value` appears in the target Path's segments,
   * or `-1` if `value` doesn't appear in the target Path.
   *
   * @param value - The value to search for. If the value contains more than one path segment, the returned index will refer to the location of the value's first path segment.
   * @param fromIndex - The index into the target Path's segments to begin searching at. Defaults to `0`.
   */
  indexOf(
    value: string | Path | Array<string | Path>,
    fromIndex?: number | undefined
  ): number;

  /**
   * Returns a boolean indicating whether `value` appears in the target Path.
   *
   * @param value - The value to search for.
   * @param fromIndex - The index into the target Path's segments to begin searching at. Defaults to `0`.
   */
  includes(
    value: string | Path | Array<string | Path>,
    fromIndex?: number | undefined
  ): boolean;

  /**
   * Creates a new Path based on the target Path wherein the segments in `value`
   * have been replaced with the segments in `replacement`. If the segments in
   * `value` are not present in the target Path, a clone of the target Path is
   * returned.
   *
   * Note that only the first match is replaced. To replace more than one match,
   * use {@link Path.prototype.replaceAll}.
   *
   * @param value - What should be replaced
   * @param replacement - What it should be replaced with
   *
   * See also {@link Path.prototype.replaceLast}.
   */
  replace(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>
  ): Path;

  /**
   * Creates a new Path based on the target Path wherein all occurrences of the
   * segments in `value` have been replaced with the segments in `replacement`.
   * If the segments in `value` are not present in the target Path, a clone of
   * the target Path is returned.
   *
   * Note that all matches are replaced. To replace only the first match,
   * use {@link Path.prototype.replace}.
   *
   * @param value - What should be replaced
   * @param replacement - What it should be replaced with
   *
   * See also {@link Path.prototype.replaceLast}.
   */
  replaceAll(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>
  ): Path;

  /**
   * Creates a new Path based on the target Path but with the final segment
   * replaced with `replacement`.
   *
   * If the target Path has no segments, the newly created Path will be the same
   * as `new Path(replacement)`; ie. non-empty.
   *
   * @param replacement - The new final segment(s) for the returned Path
   */
  replaceLast(replacement: string | Path | Array<string | Path>): Path;

  /**
   * Return a boolean indicating whether this Path has the same separator and
   * segments as another Path.
   *
   * To check only segments and not separator, use {@link Path.prototype.hasEqualSegments}.
   */
  equals(other: string | Path | Array<string | Path>): boolean;

  /**
   * Return a boolean indicating whether this Path has the same segments as
   * another Path. **Separator is not checked; use {@link Path.prototype.equals} for that.**
   */
  hasEqualSegments(other: string | Path | Array<string | Path>): boolean;
}

/**
 * Options for {@link Path.prototype.relativeTo}.
 */
declare interface PathRelativeToOptions {
  /**
   * Defaults to false. When true, a leading `./` will be omitted from the
   * path, if present. Note that a leading `../` will never be omitted.
   */
  noLeadingDot?: boolean;
}

/**
 * The absolute path to the currently-executing file (whether script or module).
 *
 * Behaves the same as in Node.js, except that it's also present within ES
 * modules.
 *
 * Example: `/home/suchipi/some-folder/some-file.js`
 */
declare var __filename: string;

/**
 * The absolute path to the directory containing the currently-executing file.
 *
 * Behaves the same as in Node.js, except that it's also present within ES
 * modules.
 *
 * Example: `/home/suchipi/some-folder`
 */
declare var __dirname: string;

/**
 * Return the last component of a path string.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * > Example: `basename("/home/suchipi/something")` returns `"something"`, the last part.
 */
declare function basename(path: string | Path): string;

/**
 * Reads the contents of one or more files from disk as either one UTF-8 string
 * or one ArrayBuffer.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * > Example: If you have a file called `hi.txt` in the current working
 * > directory, and it contains the text "hello", running `cat("hi.txt")`
 * > returns `"hello"`.
 */
declare const cat: {
  /**
   * Read the contents of one or more files from disk, as one UTF-8 string.
   */
  (paths: string | Path | Array<string | Path>): string;

  /**
   * Read the contents of one or more files from disk, as one UTF-8 string.
   */
  (paths: string | Path | Array<string | Path>, options: {}): string;

  /**
   * Read the contents of one or more files from disk, as one UTF-8 string.
   */
  (
    paths: string | Path | Array<string | Path>,
    options: { binary: false }
  ): string;

  /**
   * Read the contents of one or more files from disk, as one ArrayBuffer.
   */
  (
    paths: string | Path | Array<string | Path>,
    options: { binary: true }
  ): ArrayBuffer;
};

/**
 * Changes the process's current working directory to the specified path. If no
 * path is specified, moves to the user's home directory.
 *
 * Provides the same functionality as the shell builtin of the same name.
 */
declare function cd(path?: string | Path): void;

/**
 * Set the permission bits for the specified file.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare const chmod: Chmod;

/**
 * The interface for the global function `chmod`, which has two call signatures.
 */
interface Chmod {
  /**
   * Set the permission bits for the specified file.
   *
   * Provides the same functionality as the unix binary of the same name.
   *
   * @param permissions The permission bits to set. This can be a number, or a string containing an octal number.
   * @param path The path to the file.
   */
  (permissions: number | string, path: string | Path): void;

  /**
   * Apply a change to the permission bits for the specified file.
   *
   * Provides the same functionality as the unix binary of the same name.
   *
   * @param operation What to do to the bits; can be "add", "set", or "remove".
   * @param permissions An object describing the changes (see below).
   * @param path The path to the file.
   *
   * Each of the `permissions` object's own property keys must be one of these
   * strings:
   *
   * - `"user"`
   * - `"group"`
   * - `"others"`
   * - `"all"` (meaning "user", "group", and "others")
   * - `"u"` (alias for "user")
   * - `"g"` (alias for "group")
   * - `"o"` (alias for "others")
   * - `"a"` (alias for "all")
   * - `"ug"` ("user" plus "group")
   * - `"go"` ("group" plus "others")
   * - `"uo"` ("user" plus "others")
   *
   * and their values must be one of these strings:
   *
   * - `"read"` (permission to read the contents of the file)
   * - `"write"` (permission to write to the file's contents)
   * - `"execute"` (permission to run the file as an executable)
   * - `"readwrite"` (both "read" and "write")
   * - `"none"` (no permissions)
   * - `"full"` ("read", "write", and "execute")
   * - `"r"` (alias for "read")
   * - `"w"` (alias for "write")
   * - `"x"` (alias for "execute")
   * - `"rw"` (alias for "readwrite")
   * - `"rx"` ("read" and "execute")
   * - `"wx"` ("write" and "execute")
   * - `"rwx"` (alias for "full")
   *
   * Some example objects:
   *
   * ```json
   * { user: "readwrite", group: "read", others: "none" }
   * { ug: "rw", o: "w" }
   * { all: "full" }
   * ```
   */
  <Operation extends Chmod.Operation>(
    operation: Operation,
    permissions: Operation extends "set"
      ? Record<Chmod.Who, Chmod.Permission>
      : Partial<Record<Chmod.Who, Chmod.Permission>>,
    path: string | Path
  ): void;
}

declare namespace Chmod {
  /** A string representing who a permission applies to. */
  export type Who =
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

  /** A string representing how the permissions should be changed. */
  export type Operation = "add" | "set" | "remove";

  /** A string representing the access level for the given permission. */
  export type Permission =
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
}

/**
 * Removes the final component from a path string.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * > Example: `dirname("/home/suchipi/something")` returns
 * > `"/home/suchipi"`, everything except the last part.
 */
declare function dirname(path: string | Path): Path;

/**
 * Print one or more values to stdout.
 *
 * Provides the same functionality as the shell builtin of the same name.
 *
 * > NOTE: This can print any value, not just strings.
 *
 * `echo` is functionally identical to `console.log`.
 */
declare const echo: typeof console.log;

/**
 * Exit the yavascript process.
 *
 * Provides the same functionality as the shell builtin of the same name.
 *
 * If exit is called with an argument, that argument is used as the exit code.
 * Otherwise, `exit.code` is used, which defaults to 0.
 *
 * `exit.code` will also be used as the exit status code for the yavascript
 * process if the process exits normally.
 *
 * > Attempting to call `exit` or set `exit.code` within a Worker will fail and
 * > throw an error.
 */
declare const exit: {
  (code?: number): never;
  code: number;
};

/**
 * Returns the file extension of the file at a given path.
 *
 * If the file has no extension (eg `Makefile`, etc), then `''` will be
 * returned.
 *
 * @param pathOrFilename The input path
 * @param options Options which affect the return value. See {@link ExtnameOptions}.
 */
declare function extname(
  pathOrFilename: string | Path,
  options?: ExtnameOptions
): string;

/**
 * Options for {@link extname} and {@link Path.prototype.extname}.
 */
declare interface ExtnameOptions {
  /**
   * Whether to get compound extensions, like `.d.ts` or `.test.js`, instead of
   * just the final extension (`.ts` or `.js` in this example).
   */
  full?: boolean;
}

/**
 * Returns the contents of a directory, as absolute paths. `.` and `..` are
 * omitted.
 *
 * If `ls()` is called with no directory, the present working directory
 * (`pwd()`) is used.
 */
declare function ls(dir?: string | Path): Array<Path>;

/**
 * Create a directory (folder).
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function mkdir(
  path: string | Path,
  options?: {
    recursive?: boolean;
    mode?: number;
    logging?: {
      trace?: (...args: Array<any>) => void;
      info?: (...args: Array<any>) => void;
    };
  }
): void;

/**
 * Create a directory (folder) and all parents, recursively
 *
 * Alias for `mkdir(path, { recursive: true })`.
 *
 * Provides the same functionality as `mkdir -p`.
 */
declare function mkdirp(
  path: string | Path,
  options?: {
    mode?: number;
    logging?: {
      trace?: (...args: Array<any>) => void;
      info?: (...args: Array<any>) => void;
    };
  }
): void;

/**
 * Print data to stdout using C-style format specifiers.
 *
 * The same formats as the [standard C library
 * printf](https://en.cppreference.com/w/c/io/fprintf) are supported. Integer
 * format types (e.g. `%d`) truncate the Numbers or BigInts to 32 bits. Use the
 * l modifier (e.g. `%ld`) to truncate to 64 bits.
 */
declare function printf(format: string, ...args: Array<any>): void;

/**
 * Returns the process's current working directory.
 *
 * Provides the same functionality as the shell builtin of the same name.
 */
declare const pwd: {
  /**
   * Returns the process's current working directory.
   *
   * Provides the same functionality as the shell builtin of the same name.
   */
  (): Path;

  /**
   * A frozen, read-only `Path` object containing what `pwd()` was when
   * yavascript first started up.
   */
  readonly initial: Path;
};

/**
 * Reads a symlink.
 *
 * Returns the target of the symlink, which may be absolute or relative.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function readlink(path: string | Path): Path;

/**
 * Get the absolute path given a relative path. Symlinks are also resolved.
 *
 * The path's target file/directory must exist.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * > If you want to convert a relative path to an absolute path, but the path's
 * > target might NOT exist, use {@link Path.normalize}.
 */
declare function realpath(path: string | Path): Path;

/**
 * `sleep` and `sleep.sync` block the current thread for at least the specified
 * number of milliseconds, but maybe a tiny bit longer.
 *
 * `sleep.async` returns a Promise which resolves in at least the specified
 * number of milliseconds, but maybe a tiny bit longer.
 *
 * `sleep` and `sleep.sync` block the current thread. `sleep.async` doesn't
 * block the current thread.
 *
 * "Blocking the thread" means no other JavaScript code can run while `sleep` or
 * `sleep.sync` is running. If this is not the behavior you want, use
 * `sleep.async` instead.
 */
declare var sleep: {
  /**
   * Blocks the current thread for at least the specified number of
   * milliseconds, but maybe a tiny bit longer.
   *
   * alias for `sleep.sync`.
   *
   * @param milliseconds - The number of milliseconds to block for.
   *
   * No other JavaScript code can run while `sleep()` is running. If this is
   * not the behavior you want, use `sleep.async` instead.
   */
  (milliseconds: number): void;

  /**
   * Blocks the current thread for at least the specified number of
   * milliseconds, but maybe a tiny bit longer.
   *
   * @param milliseconds - The number of milliseconds to block for.
   *
   * No other JavaScript code can run while `sleep.sync` is running. If this is
   * not the behavior you want, use `sleep.async` instead.
   */
  sync(milliseconds: number): void;

  /**
   * Returns a Promise which resolves in at least the specified number of
   * milliseconds, maybe a little longer.
   *
   * @param milliseconds - The number of milliseconds to wait before the returned Promise should be resolved.
   *
   * `sleep.async` doesn't block the current thread, so other JavaScript code
   * (registered event handlers, async functions, timers, etc) can run while
   * `sleep.async`'s return Promise is waiting to resolve. If this is not the
   * behavior you want, use `sleep.sync` instead.
   *
   * The Promise returned by `sleep.async` will never get rejected. It will only
   * ever get resolved.
   */
  async(milliseconds: number): Promise<void>;
};

/**
 * If the file at `path` exists, update its creation/modification timestamps.
 *
 * Otherwise, create an empty file at that path.
 *
 * @param path The target path for the file.
 */
declare function touch(path: string | Path): void;

/**
 * Searches the system for the path to a program named `binaryName`.
 *
 * If the program can't be found, `null` is returned.
 *
 * @param binaryName The program to search for
 * @param options Options which affect how the search is performed
 * @param options.searchPaths A list of folders where programs may be found. Defaults to `env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR) || []`.
 * @param options.suffixes A list of filename extension suffixes to include in the search, ie [".exe"]. Defaults to `Path.OS_PROGRAM_EXTENSIONS`.
 * @param options.trace A logging function that will be called at various times during the execution of `which`. Defaults to {@link logger.trace}.
 */
declare function which(binaryName: string, options?: WhichOptions): Path | null;

declare type WhichOptions = {
  /**
   * A list of folders where programs may be found. Defaults to
   * `env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR) || []`.
   */
  searchPaths?: Array<Path | string>;

  /**
   * A list of filename extension suffixes to include in the search, ie
   * `[".exe"]`. Defaults to {@link Path.OS_PROGRAM_EXTENSIONS}.
   */
  suffixes?: Array<string>;

  /** Options which control logging. */
  logging?: {
    /**
     * If provided, this logging function will be called multiple times as
     * `which` runs, to help you understand what's going on and/or troubleshoot
     * things. In most cases, it makes sense to use a function from `console`
     * here, like so:
     *
     * ```js
     * which("bash", {
     *   logging: { trace: console.log }
     * });
     * ```
     *
     * Defaults to the current value of {@link logger.trace}. `logger.trace`
     * defaults to a no-op function.
     */
    trace?: (...args: Array<any>) => void;
  };
};

/** The type of the return value of {@link whoami}. */
declare interface WhoAmIResult {
  name: string;
  uid: number;
  gid: number;
}

/**
 * Get info about the user the yavascript process is executing as.
 *
 * Provides functionality similar to the unix binaries `whoami` and `id`.
 *
 * NOTE: Doesn't work on Windows; throws an error.
 */
declare function whoami(): WhoAmIResult;

/**
 * Runs a child process and blocks until it exits. You can call it with either a
 * string or an array of strings.
 *
 * When calling `exec` with an array of strings, the first string in the array
 * is the program to run, and the rest of the strings in the array are arguments
 * to the program, eg:
 *
 * ```ts
 * exec(["echo", "hi", "there"]);
 * exec(["printf", "something with spaces\n"]);
 * ```
 *
 * When calling with a string instead of an array, the string will be split into
 * separate arguments using the following rules:
 *
 * - The program and its arguments will be determined by splitting the input
 *   string on whitespace, except:
 *   - Stuff in single or double-quotes will be preserved as a single argument
 *   - Double and single quotes can be "glued" together (eg `"bla"'bla'` becomes
 *     `blabla`)
 *   - The escape sequences `\n`, `\r`, `\t`, `\v`, `\0`, and `\\` can be used
 *     inside of quotes get replaced with newline, carriage return, tab,
 *     vertical tab, nul, and `\` characters, respectively
 *
 * For example:
 *
 * ```ts
 * exec(`echo hi there`);
 * exec(`printf "something with spaces\n"`);
 * ```
 *
 * The intent is that it behaves similarly to what you would expect from a UNIX
 * shell, but only the "safe" features. "Unsafe" features like environment
 * variable expansion (`$VAR` or `${VAR}`), subshells (\`echo hi\` or `$(echo
 * hi)`), and redirection (`> /dev/null` or `2>&1 `) are not supported. To use
 * those features, shell out to `bash` or `sh` directly via eg `exec(['bash',
 * '-c', 'your command string'])`, but be aware of the security implications of
 * doing so.
 *
 * `exec` also supports a second argument, an options object which supports the
 * following keys (all are optional):
 *
 * | Property                       | Purpose                                             |
 * | ------------------------------ | --------------------------------------------------- |
 * | cwd (string)                   | current working directory for the child process     |
 * | env (object)                   | environment variables for the process               |
 * | failOnNonZeroStatus (boolean)  | whether to throw error on nonzero exit status       |
 * | captureOutput (boolean/string) | controls how stdout/stderr is directed              |
 * | logging (object)               | controls how/whether info messages are logged       |
 * | block (boolean)                | whether to wait for child process exit now or later |
 *
 * The return value of `exec` varies depending on the options passed:
 *
 * - When `captureOutput` is true or "utf-8", an object will be returned with
 *   `stdout` and `stderr` properties, both strings.
 * - When `captureOutput` is "arraybuffer", an object will be returned with
 *   `stdout` and `stderr` properties, both `ArrayBuffer`s.
 * - When `failOnNonZeroStatus` is false, an object will be returned with
 *   `status` (the exit code; number or undefined) and `signal` (the signal that
 *   killed the process; number or undefined).
 * - When `captureOutput` is non-false and `failOnNonZeroStatus` is false, an
 *   object will be returned with four properties (the two associated with
 *   `failOnNonZeroStatus`, and the two associated with `captureOutput`).
 * - When `captureOutput` is false or unspecified, and `failOnNonZeroStatus` is
 *   true or unspecified, undefined will be returned.
 * - If `block` is false, an object with a "wait" method is returned instead,
 *   which blocks the calling thread until the process exits, and then returns
 *   one of the values described above.
 */
declare const exec: Exec;

declare type BaseExecOptions = {
  /** Sets the current working directory for the child process. */
  cwd?: string | Path;

  /** Sets environment variables within the process. */
  env?: { [key: string | number]: string | number | boolean };

  /** Options which control logging. */
  logging?: {
    /**
     * If provided, this logging function will be called multiple times as
     * `exec` runs, to help you understand what's going on and/or troubleshoot
     * things. In most cases, it makes sense to use a function from `console`
     * here, like so:
     *
     * ```js
     * exec(["echo", "hi"], {
     *   logging: { trace: console.log },
     * });
     * ```
     *
     * Defaults to the current value of {@link logger.trace}. `logger.trace`
     * defaults to a no-op function.
     */
    trace?: (...args: Array<any>) => void;

    /**
     * An optional, user-provided logging function to be used for informational
     * messages. Less verbose than `logging.trace`.
     *
     * Defaults to the current value of {@link logger.info}. `logger.info`
     * defaults to a function which logs to stderr.
     */
    info?: (...args: Array<any>) => void;
  };

  /**
   * Whether an Error should be thrown when the process exits with a nonzero
   * status code.
   *
   * Defaults to true.
   */
  failOnNonZeroStatus?: boolean;

  /**
   * If true, stdout and stderr will be collected into strings or array buffers
   * and returned instead of being printed to the screen.
   *
   * Defaults to false. true is an alias for "utf8".
   */
  captureOutput?: boolean | "utf8" | "arraybuffer";

  /**
   * If true, exec doesn't return until the process is done running. If false,
   * exec returns an object with a "wait" method which can be used to wait for
   * the process to be done running.
   *
   * Defaults to true.
   */
  block?: boolean;
};

declare interface Exec {
  /**
   * Runs a child process using the provided arguments.
   *
   * When `args` is an Array, the first value in the Array is the program to
   * run.
   *
   * @param args - The command to run.
   * @param options - Options; see {@link BaseExecOptions}
   */
  <
    ExecOptions extends BaseExecOptions = {
      failOnNonZeroStatus: true;
      captureOutput: false;
      block: true;
    }
  >(
    args: Array<string | Path | number> | string | Path,
    options?: ExecOptions
  ): ExecOptions["block"] extends false
    ? { wait(): ExecWaitResult<ExecOptions> }
    : ExecWaitResult<ExecOptions>;

  /**
   * Parse the provided value into an array of command-line argument strings,
   * using the same logic that {@link exec} and {@link ChildProcess} use.
   */
  toArgv(args: Array<string | Path | number> | string | Path): Array<string>;
}

/**
 * `$(...)` is an alias for `exec(..., { captureOutput: true, failOnNonZeroStatus: true })`.
 *
 * It's often used to capture the output of a program:
 *
 * ```ts
 * const result = $(`echo hi`).stdout;
 * // result is 'hi\n'
 * ```
 *
 * For more info, see {@link exec}.
 */
declare function $(args: Array<string | Path | number> | string | Path): {
  stdout: string;
  stderr: string;
};

type ExecWaitResult<ExecOptions extends BaseExecOptions> = ExecOptions extends
  | { captureOutput: true | "utf8" | "arraybuffer" }
  | { failOnNonZeroStatus: false }
  ? (ExecOptions["captureOutput"] extends true | "utf8"
      ? { stdout: string; stderr: string }
      : {}) &
      (ExecOptions["captureOutput"] extends "arraybuffer"
        ? { stdout: ArrayBuffer; stderr: ArrayBuffer }
        : {}) &
      (ExecOptions["failOnNonZeroStatus"] extends false
        ?
            | { status: number; signal: undefined }
            | { status: undefined; signal: number }
        : {})
  : void;

/**
 * A class which represents a child process. The process may or may not be
 * running.
 *
 * This class is the API used internally by the {@link exec} function to spawn child
 * processes.
 *
 * Generally, you should not need to use the `ChildProcess` class directly, and
 * should use {@link exec} or {@link $} instead. However, you may need to use it in some
 * special cases, like when specifying custom stdio for a process, or spawning a
 * non-blocking long-running process.
 */
declare interface ChildProcess {
  /**
   * The argv for the process. The first entry in this array is the program to
   * run.
   */
  args: Array<string>;

  /** The current working directory for the process. */
  cwd: Path;

  /** The environment variables for the process. */
  env: { [key: string]: string };

  /**
   * The standard I/O streams for the process. Generally these are the same as
   * `std.in`, `std.out`, and `std.err`, but they can be customized to write
   * output elsewhere.
   */
  stdio: {
    /** Where the process reads stdin from */
    in: FILE;
    /** Where the process writes stdout to */
    out: FILE;
    /** Where the process writes stderr to */
    err: FILE;
  };

  get state(): ChildProcessState;
  get pid(): number | null;

  /** Spawns the process and returns its pid (process id). */
  start(): number;

  /** Blocks the calling thread until the process exits or is killed. */
  waitUntilComplete():
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };
}

declare type ChildProcessState =
  | {
      id: "UNSTARTED";
    }
  | {
      id: "STARTED";
      pid: number;
    }
  | {
      id: "STOPPED";
      pid: number;
    }
  | {
      id: "CONTINUED";
      pid: number;
    }
  | {
      id: "EXITED";
      oldPid: number;
      status: number;
    }
  | {
      id: "SIGNALED";
      oldPid: number;
      signal: number;
    };

/**
 * Options to be passed to the ChildProcess constructor. Their purposes and
 * types match the same-named properties found on the resulting ChildProcess.
 */
declare type ChildProcessOptions = {
  /** The current working directory for the process. */
  cwd?: string | Path;

  /** The environment variables for the process. */
  env?: { [key: string]: string };

  /**
   * The standard I/O streams for the process. Generally these are the same as
   * `std.in`, `std.out`, and `std.err`, but they can be customized to write
   * output elsewhere.
   */
  stdio?: {
    /** Where the process reads stdin from */
    in?: FILE;
    /** Where the process writes stdout to */
    out?: FILE;
    /** Where the process writes stderr to */
    err?: FILE;
  };

  /** Options which control logging */
  logging?: {
    /**
     * Optional trace function which, if present, will be called at various
     * times to provide information about the lifecycle of the process.
     *
     * Defaults to the current value of {@link logger.trace}. `logger.trace`
     * defaults to a function which writes to stderr.
     */
    trace?: (...args: Array<any>) => void;
  };
};

declare interface ChildProcessConstructor {
  /**
   * Construct a new ChildProcess.
   *
   * @param args - The argv for the process. The first entry in this array is the program to run.
   * @param options - Options for the process (cwd, env, stdio, etc)
   */
  new (
    args: string | Path | Array<string | number | Path>,
    options?: ChildProcessOptions
  ): ChildProcess;

  readonly prototype: ChildProcess;
}

declare var ChildProcess: ChildProcessConstructor;

/**
 * Searches the filesystem in order to resolve [UNIX-style glob
 * strings](https://man7.org/linux/man-pages/man7/glob.7.html) into an array of
 * matching filesystem paths.
 *
 * Glob strings assist in succinctly finding and describing a set of files on
 * disk. For instance, to find the path of every `.js` file in the `src` folder,
 * one might write `src/*.js`.
 *
 * The function `glob` can be used to turn one or more of these "glob strings" into an array of
 * `Path` objects.
 *
 * `glob` uses [minimatch](https://www.npmjs.com/package/minimatch) with its
 * default options, which means it supports features like brace expanstion,
 * "globstar" (**) matching, and other features you would expect from a modern
 * globbing solution.
 *
 * > When specifying more than one pattern string, paths must match ALL of the
 * > patterns to be included in the returned Array. In other words, it uses
 * > "logical AND" behavior when you give it more than one pattern.
 */
declare function glob(
  patterns: string | Array<string>,
  options?: GlobOptions
): Array<Path>;

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

  /** Options which control logging. */
  logging?: {
    /**
     * If provided, this function will be called multiple times as `glob`
     * traverses the filesystem, to help you understand what's going on and/or
     * troubleshoot things. In most cases, it makes sense to use a logging
     * function here, like so:
     *
     * ```js
     * glob(["./*.js"], {
     *  logging: { trace: console.log }
     * });
     * ```
     *
     * Defaults to the current value of {@link logger.trace}. `logger.trace`
     * defaults to a no-op function.
     */
    trace?: (...args: Array<any>) => void;

    /**
     * An optional, user-provided logging function to be used for informational
     * messages. Less verbose than `logging.trace`.
     *
     * Defaults to the current value of {@link logger.info}. `logger.info`
     * defaults to a function which writes to stderr.
     */
    info?: (...args: Array<any>) => void;
  };

  /**
   * Directory to interpret glob patterns relative to. Defaults to `pwd()`.
   */
  dir?: string | Path;
};

/**
 * Prints special ANSI escape characters to stdout which instruct your terminal
 * emulator to clear the screen and clear your terminal scrollback.
 *
 * Identical to {@link console.clear}.
 */
declare function clear(): void;

interface Console {
  /**
   * Logs its arguments to stdout, with a newline appended.
   *
   * Any value can be logged, not just strings. Non-string values will be
   * formatted using {@link inspect}.
   *
   * Functionally identical to {@link console.info}, {@link echo}, and
   * {@link print}. Contrast with {@link console.error}, which prints to stderr
   * instead of stdout.
   */
  log(message?: any, ...optionalParams: any[]): void;

  /**
   * Logs its arguments to stdout, with a newline appended.
   *
   * Any value can be logged, not just strings. Non-string values will be
   * formatted using {@link inspect}.
   *
   * Functionally identical to {@link console.log}, {@link echo}, and
   * {@link print}. Contrast with {@link console.error}, which prints to stderr
   * instead of stdout.
   */
  info(message?: any, ...optionalParams: any[]): void;

  /**
   * Logs its arguments to stderr, with a newline appended.
   *
   * Any value can be logged, not just strings. Non-string values will be
   * formatted using {@link inspect}.
   *
   * Functionally identical to {@link console.error}. Contrast with
   * {@link console.log}, which prints to stdout instead of stderr.
   */
  warn(message?: any, ...optionalParams: any[]): void;

  /**
   * Logs its arguments to stderr, with a newline appended.
   *
   * Any value can be logged, not just strings. Non-string values will be
   * formatted using {@link inspect}.
   *
   * Functionally identical to {@link console.warn}. Contrast with
   * {@link console.log}, which prints to stdout instead of stderr.
   */
  error(message?: any, ...optionalParams: any[]): void;

  /**
   * Prints special ANSI escape characters to stdout which instruct your terminal
   * emulator to clear the screen and clear your terminal scrollback.
   *
   * Identical to {@link clear}.
   */
  clear(): void;
}

declare var console: Console;

/**
 * `print` is an alias for {@link console.log}, which prints values to stdout.
 *
 * Any value can be logged, not just strings. Non-string values will be
 * formatted using {@link inspect}.
 */
declare function print(...args: any): void;

/**
 * Removes ANSI control characters from a string.
 */
declare function stripAnsi(input: string | number | Path): string;

/**
 * Wraps a string in double quotes, and escapes any double-quotes inside using `\"`.
 */
declare function quote(input: string | number | Path): string;

// Colors

/** Wraps a string with the ANSI control characters that will make it print as black text. */
declare function black(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as red text. */
declare function red(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as green text. */
declare function green(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as yellow text. */
declare function yellow(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as blue text. */
declare function blue(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as magenta text. */
declare function magenta(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as cyan text. */
declare function cyan(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as white text. */
declare function white(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as gray text. (Alias for {@link grey}.) */
declare function gray(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as grey text. (Alias for {@link gray}.) */
declare function grey(input: string | number | Path): string;

// Background Colors

/** Wraps a string with the ANSI control characters that will make it have a black background when printed. */
declare function bgBlack(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a red background when printed. */
declare function bgRed(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a green background when printed. */
declare function bgGreen(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a yellow background when printed. */
declare function bgYellow(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a blue background when printed. */
declare function bgBlue(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a magenta background when printed. */
declare function bgMagenta(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a cyan background when printed. */
declare function bgCyan(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a white background when printed. */
declare function bgWhite(input: string | number | Path): string;

// Modifiers

/** Prefixes a string with the ANSI control character that resets all styling. */
declare function reset(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print with a bold style. */
declare function bold(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print with a dimmed style. */
declare function dim(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print italicized. */
declare function italic(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print underlined. */
declare function underline(input: string | number | Path): string;
/** Wraps a string with ANSI control characters that will make it print with its foreground (text) and background colors swapped. */
declare function inverse(input: string | number | Path): string;
/** Wraps a string with ANSI control characters that will make it print as hidden. */
declare function hidden(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print with a horizontal line through its center. */
declare function strikethrough(input: string | number | Path): string;

/**
 * Splits the string passed into it on `\n` and then returns the lines matching
 * the specified pattern, as an array of strings or detail objects.
 *
 * @param str - The string to search through.
 * @param pattern - The pattern to find. Can be a string or a RegExp.
 * @param options - Options which control matching behavior.
 *
 * See also {@link grepFile} and {@link String.prototype.grep}.
 */
declare const grepString: {
  (
    str: string,
    pattern: string | RegExp,
    options: GrepOptions & { details: true }
  ): Array<GrepMatchDetail>;

  (str: string, pattern: string | RegExp, options?: GrepOptions): Array<string>;
};

/**
 * Reads the file content at `path`, splits it on `\n`, and then returns the
 * lines matching the specified pattern, as an array of strings or detail objects.
 *
 * @param str - The string to search through.
 * @param pattern - The pattern to find. Can be a string or a RegExp.
 * @param options - Options which control matching behavior.
 *
 * See also {@link grepString} and {@link String.prototype.grep}.
 */
declare const grepFile: {
  (
    path: string | Path,
    pattern: string | RegExp,
    options: GrepOptions & { details: true }
  ): Array<GrepMatchDetail>;

  (
    path: string | Path,
    pattern: string | RegExp,
    options?: GrepOptions
  ): Array<string>;
};

interface String {
  // Same as grepString but without the first argument.
  /**
   * Splits the target string on `\n` and then returns the lines matching the
   * specified pattern, as an array of strings or detail objects.
   *
   * @param str - The string to search through.
   * @param pattern - The pattern to find. Can be a string or a RegExp.
   * @param options - Options which control matching behavior.
   *
   * See also {@link grepString} and {@link grepFile}.
   */
  grep: {
    (
      pattern: string | RegExp,
      options: GrepOptions & { details: true }
    ): Array<GrepMatchDetail>;

    (pattern: string | RegExp, options?: GrepOptions): Array<string>;
  };
}

declare interface GrepOptions {
  /**
   * When `inverse` is true, the grep function returns those lines which DON'T
   * match the pattern, instead of those which do. Defaults to `false`.
   */
  inverse?: boolean;

  /**
   * When `details` is true, the grep function returns an array of
   * {@link GrepMatchDetail} objects instead of an array of strings. Defaults to
   * `false`.
   */
  details?: boolean;
}

/**
 * When `grepString`, `grepFile`, or `String.prototype.grep` are called with the
 * `{ details: true }` option set, an Array of `GrepMatchDetail` objects is
 * returned.
 */
declare interface GrepMatchDetail {
  lineNumber: number;
  lineContent: string;
  matches: RegExpMatchArray;
}

/**
 * The `types` namespace object contains various functions which can be used to
 * identify the type of a value at runtime. It is based on
 * [pheno](https://github.com/suchipi/pheno), with some yavascript-specific
 * extensions.
 *
 * ## Usage
 *
 * To check that a value is of a type, use `is`. To assert that a value is of a
 * type, use `assert.type`:
 *
 * ```ts
 * is("hi", types.string); // true
 * is("hi", types.number); // false
 * is({ blah: 42 }, types.objectWithProperties({ blah: types.number })); // true
 *
 * assert.type("hi", types.string);
 * assert.type("hi", types.number); // throws
 * assert.type({ blah: 42 }, types.objectWithProperties({ blah: types.number }));
 * ```
 *
 * In many cases, you can use a "normal" JavaScript value for the type instead
 * of something from the `types` namespace. For instance, the following code
 * block is equivalent to the previous one:
 *
 * ```ts
 * is("hi", String); // true
 * is("hi", Number); // false
 * is({ blah: 42 }, { blah: Number }); // true
 *
 * assert.type("hi", String);
 * assert.type("hi", Number); // throws
 * assert.type({ blah: 42 }, { blah: Number });
 * ```
 *
 * For more info about using "normal" values, see the "Coercion" heading below.
 *
 * ## Explanation
 *
 * There are two kinds of function properties found on the `types` namespace:
 * those which return a boolean, and those which return a function. Functions
 * which return a boolean are called "type validators", and can be used to check
 * the type of a value. For example, `types.number` is a type validator:
 *
 * ```ts
 * is(42, types.number); // returns true
 * ```
 *
 * The other kind of function is a function which returns a function. These are
 * called "type validator constructors", because the function they return is a
 * type validator. They are used to construct complex type validators. For
 * example, `types.exactString` is a type validator constructor:
 *
 * ```ts
 * const myType = types.exactString("potato");
 * // myType is a function which returns true or false
 *
 * is("eggplant", myType); // returns false
 * is("potato", myType); // returns true
 * ```
 *
 * ## List of Functions
 *
 * ### Type Validators
 *
 * Here is a list of all the type validators:
 *
 * - `any`
 * - `anyArray`
 * - `anyFunction`
 * - `anyMap`
 * - `anyObject`
 * - `anySet`
 * - `anyTypeValidator`
 * - `array` (alias of `arrayOfUnknown`)
 * - `arrayOfAny`
 * - `arrayOfUnknown`
 * - `Array` (alias of `arrayOfUnknown`)
 * - `bigint`
 * - `BigInt` (alias of `bigint`)
 * - `boolean`
 * - `Boolean` (alias of `boolean`)
 * - `Date`
 * - `Error`
 * - `false`
 * - `falsy`
 * - `Function` (alias of `unknownFunction`)
 * - `Infinity`
 * - `integer`
 * - `map` (alias of `unknownMap`)
 * - `Map` (alias of `unknownMap`)
 * - `NaN`
 * - `NegativeInfinity`
 * - `never`
 * - `nonNullOrUndefined`
 * - `null`
 * - `nullish`
 * - `void` (alias of `nullish`)
 * - `number` (doesn't include NaN, Infinity, or -Infinity)
 * - `Number` (alias of `number`)
 * - `numberIncludingNanAndInfinities`
 * - `object` (alias of `unknownObject`)
 * - `Object` (alias of `unknownObject`)
 * - `objectOrNull`
 * - `RegExp`
 * - `set` (alias of `unknownSet`)
 * - `Set` (alias of `unknownSet`)
 * - `string`
 * - `String` (alias of `string`)
 * - `Symbol`
 * - `symbol` (alias of `Symbol`)
 * - `true`
 * - `truthy`
 * - `undefined`
 * - `unknown`
 * - `unknownFunction`
 * - `unknownMap`
 * - `unknownObject`
 * - `unknownSet`
 * - `unknownTypeValidator`
 * - `ArrayBuffer`
 * - `SharedArrayBuffer`
 * - `DataView`
 * - `TypedArray`
 * - `Int8Array`
 * - `Uint8Array`
 * - `Uint8ClampedArray`
 * - `Int16Array`
 * - `Uint16Array`
 * - `Int32Array`
 * - `Uint32Array`
 * - `Float32Array`
 * - `Float64Array`
 * - `FILE`
 * - `Path`
 * - `JSX.Element` (alias of `JSX.unknownElement`)
 * - `JSX.unknownElement`
 * - `JSX.anyElement`
 * - `JSX.Fragment`
 *
 * ### Type Validator Constructors
 *
 * And all the type validator constructors:
 *
 * - `and`
 * - `arrayOf`
 * - `exactBigInt`
 * - `exactNumber`
 * - `exactString`
 * - `exactSymbol`
 * - `hasClassName`
 * - `hasToStringTag`
 * - `instanceOf`
 * - `intersection`
 * - `mapOf`
 * - `mappingObjectOf`
 * - `maybe`
 * - `objectWithOnlyTheseProperties`
 * - `objectWithProperties`
 * - `or`
 * - `optional`
 * - `partialObjectWithProperties`
 * - `record`
 * - `setOf`
 * - `stringMatching`
 * - `symbolFor`
 * - `union`
 *
 * ## Coercion
 *
 * There is also a function, `types.coerce`, which returns an appropriate type
 * validator value for a given input value, using the following logic:
 *
 * | Input value                   | Output validator                   |
 * | ----------------------------- | ---------------------------------- |
 * | `String` or `string` global   | `types.string`                     |
 * | `Number` or `number` global   | `types.number`                     |
 * | `Boolean` or `boolean` global | `types.boolean`                    |
 * | `BigInt` or `bigint` global   | `types.bigint`                     |
 * | `Symbol` global               | `types.Symbol`                     |
 * | `RegExp` global               | `types.RegExp`                     |
 * | `Array` global                | `types.arrayOfUnknown`             |
 * | `Set` global                  | `types.unknownSet`                 |
 * | `Map` global                  | `types.unknownMap`                 |
 * | `Object` global               | `types.unknownObject`              |
 * | `Date` global                 | `types.Date`                       |
 * | `Function` global             | `types.unknownFunction`            |
 * | `ArrayBuffer` global          | `types.ArrayBuffer`                |
 * | `SharedArrayBuffer` global    | `types.SharedArrayBuffer`          |
 * | `DataView` global             | `types.DataView`                   |
 * | `Int8Array` global            | `types.Int8Array`                  |
 * | `Uint8Array` global           | `types.Uint8Array`                 |
 * | `Uint8ClampedArray` global    | `types.Uint8ClampedArray`          |
 * | `Int16Array` global           | `types.Int16Array`                 |
 * | `Uint16Array` global          | `types.Uint16Array`                |
 * | `Int32Array` global           | `types.Int32Array`                 |
 * | `Uint32Array` global          | `types.Uint32Array`                |
 * | `Float32Array` global         | `types.Float32Array`               |
 * | `Float64Array` global         | `types.Float64Array`               |
 * | `Path` global                 | `types.Path`                       |
 * | Any RegExp value              | Validator for matching strings     |
 * | Empty array                   | Validator for empty arrays         |
 * | Array with one item           | Validator for array of that item   |
 * | Array with multiple items     | Validator for tuple of those types |
 * | Class constructor function    | Validator for instances of it      |
 * | Any Object value              | Validator for same-shaped object   |
 * | null                          | `types.null`                       |
 * | undefined                     | `types.undefined`                  |
 * | true                          | `types.true`                       |
 * | false                         | `types.false`                      |
 * | NaN                           | `types.NaN`                        |
 * | Infinity                      | `types.Infinity`                   |
 * | `-Infinity`                   | `types.NegativeInfinity`           |
 * | Any string value              | `types.exactString(<the value>)`   |
 * | Any 'normal' number value     | `types.exactNumber(<the value>)`   |
 * | Any Symbol value              | `types.exactSymbol(<the value>)`   |
 * | Any BigInt value              | `types.exactBigInt(<the value>)`   |
 *
 * > All type constructors, as well as `is` and `assert.type`, do coercion
 * > automatically! This means that in many cases, you do not need to access
 * > properties from the `types` namespace.
 */
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
  ): TypeValidator<{ constructor: Function & { name: Name } }>;
  hasToStringTag(name: string): TypeValidator<any>;
  instanceOf<Klass extends Function & { prototype: any }>(
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

/**
 * Returns whether `value` is of type `type`. Useful for validating that values
 * have the correct type at runtime, in library functions or etc.
 *
 * The `type` parameter can be any of the following:
 *
 * - a TypeValidator function from the `types` namespace
 * - a global constructor like `String`, `Number`, `Boolean`, `Set`,
 *   `Int8Array`, etc
 * - a user-defined class
 * - a primitive value like `true`, `false`, `null`, or `42`
 * - a Regular Expression (to match strings that match the regexp)
 * - an object or array containing any combination of the above
 *
 * Note that yavascript has the following global aliases defined, which are also
 * valid types:
 *
 * ```ts
 * const bigint = BigInt;
 * const boolean = Boolean;
 * const number = Number;
 * const string = String;
 * const symbol = Symbol;
 * ```
 *
 * ## Example
 *
 * ```ts
 * is(42, Number); // true
 * is(42, number); // true
 * is(42, types.number); // true
 *
 * is(42, String); // false
 * is(42, Set); // false
 * is(42, Array); // false
 *
 * is(42, 42); // true
 * is(42, 45); // false
 *
 * is({ kind: "success", data: 99 }, { kind: "success" }); // true
 * ```
 *
 * ```ts
 * // Defined in yavascript/src/api/is
 * declare function is(value: any, type: TypeValidator<any>): boolean;
 * ```
 *
 * See also {@link types} (which contains {@link TypeValidator}s that can be
 * used by `is`) and {@link assert.type} (which throws an error instead of
 * returning a boolean).
 */
declare const is: <T extends TypeValidator<any> | CoerceableToTypeValidator>(
  value: any,
  type: T
) => value is UnwrapTypeFromCoerceableOrValidator<T>;

/**
 * Alias to {@link is}, for when using the Civet language, because `is` is a
 * reserved keyword in Civet.
 */
declare const _is: typeof is;

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
   * Throws an error if its argument isn't the correct type.
   *
   * @param value - The value to test the type of
   * @param type - The type that `value` should be, as either a `TypeValidator` (from the `types.*` namespace) or a value which can be coerced into a `TypeValidator` via the `types.coerce` function, like `String`, `Boolean`, etc.
   * @param message - An optional error message to use. If unspecified, a generic-but-descriptive message will be used.
   */
  type: <T extends TypeValidator<any> | CoerceableToTypeValidator>(
    value: any,
    type: T,
    optionalMessage?: string
  ) => asserts value is UnwrapTypeFromCoerceableOrValidator<T>;
};

/**
 * This API is a work-in-progress and is subject to change at any time.
 */
interface InteractivePrompt {
  prompt?: () => string;
  printInput?: (input: string) => void;
  historyFileName?: string;
  getCompletions?: (
    line: string,
    pos: number
  ) => {
    // TODO refactor these to have better key names
    tab: Array<string>;
    pos: number;
    ctx: { [key: string | number | symbol]: any };
  };

  handleInput: (input: string) => void;
  start(): void;
}

/**
 * This API is a work-in-progress and is subject to change at any time.
 */
interface InteractivePromptConstructor {
  new (
    handleInput: (input: string) => void,
    options?: {
      prompt?: () => string;
      printInput?: (input: string) => void;
      historyFileName?: string;
      getCompletions?: (
        line: string,
        pos: number
      ) => {
        // TODO refactor these to have better key names
        tab: Array<string>;
        pos: number;
        ctx: { [key: string | number | symbol]: any };
      };
    }
  ): InteractivePrompt;

  prototype: InteractivePrompt;
}

/**
 * This API is a work-in-progress and is subject to change at any time.
 */
declare var InteractivePrompt: InteractivePromptConstructor;

/**
 * Launch the Yavascript REPL (read-eval-print-loop).
 *
 * @param context Variables to make available as globals within the repl.
 * @param lang The language to use in the repl. Defaults to "javascript".
 */
declare const startRepl: {
  (
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
      | "civet"
  ): void;

  /**
   * A special value; when expressions result in this value, the repl will
   * print nothing instead of printing this value.
   */
  NOTHING: symbol;
};

/**
 * An object that points to a git repository on disk and provides utility
 * methods for getting information from that repo.
 *
 * To use it, construct a GitRepo object, passing in the path to the repo:
 *
 * ```ts
 * // The path here is just an example
 * const repo = new GitRepo("/home/suchipi/Code/yavascript");
 * ```
 *
 * Then, you can use methods/properties on the `repo` object:
 *
 * ```ts
 * console.log(repo.branchName() || repo.commitSHA());
 * ```
 */
declare class GitRepo {
  /**
   * Given a path to a file or folder on disk, searches upwards through the
   * directory ancestry to find a `.git` folder, then returns the Path that
   * contains that `.git` folder. If no `.git` folder is found, an error will be
   * thrown.
   *
   * For example, if you have a git repo at `/home/suchipi/Code/my-project`,
   * such that `/home/suchipi/Code/my-project/.git` exists, calling
   * `GitRepo.findRoot("/home/suchipi/Code/my-project/src/index.js")` will
   * return a `Path` object pointing to `/home/suchipi/Code/my-project`.
   *
   * This function can be useful in order to set the current working directory
   * of a script relative to the root of the git repo the script appears in. By
   * doing so, the script can be invoked from any directory.
   *
   * For instance, consider this theoretical filesystem layout:
   *
   * ```
   * my-project
   * - src
   *   - my-script.js
   * - README.md
   * ```
   *
   * If `my-script.js` contained the following content:
   *
   * ```ts
   * #!/usr/bin/env yavascript
   *
   * cat("README.md");
   * ```
   *
   * Then running `src/my-script.js` would print the contents of the README as
   * expected.
   *
   * However, suppose someone ran the script from a different folder:
   *
   * ```sh
   * $ cd src
   * $ ./my-script.js
   * ```
   *
   * Now an error occurs!
   *
   * To make the script resilient against this, you can use `cd` at the top of
   * the script:
   *
   * ```ts
   * #!/usr/bin/env yavascript
   *
   * // __dirname is a special variable that refers to the folder the current script is in.
   * cd(__dirname);
   * cd("..");
   *
   * cat("README.md");
   * ```
   *
   * However, if the location of `my-script.js` later changes, you will have to
   * remember to update the script. For instance, if `src/my-script.js` got
   * moved to `src/tools/my-script.js`, you would need to update the script like
   * so:
   *
   * ```ts
   * #!/usr/bin/env yavascript
   *
   * cd(__dirname);
   * cd("../.."); // Changed this line
   *
   * cat("README.md");
   * ```
   *
   * Since `README.md` will always be in the repository root, using
   * `GitRepo.findRoot` would make the `cd` resilient against file moves:
   *
   * ```ts
   * #!/usr/bin/env yavascript
   *
   * cd(GitRepo.findRoot(__dirname));
   *
   * cat("README.md");
   * ```
   *
   * Depending on how you anticipate your codebase changing over time, and how
   * you expect others to use your scripts, it might make sense to use
   * `cd(__dirname)`, `cd(GitRepo.findRoot(__dirname))`, or no `cd` at all. Pick what
   * makes the most sense for your situation.
   *
   */
  static findRoot(fromPath: string | Path): Path;

  /**
   * Creates a new `GitRepo` object for the given repo on disk.
   */
  constructor(repoDir: string | Path);

  /**
   * The root folder of the git repo that this `GitRepo` object represents (the
   * folder that contains the '.git' folder).
   */
  repoDir: Path;

  /**
   * Returns the full SHA-1 hash string associated with the repo's current
   * commit.
   *
   * For example:
   *
   * ```ts
   * const repo = new GitRepo(".");
   * const sha = repo.commitSHA();
   * console.log(sha);
   * // "2a0a15f9872406faebcac694562efeae3447a4ba"
   * ```
   *
   * To obtain this information, the command `git rev-parse HEAD` gets run
   * within the repo's directory.
   *
   * > If the repo has unstaged or uncommitted changes, that state will NOT be
   * > reflected in the SHA-1 hash. As such, it may be desirable to use this
   * > method in conjunction with `GitRepo.prototype.isWorkingTreeDirty`.
   */
  commitSHA(): string;

  /**
   * If the commit SHA the git repo is currently pointed at is the tip of a
   * named branch, returns the branch name. Otherwise, returns `null`.
   *
   * This is done by running `git rev-parse --abbrev-ref HEAD` within the repo
   * directory.
   *
   * Example:
   *
   * ```ts
   * const repo = new GitRepo(".");
   * const branch = repo.branchName();
   * console.log(branch);
   * // "main"
   * ```
   *
   * > The most common situation where there is no current branch is when the
   * > repository is in "detached HEAD" state.
   */
  branchName(): string | null;

  /**
   * Returns a boolean indicating whether there are uncommited changes in the
   * git repo. `true` means there are changes, `false` means there are no
   * changes (ie. the repo is clean).
   *
   * This is done by running `git status --quiet` within the repo directory.
   */
  isWorkingTreeDirty(): boolean;

  /**
   * Returns a boolean indicating whether the provided path is ignored by one or
   * more `.gitignore` files in the repository.
   *
   * Example:
   *
   * ```ts
   * const repo = new GitRepo(".");
   * const ignoreStatus = repo.isIgnored("README.md");
   * console.log(ignoreStatus);
   * // false
   * ```
   *
   * To obtain this information, the command `git check-ignore <the-path>` gets
   * run within the repo's directory.
   *
   * An error will be thrown if the provided path is not within the repository's
   * directory tree. For instance, calling `gitRepo.isIgnored("/tmp")` on a
   * `gitRepo` pointed at `/home/suchipi/my-project` would throw an error,
   * because `/tmp` is not a child of `/home/suchipi/my-project`.
   *
   * > NOTE: When passing relative paths to `isIgnored`, they will be resolved
   * > relative to the repo root, NOT relative to `pwd()`. It's best practice to
   * > always pass around absolute paths in your program instead of relative
   * > ones so that this type of ambiguity is avoided.
   */
  isIgnored(path: string | Path): boolean;
}

/**
 * The logger used internally by yavascript API functions such as {@link which},
 * {@link exec}, {@link copy}, {@link glob}, and more.
 *
 * You can modify the properties on this object in order to configure the
 * amount and style of log output from yavascript API functions.
 *
 * This object behaves similarly to the shell builtin `set -x`.
 */
declare const logger: {
  /**
   * This property is used as the default value for `trace` in yavascript API
   * functions which receive `logging.trace` as an option, like {@link which},
   * {@link exec}, {@link copy} and {@link glob}.
   *
   * The default value of `logger.trace` is a no-op function.
   */
  trace: (...args: Array<any>) => void;

  /**
   * This property is used as the default value for `info` in yavascript API
   * functions which receive `logging.info` as an option, like {@link exec},
   * {@link copy}, and {@link glob}.
   *
   * The default value of `logger.info` writes dimmed text to stderr.
   */
  info: (...args: Array<any>) => void;

  /**
   * This property is used as the default value for `warn` in yavascript API
   * functions which receive `logging.warn` as an option, like {@link readEnvBool}.
   *
   * The default value of `logger.warn` writes yellow text to stderr.
   */
  warn: (...args: Array<any>) => void;
};

/**
 * The properties of the `JSX` global can be modified to change how JSX syntax
 * gets compiled by yavascript. Those properties are:
 *
 * - `pragma` (string): The JavaScript expression that should be called to
 *   create JSX elements. Defaults to "JSX.createElement".
 * - `pragmaFrag` (string): The JavaScript expression that should be used when
 *   creating JSX fragments. Defaults to "JSX.Fragment".
 * - `createElement` (function): The function used to create JSX elements,
 *   unless `JSX.pragma` has been changed.
 * - `Element` (symbol): used by the default `JSX.createElement` function to
 *   identify JSX elements.
 * - `Fragment` (symbol): used by the default `JSX.createElement` function to
 *   identify JSX fragments. Referenced by the default value for
 *   `JSX.pragmaFrag`.
 *
 * Modifying these properties will change how JSX syntax gets compiled.
 *
 * For instance, to use React for JSX, you could either replace
 * `JSX.createElement` and `JSX.Fragment` with React's versions:
 *
 * ```ts
 * import * as React from "npm:react";
 *
 * JSX.createElement = React.createElement;
 * JSX.Fragment = React.Fragment;
 * ```
 *
 * Or, you could change `JSX.pragma` and `JSX.pragmaFrag` to reference React
 * directly:
 *
 * ```ts
 * JSX.pragma = "React.createElement";
 * JSX.pragmaFrag = "React.Fragment";
 * ```
 *
 * Note however, that changes to `pragma` and `pragmaFrag` will only affect JSX
 * appearing in files which are loaded _after_ the change, but changing
 * `createElement` and `Fragment` will affect all JSX syntax appearing after the
 * change, even within the same file.
 *
 * Whichever approach you take, you should also update `types.JSX.Element` and
 * `types.JSX.Fragment` such that the expression `types.JSX.Element(<a />) &&
 * types.JSX.Fragment(<></>)` is always `true`. To do that for React, you would
 * do:
 *
 * ```ts
 * types.JSX.Element = React.isValidElement;
 * types.JSX.Fragment = (value) => {
 *   return React.isValidElement(value) && value.type === React.Fragment;
 * };
 * ```
 */
declare namespace JSX {
  /**
   *
   * A string containing the expression that should be called to create JSX
   * elements. yavascript's internals use this string to transpile JSX syntax.
   *
   * The default value is "JSX.createElement".
   *
   * If changed, any JSX code loaded afterwards will use a different expression.
   *
   * Note that if you change this, you need to verify that the following
   * expression always evaluates to `true` (by changing `types.JSX.Element` and
   * `types.JSX.Fragment`):
   *
   * ```jsx
   * types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
   * ```
   *
   * Failure to uphold this guarantee indicates a bug.
   *
   * For more info, including info on how to change how JSX is compiled, see
   * {@link JSX}.
   */
  export let pragma: string;

  /**
   * A string containing the expression that should be used as the first
   * parameter when creating JSX fragment elements. yavascript's internals use
   * this string to transpile JSX syntax.
   *
   * Defaults to "JSX.Fragment".
   *
   * If changed, any JSX code loaded afterwards will use a different expression.
   *
   * Note that if you change this, you need to verify that the following
   * expression always evaluates to `true` (by changing `types.JSX.Element` and
   * `types.JSX.Fragment`):
   *
   * ```jsx
   * types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
   * ```
   *
   * Failure to uphold this guarantee indicates a bug.
   *
   * For more info, including info on how to change how JSX is compiled, see
   * {@link JSX}.
   */
  export let pragmaFrag: string;

  /**
   * `JSX.Element` is a Symbol. The default implementation of
   * `JSX.createElement` creates objects whose `$$typeof` property is set to
   * `JSX.Element`, and type validator functions under the `types.JSX.*`
   * namespace look for this property in order to determine whether an object is
   * a JSX element, as created via `JSX.createElement` or JSX syntax.
   *
   * ```jsx
   * // This gets compiled internally by yavascript into:
   * // const a = JSX.createElement('a', null);
   * const a = <a />;
   *
   * console.log(a);
   * // {
   * //   $$typeof: Symbol(JSX.Element)
   * //   type: "a"
   * //   props: null
   * //   key: null
   * // }
   *
   * console.log(a.$$typeof === JSX.Element);
   * // true
   * ```
   *
   * There is also a TypeScript type called `JSX.Element` which is a type for
   * the JSX element objects as created by `JSX.createElement` or JSX syntax.
   *
   * If you modify properties on the JSX global such that the default
   * implementation of `JSX.createElement` is no longer used (eg. by replacing
   * it with `React.createElement`), this value may no longer be relevant.
   * However, the default JSX element object shape is designed to match
   * React/Preact/etc.
   *
   * For more info, including info on how to change how JSX is compiled, see
   * {@link JSX}.
   *
   */
  export const Element: unique symbol;

  /**
   * The TypeScript type for JSX Element objects created by the default
   * implementation of `JSX.createElement`.
   */
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
   *
   * `JSX.Fragment` is a Symbol which is used to indicate whether a JSX element
   * is a JSX fragment.
   *
   * ```jsx
   * // This gets compiled internally by yavascript into:
   * // const a = JSX.createElement(JSX.Fragment, null);
   * const frag = <></>;
   *
   * console.log(frag);
   * // {
   * //   $$typeof: Symbol(JSX.Element)
   * //   type: Symbol(JSX.Fragment)
   * //   props: null
   * //   key: null
   * // }
   *
   * console.log(a.type === JSX.Fragment);
   * // true
   * ```
   *
   * There is also a TypeScript type called `JSX.Fragment` which is a type for
   * the JSX fragment element objects as created by `JSX.createElement` or JSX
   * syntax.
   *
   * If you modify properties on the JSX global such that `JSX.Fragment` is no
   * longer used (eg. by replacing it with `React.Fragment`), this value may no
   * longer be relevant.
   *
   * For more info, including info on how to change how JSX is compiled, see
   * {@link JSX}.
   */
  export const Fragment: unique symbol;

  /**
   * The TypeScript type for JSX Element objects whose type is `JSX.Fragment`,
   * which is what yavascript creates internally when JSX fragment syntax
   * (`<></>`) is used.
   *
   * If you modify properties on the JSX global such that `JSX.Fragment` is no
   * longer used (eg. by replacing it with `React.Fragment`), this type may no
   * longer be relevant.
   */
  export type Fragment = Element<{}, typeof Fragment>;

  /**
   * The JSX element builder function, which gets invoked internally by
   * yavascript whenever JSX syntax is used (unless `JSX.pragma` gets changed by
   * the user).
   *
   * Note that if you change this, you need to verify that the following
   * expression always evaluates to `true` (by changing `types.JSX.Element` and
   * `types.JSX.Fragment`):
   *
   * ```jsx
   * types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
   * ```
   *
   * Failure to uphold this guarantee indicates a bug.
   *
   * For more info, including info on how to change how JSX is compiled, see
   * {@link JSX}.
   *
   */
  export let createElement: {
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

/**
 * The `YAML` namespace contains functions which can serialize and deserialize
 * YAML documents, following the same pattern as JavaScript's `JSON` builtin.
 */
declare const YAML: {
  /**
   * Converts a YAML document string into a JavaScript value. It works the same
   * way that `JSON.parse` does, but for YAML.
   */
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any
  ): any;

  /**
   * Converts a JavaScript value into a YAML document string. It works the same
   * way that `JSON.stringify` does, but for YAML.
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

/**
 * Serializes or deserializes CSV data.
 *
 * The `CSV` object contains a `parse` function and a `stringify` function which
 * can be used to parse strings of CSV (comma-separated values) data into
 * arrays-of-arrays-of-strings and serialize arrays-of-arrays-of-strings into
 * strings of CSV data.
 *
 * Its interface is similar to `JSON.parse` and `JSON.stringify`, but CSV does
 * not support the spacing/replacer/reviver options that `JSON.parse` and
 * `JSON.stringify` have.
 */
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

/**
 * An object with a `parse` function and a `stringify` function which can be
 * used to parse TOML document strings into objects and serialize objects into
 * TOML document strings.
 *
 * Its interface is similar to `JSON.parse` and `JSON.stringify`, but
 * `TOML.parse` and `TOML.stringify` do not support the spacing/replacer/reviver
 * options that `JSON.parse` and `JSON.stringify` do.
 */
declare var TOML: {
  /**
   * Parse a TOML document string (`data`) into an object.
   */
  parse(data: string): { [key: string]: any };
  /**
   * Convert an object into a TOML document.
   */
  stringify(data: { [key: string]: any }): string;
};

interface RegExpConstructor {
  /**
   * The function `RegExp.escape` accepts an input string and prefixes with `\`
   * those characters in that string which have a special meaning when appearing
   * in a regular expression.
   *
   * The implementation is based on the stage 2 ECMAScript proposal of the same
   * name: https://github.com/tc39/proposal-regex-escaping
   */
  escape(str: any): string;
}

interface StringConstructor {
  /**
   * The function `String.dedent` can be used to remove leading indentation from
   * a string. It is commonly used as a tagged template function, but you can
   * also call it and pass in a string.
   *
   * Note that the first line of the string must be empty.
   *
   * `String.dedent` is the default export from the npm package `string-dedent`.
   * See its readme on npm for more info:
   * https://www.npmjs.com/package/string-dedent
   */
  dedent: {
    /**
     * Removes leading minimum indentation from the string `input`.
     * The first line of `input` MUST be empty.
     *
     * For more info, see: https://www.npmjs.com/package/string-dedent#usage
     */
    (input: string): string;

    /**
     * Removes leading minimum indentation from the tagged template literal.
     * The first line of the template literal MUST be empty.
     *
     * For more info, see: https://www.npmjs.com/package/string-dedent#usage
     */
    (
      strings: readonly string[] | ArrayLike<string>,
      ...substitutions: unknown[]
    ): string;

    /**
     * Wrap another template tag function such that tagged literals
     * become dedented before being passed to the wrapped function.
     *
     * For more info, see: https://www.npmjs.com/package/string-dedent#usage
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

/**
 * Opens the resource at the given path or URL using the operating system's
 * default application or handler.
 *
 * Examples:
 *
 * ```ts
 * openUrl("/home/me/stuff/code.txt"); // opens code.txt in your default text editor
 * openUrl("code.txt"); // same as above, using relative path
 * openUrl("file:///home/me/stuff/code.txt"); // same as above, using file:// url
 *
 * openUrl("IMG_001.jpg"); // opens IMG_001.jpg in your default image viewer
 *
 * openUrl("https://example.com/") // opens example.com in your default web browser
 * ```
 */
declare function openUrl(urlOrFilePath: string | Path): void;

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

interface ErrorOptions {
  [key: string]: any;
}

/**
 * For compatibility with Node.js scripts, the global object is accessible via
 * the global variable named "global".
 */
declare var global: typeof globalThis;

/**
 * A `process` global is provided for rudimentary compatibility with Node.js
 * scripts. It contains a subset of the properties found on the Node.js
 * `process` global, which each forward to their corresponding yavascript API.
 *
 * For instance, `process.env` is a getter that returns {@link env}, and
 * `process.argv` is a getter that returns {@link scriptArgs}.
 *
 * If you are writing yavascript-specific code, you should use yavascript's APIs
 * instead of `process`.
 */
declare var process: {
  version: string;
  versions: {
    node: string;
    yavascript: string;
    unicode: string;
  };
  arch: string;
  /** Same as the global {@link env}. */
  readonly env: { [key: string]: string | undefined };
  /** Same as the global {@link scriptArgs}. */
  readonly argv: Array<string>;
  /** Same as `scriptArgs[0]`. */
  readonly argv0: string;
  /**
   * Shortcut for `os.realpath(os.execPath())`, using the QuickJS {@link os}
   * module.
   */
  readonly execPath: string;
  /**
   * Uses `std.getExitCode()` and `std.setExitCode()` from the QuickJS
   * {@link std} module.
   */
  exitCode: number;
  /**
   * Uses `std.exit()` from the QuickJS {@link std} module.
   */
  exit(code?: number | null | undefined): void;
};

// ==========================================
// ------------------------------------------
// QuickJS APIs, which YavaScript builds upon
// ------------------------------------------
// ==========================================
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

  /**
   * Returns a boolean indicating whether the specified value is a primitive value.
   */
  isPrimitive(input: any): boolean;
}

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

  /**
   * To override operators (+, -, ==, etc) for an object, set its
   * `Symbol.operatorSet` property to an `OperatorSet` object, which can be
   * created via `Operators.create`.
   */
  readonly operatorSet: unique symbol;
}

/**
 * An object that, if placed on another object's `Symbol.operatorSet` property,
 * will overload its operators to behave as defined by the functions this
 * OperatorSet was constructed with.
 *
 * You can create an OperatorSet via `Operators(...)` or
 * `Operators.create(...)`.
 */
declare type OperatorSet = {
  /**
   * This property is not here at runtime; we just use it to make this type
   * differ from an empty object.
   */
  __is__: "OperatorSet";
};

interface OperatorFunctions<Left, Right> {
  "+": (left: Left, right: Right) => any;
  "-": (left: Left, right: Right) => any;
  "*": (left: Left, right: Right) => any;
  "/": (left: Left, right: Right) => any;
  "%": (left: Left, right: Right) => any;
  "**": (left: Left, right: Right) => any;
  "|": (left: Left, right: Right) => any;
  "&": (left: Left, right: Right) => any;
  "^": (left: Left, right: Right) => any;
  "<<": (left: Left, right: Right) => any;
  ">>": (left: Left, right: Right) => any;
  ">>>": (left: Left, right: Right) => any;
  "==": (left: Left, right: Right) => any;
  "<": (left: Left, right: Right) => any;
  pos: (left: Left, right: Right) => any;
  neg: (left: Left, right: Right) => any;
  "++": (left: Left, right: Right) => any;
  "--": (left: Left, right: Right) => any;
  "~": (left: Left, right: Right) => any;
}

interface SelfOperators<T> extends Partial<OperatorFunctions<T, T>> {
  left?: undefined;
  right?: undefined;
}

interface LeftOperators<T, Left> extends Partial<OperatorFunctions<Left, T>> {
  left: {};
  right?: undefined;
}

interface RightOperators<T, Right>
  extends Partial<OperatorFunctions<T, Right>> {
  left?: undefined;
  right: {};
}

interface OperatorsConstructor {
  /**
   * Creates a new OperatorSet object, which should be placed on an object's
   * Symbol.operatorSet property.
   */
  <T>(
    selfOperators?: SelfOperators<T>,
    ...otherOperators: Array<LeftOperators<T, any> | RightOperators<T, any>>
  ): OperatorSet;

  /**
   * Creates a new OperatorSet object, which should be placed on an object's
   * Symbol.operatorSet property.
   */
  create: <T>(
    selfOperators?: SelfOperators<T>,
    ...otherOperators: Array<LeftOperators<T, any> | RightOperators<T, any>>
  ) => OperatorSet;

  /**
   * In math mode, the BigInt division and power operators can be overloaded by
   * using this function.
   */
  updateBigIntOperators(
    ops: Pick<OperatorFunctions<BigInt, BigInt>, "/" | "**">
  ): void;
}

declare var Operators: OperatorsConstructor;

interface Number {
  [Symbol.operatorSet]: OperatorSet;
}

interface Boolean {
  [Symbol.operatorSet]: OperatorSet;
}

interface String {
  [Symbol.operatorSet]: OperatorSet;
}

interface BigInt {
  [Symbol.operatorSet]: OperatorSet;
}

interface BigIntConstructor {
  /**
   * Return trunc(a/b).
   *
   * b = 0 raises a RangeError exception.
   */
  tdiv(a: bigint, b: bigint): bigint;

  /**
   * Return \lfloor a/b \rfloor.
   *
   * b = 0 raises a RangeError exception.
   */
  fdiv(a: bigint, b: bigint): bigint;

  /**
   * Return \lceil a/b \rceil.
   *
   * b = 0 raises a RangeError exception.
   */
  cdiv(a: bigint, b: bigint): bigint;

  /**
   * Return sgn(b) \lfloor a/{|b|} \rfloor (Euclidian division).
   *
   * b = 0 raises a RangeError exception.
   */
  ediv(a: bigint, b: bigint): bigint;

  /**
   * Perform trunc(a/b) and return an array of two elements. The first element
   * is the quotient, the second is the remainder.
   *
   * b = 0 raises a RangeError exception.
   */
  tdivrem(a: bigint, b: bigint): [bigint, bigint];

  /**
   * Perform \lfloor a/b \rfloor and return an array of two elements. The first
   * element is the quotient, the second is the remainder.
   *
   * b = 0 raises a RangeError exception.
   */
  fdivrem(a: bigint, b: bigint): [bigint, bigint];

  /**
   * Perform \lceil a/b \rceil and return an array of two elements. The first
   * element is the quotient, the second is the remainder.
   *
   * b = 0 raises a RangeError exception.
   */
  cdivrem(a: bigint, b: bigint): [bigint, bigint];

  /**
   * Perform sgn(b) \lfloor a/{|b|} \rfloor (Euclidian division) and return an
   * array of two elements. The first element is the quotient, the second is
   * the remainder.
   *
   * b = 0 raises a RangeError exception.
   */
  edivrem(a: bigint, b: bigint): [bigint, bigint];

  /**
   * Return \lfloor \sqrt(a) \rfloor.
   *
   * A RangeError exception is raised if a < 0.
   */
  sqrt(a: bigint): bigint;

  /**
   * Return an array of two elements. The first element is
   * \lfloor \sqrt{a} \rfloor. The second element is
   * a-\lfloor \sqrt{a} \rfloor^2.
   *
   * A RangeError exception is raised if a < 0.
   */
  sqrtrem(a: bigint): [bigint, bigint];

  /**
   * Return -1 if a \leq 0 otherwise return \lfloor \log2(a) \rfloor.
   */
  floorLog2(a: bigint): bigint;

  /**
   * Return the number of trailing zeros in the two’s complement binary representation of a.
   *
   * Return -1 if a=0.
   */
  ctz(a: bigint): bigint;
}

declare type BigFloatRoundingMode = number & {
  /**
   * This property is not here at runtime; we just use it to make this type
   * differ from a normal number
   */
  __is__: "BigFloatRoundingMode";
};

interface BigFloatEnvConstructor {
  /**
   * Creates a new floating point environment. Its status flags are reset.
   *
   * - If unspecified, `precision` defaults to the precision from the global floating point environment.
   * - If unspecified, `roundingMode` defaults to RNDN.
   */
  new (precision?: number, roundingMode?: BigFloatRoundingMode): BigFloatEnv;

  /**
   * The mantissa precision in bits of the global floating point environment.
   *
   * The initial value is 113.
   */
  get prec(): number;

  /**
   * The exponent size in bits of the global floating point environment,
   * assuming an IEEE 754 representation.
   *
   * The initial value is 15.
   */
  get expBits(): number;

  /**
   * Sets the mantissa precision of the global floating point environment to
   * `prec` and the exponent size to `expBits`, then calls the function `func`.
   * Then the precision and exponent size are reset to their previous values
   * and the return value of `func` is returned (or an exception is raised if
   * `func` raised an exception).
   *
   * If expBits is undefined, it is set to {@link BigFloatEnv.expBitsMax}.
   *
   * @param func The function to call within the modified environment
   * @param prec The mantissa precision (in bits) to use in the modified environment
   * @param expBits The exponent size (in bits) to use in the modified environment. Defaults to {@link BigFloatEnv.expBitsMax}.
   */
  setPrec<Ret>(func: () => Ret, prec: number, expBits?: number): Ret;

  /**
   * Integer; the minimum allowed precision. Must be at least 2.
   */
  readonly precMin: number;

  /**
   * Integer; the maximum allowed precision. Must be at least 113.
   */
  readonly precMax: number;

  /**
   * Integer; the minimum allowed exponent size in bits. Must be at least 3.
   */
  readonly expBitsMin: number;

  /**
   * Integer; the maximum allowed exponent size in bits. Must be at least 15.
   */
  readonly expBitsMax: number;

  /**
   * Round to nearest, with ties to even rounding mode.
   */
  readonly RNDN: BigFloatRoundingMode;

  /**
   * Round to zero rounding mode.
   */
  readonly RNDZ: BigFloatRoundingMode;

  /**
   * Round to -Infinity rounding mode.
   */
  readonly RNDD: BigFloatRoundingMode;

  /**
   * Round to +Infinity rounding mode.
   */
  readonly RNDU: BigFloatRoundingMode;

  /**
   * Round to nearest, with ties away from zero rounding mode.
   */
  readonly RNDNA: BigFloatRoundingMode;

  /**
   * Round away from zero rounding mode.
   */
  readonly RNDA: BigFloatRoundingMode;

  /**
   * Faithful rounding mode. The result is non-deterministically rounded to
   * -Infinity or +Infinity.
   *
   * This rounding mode usually gives a faster and deterministic running time
   * for the floating point operations.
   */
  readonly RNDF: BigFloatRoundingMode;

  prototype: BigFloatEnv;
}

declare var BigFloatEnv: BigFloatEnvConstructor;

/**
 * A BigFloatEnv contains:
 *
 * - the mantissa precision in bits
 * - the exponent size in bits assuming an IEEE 754 representation;
 * - the subnormal flag (if true, subnormal floating point numbers can be generated by the floating point operations).
 * - the rounding mode
 * - the floating point status. The status flags can only be set by the floating point operations. They can be reset with BigFloatEnv.prototype.clearStatus() or with the various status flag setters.
 */
interface BigFloatEnv {
  /**
   * The mantissa precision, in bits.
   *
   * If precision was not specified as an argument to the BigFloatEnv
   * constructor, defaults to the precision value of the global floating-point
   * environment ({@link BigFloatEnv.prec}).
   */
  get prec(): number;
  set prec(newValue: number);

  /**
   * The exponent size in bits assuming an IEEE 754 representation.
   *
   * Defaults to the exponent size of the global floating-point environment
   * ({@link BigFloatEnv.expBits}).
   */
  get expBits(): number;
  set expBits(newValue: number);

  /**
   * The rounding mode.
   *
   * If the rounding mode was not specified as an argument to the BigFloatEnv
   * constructor, defaults to {@link BigFloatEnv.RNDN}.
   */
  get rndMode(): BigFloatRoundingMode;
  set rndMode(newMode: BigFloatRoundingMode);

  /** subnormal flag. It is false when expBits = expBitsMax. Defaults to false. */
  get subnormal(): boolean;
  set subnormal(newValue: boolean);

  /** Status flag; cleared by `clearStatus`. */
  get invalidOperation(): boolean;
  set invalidOperation(newValue: boolean);

  /** Status flag; cleared by `clearStatus`. */
  get divideByZero(): boolean;
  set divideByZero(newValue: boolean);

  /** Status flag; cleared by `clearStatus`. */
  get overflow(): boolean;
  set overflow(newValue: boolean);

  /** Status flag; cleared by `clearStatus`. */
  get underflow(): boolean;
  set underflow(newValue: boolean);

  /** Status flag; cleared by `clearStatus`. */
  get inexact(): boolean;
  set inexact(newValue: boolean);

  /**
   * Clear the status flags (invalidOperation, divideByZero, overflow,
   * underflow, and inexact).
   */
  clearStatus(): void;
}

interface BigFloatConstructor {
  /**
   * If `value` is a numeric type, it is converted to BigFloat without rounding.
   *
   * If `value`` is a string, it is converted to BigFloat using the precision of the global floating point environment ({@link BigFloatEnv.prec}).
   */
  (value: number | string | BigInt | BigFloat): BigFloat;

  prototype: BigFloat;

  /**
   * The value of {@link Math.LN2} rounded to nearest, ties to even with the
   * current global precision.
   *
   * The constant values are cached for small precisions.
   */
  get LN2(): BigFloat;

  /**
   * The value of {@link Math.PI} rounded to nearest, ties to even with
   * the current global precision.
   *
   * The constant values are cached for small precisions.
   */
  get PI(): BigFloat;

  /**
   * The value of {@link Number.MIN_VALUE} as a BigFloat.
   */
  get MIN_VALUE(): BigFloat;

  /**
   * The value of {@link Number.MAX_VALUE} as a BigFloat.
   */
  get MAX_VALUE(): BigFloat;

  /**
   * The value of {@link Number.EPSILON} as a BigFloat.
   */
  get EPSILON(): BigFloat;

  /**
   * Rounds the floating point number `a` according to the floating point
   * environment `e` or the global environment if `e` is undefined.
   */
  fpRound(a: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Parses the string `a` as a floating point number in radix `radix`.
   *
   * The radix is 0 (default) or from 2 to 36. The radix 0 means radix 10
   * unless there is a hexadecimal or binary prefix.
   *
   * The result is rounded according to the floating point environment `e` or
   * the global environment if `e` is undefined.
   */
  parseFloat(a: string, radix?: number, e?: BigFloatEnv): BigFloat;

  /**
   * Returns true if `a` is a finite bigfloat. Returns false otherwise.
   */
  isFinite(a: BigFloat): boolean;

  /**
   * Returns true if a is a NaN bigfloat. Returns false otherwise.
   */
  isNaN(a: BigFloat): boolean;

  /**
   * Adds `a` and `b` together and rounds the resulting floating point number
   * according to the floating point environment `e`, or the global environment
   * if e is undefined.
   *
   * If `e` is specified, the floating point status flags on `e` are updated.
   */
  add(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Subtracts `b` from `a` and rounds the resulting floating point number
   * according to the floating point environment `e`, or the global environment
   * if e is undefined.
   *
   * If `e` is specified, the floating point status flags on `e` are updated.
   */
  sub(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Multiplies `a` and `b` together and rounds the resulting floating point
   * number according to the floating point environment `e`, or the global
   * environment if e is undefined.
   *
   * If `e` is specified, the floating point status flags on `e` are updated.
   */
  mul(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Divides `a` by `b` and rounds the resulting floating point number
   * according to the floating point environment `e`, or the global environment
   * if e is undefined.
   *
   * If `e` is specified, the floating point status flags on `e` are updated.
   */
  div(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Rounds `x` down to the nearest integer.
   *
   * No additional rounding (ie. BigFloatEnv-related rounding) is performed.
   */
  floor(x: BigFloat): BigFloat;

  /**
   * Rounds `x` up to the nearest integer.
   *
   * No additional rounding (ie. BigFloatEnv-related rounding) is performed.
   */
  ceil(x: BigFloat): BigFloat;

  /**
   * Rounds `x` to the nearest integer.
   *
   * No additional rounding (ie. BigFloatEnv-related rounding) is performed.
   */
  round(x: BigFloat): BigFloat;

  /**
   * Truncates the fractional part of `x`, resulting in an integer.
   *
   * No additional rounding (ie. BigFloatEnv-related rounding) is performed.
   */
  trunc(x: BigFloat): BigFloat;

  /**
   * Returns the absolute value of `x`.
   *
   * No additional rounding (ie. BigFloatEnv-related rounding) is performed.
   */
  abs(x: BigFloat): BigFloat;

  /**
   * Floating point remainder. The quotient is truncated to zero.
   *
   * `e` is an optional floating point environment.
   */
  fmod(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Floating point remainder. The quotient is rounded to the nearest integer
   * with ties to even.
   *
   * `e` is an optional floating point environment.
   */
  remainder(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Square root. Returns a rounded floating point number.
   *
   * e is an optional floating point environment.
   */
  sqrt(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  sin(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  cos(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  tan(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  asin(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  acos(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  atan(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  atan2(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  exp(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  log(x: BigFloat, e?: BigFloatEnv): BigFloat;

  /**
   * Returns a rounded floating point number.
   *
   * `e` is an optional floating point environment.
   */
  pow(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
}

declare var BigFloat: BigFloatConstructor;

/**
 * The BigFloat type represents floating point numbers in base 2 with the IEEE 754 semantics.
 *
 * A floating point number is represented as a sign, mantissa and exponent.
 *
 * The special values NaN, +/-Infinity, +0 and -0 are supported.
 *
 * The mantissa and exponent can have any bit length with an implementation specific minimum and maximum.
 */
interface BigFloat {
  valueOf(): BigFloat;

  /** radix must be between 2 and 36 */
  toString(radix?: number): string;

  /**
   * Returns a string containing a number represented either in exponential or
   * fixed-point notation with a specified number of digits.
   *
   * @param precision Number of significant digits. There is no range limit on this number.
   * @param roundingMode The rounding mode to use when representing the value. Defaults to {@link BigFloatEnv.RNDNA}.
   * @param radix The base to use when representing the value. Must be an integer between 2 and 36. Defaults to 10.
   */
  toPrecision(
    precision: number,
    roundingMode?: BigFloatRoundingMode,
    radix?: number
  ): string;

  /**
   * Returns a string representing a number in fixed-point notation.
   *
   * @param fractionDigits Number of digits after the decimal point. There is no range limit on this number.
   * @param roundingMode The rounding mode to use when representing the value. Defaults to {@link BigFloatEnv.RNDNA}.
   * @param radix The base to use when representing the value. Must be an integer between 2 and 36. Defaults to 10.
   */
  toFixed(
    fractionDigits: number,
    roundingMode?: BigFloatRoundingMode,
    radix?: number
  ): string;

  /**
   * Returns a string containing a number represented in exponential notation.
   *
   * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   * @param roundingMode The rounding mode to use when representing the value. Defaults to {@link BigFloatEnv.RNDNA}.
   * @param radix The base to use when representing the value. Must be an integer between 2 and 36. Defaults to 10.
   */
  toExponential(
    fractionDigits: number,
    roundingMode?: BigFloatRoundingMode,
    radix?: number
  ): string;

  [Symbol.typeofValue]: () => "bigfloat";
}

declare type BigDecimalRoundingMode =
  | "floor"
  | "ceiling"
  | "down"
  | "up"
  | "half-even"
  | "half-up";

declare type BigDecimalRoundingObject =
  | {
      /** must be >= 1 */
      maximumSignificantDigits: number;
      roundingMode: BigDecimalRoundingMode;
    }
  | {
      /** must be >= 0 */
      maximumFractionDigits: number;
      roundingMode: BigDecimalRoundingMode;
    };

interface BigDecimalConstructor {
  (): BigDecimal;
  (value: number | string | BigInt | BigFloat): BigDecimal;

  /**
   * Adds together `a` and `b` and rounds the result according to the rounding
   * object `e`. If the rounding object is not present, the operation is
   * executed with infinite precision; in other words, no rounding occurs when
   * the rounding object is not present.
   */
  add(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;

  /**
   * Subtracts `b` from `a` and rounds the result according to the rounding
   * object `e`. If the rounding object is not present, the operation is
   * executed with infinite precision; in other words, no rounding occurs when
   * the rounding object is not present.
   */
  sub(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;

  /**
   * Multiplies together `a` and `b` and rounds the result according to the
   * rounding object `e`. If the rounding object is not present, the operation
   * is executed with infinite precision; in other words, no rounding occurs
   * when the rounding object is not present.
   */
  mul(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;

  /**
   * Divides `a` by `b` and rounds the result according to the rounding object
   * `e`.
   *
   * If the rounding object is not present, an attempt is made to perform the
   * operation with infinite precision. However, not all quotients can be
   * represented with infinite precision. If the quotient cannot be represented
   * with infinite precision, a RangeError is thrown.
   *
   * A RangeError is thrown when dividing by zero.
   */
  div(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;

  /**
   * Perform the modulo operation of `a` by `b` and round the result according
   * to the rounding object `e`. If the rounding object is not present, the
   * operation is executed with infinite precision; in other words, no rounding
   * occurs when the rounding object is not present.
   */
  mod(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;

  /**
   * Obtain the square root of `a`, rounding the result according to the
   * rounding object `e`.
   *
   * If `a` is less than zero, a RangeError will be thrown.
   *
   * Note that the rounding object is *required*.
   */
  sqrt(a: BigDecimal, e: BigDecimalRoundingObject): BigDecimal;

  /**
   * Rounds `a` using the rounding object `e`.
   */
  round(a: BigDecimal, e: BigDecimalRoundingObject): BigDecimal;

  prototype: BigDecimal;
}

declare var BigDecimal: BigDecimalConstructor;

/**
 * The BigDecimal type represents floating point numbers in base 10.
 *
 * It is inspired from the proposal available at https://github.com/littledan/proposal-bigdecimal.
 *
 * The BigDecimal floating point numbers are always normalized and finite.
 * There is no concept of -0, Infinity or NaN. By default, all the computations
 * are done with infinite precision.
 */
interface BigDecimal {
  /**
   * Returns the bigdecimal primitive value corresponding to this BigDecimal.
   */
  valueOf(): BigDecimal;

  /**
   * Converts this BigDecimal to a string with infinite precision in base 10.
   */
  toString(): string;

  /**
   * Returns a string containing a number represented either in exponential or
   * fixed-point notation with a specified number of digits.
   *
   * @param precision Number of significant digits. There is no range limit on this number.
   * @param roundingMode The rounding mode to use when representing the value. Defaults to "half-up".
   */
  toPrecision(precision: number, roundingMode?: BigDecimalRoundingMode): string;

  /**
   * Returns a string representing a number in fixed-point notation.
   *
   * @param fractionDigits Number of digits after the decimal point. There is no range limit on this number.
   * @param roundingMode The rounding mode to use when representing the value. Defaults to "half-up".
   */
  toFixed(
    fractionDigits: number,
    roundingMode?: BigDecimalRoundingMode
  ): string;

  /**
   * Returns a string containing a number represented in exponential notation.
   *
   * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   * @param roundingMode The rounding mode to use when representing the value. Defaults to "half-up".
   */
  toExponential(
    fractionDigits: number,
    roundingMode?: BigDecimalRoundingMode
  ): string;
}

// Note that BigFloat and BigDecimal have custom operator overloads defined in
// QuickJS, but TypeScript does not support operator overloading. As such,
// TypeScript will not understand or handle unary/binary operators for BigFloat
// and BigDecimal properly.

/** npm: @suchipi/print@2.5.0. License: ISC */
/* (with some QuickJS-specific modifications) */

/*
Copyright (c) 2016-2022, John Gardner
Copyright (c) 2022 Lily Skye

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

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

  /**
   * A symbol which can be used to customize how an object gets printed.
   */
  custom: symbol;
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

declare interface InspectCustomInputs {
  key: string | symbol;
  type: string;
  brackets: [string, string];
  oneLine: boolean;
  linesBefore: Array<string>;
  linesAfter: Array<string>;
  propLines: Array<string>;
  readonly tooDeep: boolean;
  indent: string;
  typeSuffix: string;
  opts: InspectOptions;
  colours: { [Key in keyof Required<InspectColours>]: string };
}

declare type Interval = { [Symbol.toStringTag]: "Interval" };

declare function setInterval(func: (...args: any) => any, ms: number): Interval;
declare function clearInterval(interval: Interval): void;

// Definitions of the globals and modules added by quickjs-libc

/**
 * Provides the command line arguments. The first argument is the script name.
 */
declare var scriptArgs: Array<string>;

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
   * Write this file into `target`, using a memory buffer of size `bufferSize`.
   *
   * If `limit` is specified, only that amount of bytes will be read and
   * written. Otherwise, data is read and written until this file reaches EOF.
   *
   * A `limit` of 0 is treated the same as not specifying a limit.
   *
   * Internally, this function uses libc `fread` and `fwrite` in a loop.
   *
   * Returns the number of bytes read and written.
   */
  writeTo(target: FILE, bufferSize: number, limit?: number): number;

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

  /**
   * Set the buffering mode and buffer size for the file stream (wrapper to the libc `setvbuf()`).
   *
   * Note that unlike the libc setvbuf, the "buffer" argument is not supported, and therefore is not present.
   *
   * @param mode The buffering mode to use. It can be one of the following values: `std._IOFBF` for full buffering, `std._IOLBF` for line buffering, or `std._IONBF` for no buffering.
   * @param size The size to resize the internal in-memory buffer for this file to.
   */
  setvbuf(mode: number, size: number): void;
}

declare module "quickjs:std" {
  /**
   * Set the exit code that the process should exit with in the future, if it
   * exits normally.
   *
   * Can only be called from the main thread.
   *
   * This exit code will only be used if the process exits "normally", ie, when
   * there are no more pending JS tasks/listeners. If an unhandled exception is
   * thrown, the process will always exit with status `1`, regardless of the
   * status code passed to `setExitCode`. If someone calls {@link exit} and
   * passes in a status code, that status code will take precedence over the
   * status code passed to `setExitCode`.
   *
   * @param statusCode The future exit code; 0 for success, nonzero for failure.
   */
  export function setExitCode(statusCode: number): void;

  /**
   * Return the exit code that was previously set by {@link setExitCode}, or 0 if
   * it hasn't yet been set.
   *
   * Can only be called from the main thread.
   */
  export function getExitCode(): number;

  /**
   * Exit the process with the provided status code.
   *
   * Can only be called from the main thread.
   *
   * If `statusCode` is not provided, a value previously passed into
   * {@link setExitCode} will be used. If no value was previously passed into
   * setExitCode, `0` will be used.
   *
   * @param statusCode The exit code; 0 for success, nonzero for failure.
   */
  export function exit(statusCode?: number): never;

  /**
   * Load the file `filename` and return it as a string assuming UTF-8 encoding.
   *
   * @param filename - The relative or absolute path to the file to load. Relative paths are resolved relative to the process's current working directory.
   */
  export function loadFile(filename: string): string;

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

  /** Constant for {@link FILE.setvbuf}. Declares that the buffer mode should be 'full buffering'. */
  export var _IOFBF: number;

  /** Constant for {@link FILE.setvbuf}. Declares that the buffer mode should be 'line buffering'. */
  export var _IOLBF: number;

  /** Constant for {@link FILE.setvbuf}. Declares that the buffer mode should be 'no buffering'. */
  export var _IONBF: number;

  /** Return the value of the environment variable `name` or `undefined` if it is not defined. */
  export function getenv(name: string): string | undefined;

  /** Set the value of the environment variable `name` to the string `value`. */
  export function setenv(name: string, value: string): void;

  /** Delete the environment variable `name`. */
  export function unsetenv(name: string): void;

  /** Return an object containing the environment variables as key-value pairs. */
  export function getenviron(): { [key: string]: string | undefined };

  /**
   * Return the real user ID of the calling process.
   *
   * This function throws an error on windows, because windows doesn't support
   * the same uid/gid paradigm as Unix-like operating systems.
   */
  export function getuid(): number;

  /**
   * Return the effective user ID of the calling process.
   *
   * This function throws an error on windows, because windows doesn't support
   * the same uid/gid paradigm as Unix-like operating systems.
   */
  export function geteuid(): number;

  /**
   * Return the real group ID of the calling process.
   *
   * This function throws an error on windows, because windows doesn't support
   * the same uid/gid paradigm as Unix-like operating systems.
   */
  export function getgid(): number;

  /**
   * Return the effective group ID of the calling process.
   *
   * This function throws an error on windows, because windows doesn't support
   * the same uid/gid paradigm as Unix-like operating systems.
   */
  export function getegid(): number;

  /** The type of the object returned by {@link getpwuid}. */
  export interface PasswdEntry {
    name: string;
    passwd: string;
    uid: number;
    gid: number;
    gecos: string;
    dir: string;
    shell: string;
  }

  /**
   * Get information from the passwd file entry for the specified user id.
   *
   * See https://linux.die.net/man/3/getpwuid.
   *
   * This function throws an error on windows, because windows doesn't support
   * the same uid/gid paradigm as Unix-like operating systems.
   */
  export function getpwuid(id: number): PasswdEntry;

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

  /**
   * A wrapper around the standard C [strftime](https://en.cppreference.com/w/c/chrono/strftime).
   * Formats a time/date into a format as specified by the user.
   *
   * @param maxBytes - The number of bytes to allocate for the string that will be returned
   * @param format - Format string, using `%`-prefixed sequences as found in [this table](https://en.cppreference.com/w/c/chrono/strftime#Format_string).
   * @param time - The Date object (or unix timestamp, in ms) to render.
   */
  export function strftime(
    maxBytes: number,
    format: string,
    time: Date | number
  ): string;
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

  /**
   * Windows-specific open flag: open the file in binary mode (which is the default). Used in {@link open}.
   *
   * NOTE: this property is only present on windows
   */
  export var O_BINARY: number | undefined;

  /**
   * Windows-specific open flag: open the file in text mode. The default is binary mode. Used in {@link open}.
   *
   * NOTE: this property is only present on windows
   */
  export var O_TEXT: number | undefined;

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

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Mask for getting type of file from mode.
   */
  export var S_IFMT: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * File type: named pipe (fifo)
   */
  export var S_IFIFO: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * File type: character special
   */
  export var S_IFCHR: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * File type: directory
   */
  export var S_IFDIR: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * File type: block special
   */
  export var S_IFBLK: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * File type: regular
   */
  export var S_IFREG: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * File type: socket
   *
   * NOTE: this property is not present on windows
   */
  export var S_IFSOCK: number | undefined;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * File type: symbolic link
   *
   * NOTE: this property is not present on windows
   */
  export var S_IFLNK: number | undefined;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Flag: set group id on execution
   *
   * NOTE: this property is not present on windows
   */
  export var S_ISGID: number | undefined;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Flag: set user id on execution
   *
   * NOTE: this property is not present on windows
   */
  export var S_ISUID: number | undefined;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Mask for getting RWX permissions for owner
   */
  export var S_IRWXU: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: read for owner
   */
  export var S_IRUSR: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: write for owner
   */
  export var S_IWUSR: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: execute for owner
   */
  export var S_IXUSR: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Mask for getting RWX permissions for group
   */
  export var S_IRWXG: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: read for group
   */
  export var S_IRGRP: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: write for group
   */
  export var S_IWGRP: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: execute for group
   */
  export var S_IXGRP: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Mask for getting RWX permissions for others
   */
  export var S_IRWXO: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: read for others
   */
  export var S_IROTH: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: write for others
   */
  export var S_IWOTH: number;

  /**
   * Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.
   *
   * Permission: execute for others
   */
  export var S_IXOTH: number;

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

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGQUIT: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGPIPE: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGALRM: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGUSR1: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGUSR2: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGCHLD: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGCONT: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGSTOP: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGTSTP: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGTTIN: number | undefined;

  /** POSIX signal number. NOTE: this signal is not present on windows. */
  export var SIGTTOU: number | undefined;

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
  export function pipe(): [number, number];

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

declare var setTimeout: typeof import("quickjs:os").setTimeout;
declare var clearTimeout: typeof import("quickjs:os").clearTimeout;

/**
 * An object which lets you configure the module loader (import/export/require).
 * You can change these properties to add support for importing new filetypes.
 */
interface ModuleDelegate {
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
   * to add to {@link compilers}.
   */
  searchExtensions: Array<string>;

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
   * ModuleDelegate.compilers[".txt"] = (filename, content) => {
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
   * {@link searchExtensions}.
   */
  compilers: {
    [extensionWithDot: string]: (filename: string, content: string) => string;
  };

  /**
   * An Array containing the names of all the built-in modules, such as
   * "quickjs:std", "quickjs:bytecode", etc.
   *
   * `quickjs:engine`'s `defineBuiltinModule` function adds to the end of this
   * array.
   */
  builtinModuleNames: Array<string>;

  /**
   * Resolves a require/import request from `fromFile` into a canonicalized
   * path.
   *
   * To change native module resolution behavior, replace this function with
   * your own implementation. Note that you must handle
   * `ModuleDelegate.searchExtensions` yourself in your replacement
   * implementation.
   */
  resolve(name: string, fromFile: string): string;

  /**
   * Reads the contents of the given resolved module name into a string.
   *
   * To change native module loading behavior, replace this function with your
   * own implementation. Note that you must handle `ModuleDelegate.compilers`
   * yourself in your replacement implementation.
   */
  read(modulePath: string): string;
}

interface RequireFunction {
  /**
   * Synchronously import a module.
   *
   * `source` will be resolved relative to the calling file.
   *
   * If `source` does not have a file extension, and a file without an extension
   * cannot be found, the engine will check for files with the extensions in
   * {@link ModuleDelegate.searchExtensions}, and use one of those if present.
   * This behavior also happens when using normal `import` statements.
   *
   * For example, if you write:
   *
   * ```js
   * import something from "./somewhere";
   * ```
   *
   * but there's no file named `somewhere` in the same directory as the file
   * where that import appears, and `ModuleDelegate.searchExtensions` is the
   * default value:
   *
   * ```js
   * [".js"]
   * ```
   *
   * then the engine will look for `somewhere.js`. If that doesn't exist, the
   * engine will look for `somewhere/index.js`. If *that* doesn't exist, an
   * error will be thrown.
   *
   * If you add more extensions to `ModuleDelegate.searchExtensions`, then the
   * engine will use those, too. It will search in the same order as the strings
   * appear in the `ModuleDelegate.searchExtensions` array.
   */
  (source: string): any;

  /**
   * Resolves the normalized path to a modules, relative to the calling file.
   */
  resolve: (source: string) => string;
}

// global added by QJMS_InitContext
declare var require: RequireFunction;

// gets set per-module by QJMS_SetModuleImportMeta
interface ImportMeta {
  /**
   * A URL representing the current module.
   *
   * Usually starts with `file://`.
   */
  url: string;

  /**
   * Whether the current module is the "main" module, meaning that it is the
   * entrypoint file that's been loaded, or, in other terms, the first
   * user-authored module that's been loaded.
   */
  main: boolean;

  /**
   * Equivalent to `globalThis.require`. Provided for compatibility with tools
   * that can leverage a CommonJS require function via `import.meta.require`.
   */
  require: RequireFunction;

  /**
   * Resolves a module specifier based on the current module's path.
   *
   * Equivalent to `globalThis.require.resolve`.
   *
   * Behaves similarly to [the browser
   * import.meta.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve),
   * but it does not ensure that the returned string is a valid URL, because it
   * delegates directly to {@link ModuleDelegate.resolve} to resolve the name.
   * If you want this to return URL strings, change `ModuleDelegate.resolve` and
   * `ModuleDelegate.read` to work with URL strings.
   */
  resolve: RequireFunction["resolve"];
}

declare module "quickjs:engine" {
  /**
   * Return whether the provided resolved module path is set as the main module.
   *
   * In other words, return what the value of `import.meta.main` would be within
   * the module.
   *
   * The main module can be set via {@link setMainModule}.
   */
  export function isMainModule(resolvedFilepath: string): boolean;

  /**
   * Set the main module to the module with the provided resolved path.
   *
   * This will affect the value of `import.meta.main` for modules loaded in the
   * future, but it will NOT retroactively change the value of
   * `import.meta.main` in existing already-loaded modules.
   */
  export function setMainModule(resolvedFilepath: string): void;

  /**
   * Evaluate the string `code` as a script (global eval).
   *
   * @param code - The code to evaluate.
   * @param options - An optional object containing the following optional properties:
   * @property backtraceBarrier - Boolean (default = false). If true, error backtraces do not list the stack frames below the evalScript.
   * @property filename - String (default = "<evalScript>"). The filename to associate with the code being executed.
   * @returns The result of the evaluation.
   */
  export function evalScript(
    code: string,
    options?: { backtraceBarrier?: boolean; filename?: string }
  ): any;

  /**
   * Evaluate the file `filename` as a script (global eval).
   *
   * @param filename - The relative or absolute path to the file to load. Relative paths are resolved relative to the process's current working directory.
   * @returns The result of the evaluation.
   */
  export function runScript(filename: string): any;

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
   * Read the script of module filename from an active stack frame, then return it as a string.
   *
   * If there isn't a valid filename for the specified stack frame, an error will be thrown.
   *
   * @param stackLevels - How many levels up the stack to search for a filename. Defaults to 0, which uses the current stack frame.
   */
  export function getFileNameFromStack(stackLevels?: number): string;

  /**
   * Returns true if `target` is a module namespace object.
   */
  export function isModuleNamespace(target: any): boolean;

  /**
   * Create a virtual built-in module whose exports consist of the own
   * enumerable properties of `obj`.
   */
  export function defineBuiltinModule(
    name: string,
    obj: { [key: string]: any }
  ): void;

  /**
   * An object which lets you configure the module loader (import/export/require).
   * You can change these properties to add support for importing new filetypes.
   */
  export const ModuleDelegate: ModuleDelegate;

  /**
   * Manually invoke the cycle removal algorithm (garbage collector).
   *
   * The cycle removal algorithm is automatically started when needed, so this
   * function is useful in case of specific memory constraints or for testing.
   */
  export function gc(): void;
}

declare module "quickjs:bytecode" {
  /**
   * Convert the module or script in the specified file into bytecode.
   *
   * When converted back to a value, it will be a function.
   */
  export function fromFile(
    path: string,
    options?: {
      byteSwap?: boolean;
      sourceType?: "module" | "script";
      encodedFileName?: string;
    }
  ): ArrayBuffer;

  /**
   * Convert the provided value into bytecode. Doesn't work with all values.
   */
  export function fromValue(
    value: any,
    options?: { byteSwap?: boolean }
  ): ArrayBuffer;

  /**
   * Convert the provided bytecode into a value.
   */
  export function toValue(bytecode: ArrayBuffer): any;
}

declare module "quickjs:context" {
  /**
   * A separate global context (or 'realm') within which code can be executed.
   */
  export class Context {
    /**
     * Create a new global context (or 'realm') within code can be executed.
     *
     * @param options Options for what globals/modules/etc to make available within the context.
     *
     * The following globals are always present, regardless of options:
     *
     * - Object
     * - Function
     * - Error
     * - EvalError
     * - RangeError
     * - ReferenceError
     * - SyntaxError
     * - TypeError
     * - URIError
     * - InternalError
     * - AggregateError
     * - Array
     * - parseInt
     * - parseFloat
     * - isNaN
     * - isFinite
     * - decodeURI
     * - decodeURIComponent
     * - encodeURI
     * - encodeURIComponent
     * - escape
     * - unescape
     * - Infinity
     * - NaN
     * - undefined
     * - __date_clock
     * - Number
     * - Boolean
     * - String
     * - Math
     * - Reflect
     * - Symbol
     * - eval (but it doesn't work unless the `eval` option is enabled)
     * - globalThis
     *
     * Note that new contexts don't have a `scriptArgs` global. If you need one
     * to be present in the new context, you can add one onto the Context's
     * `globalThis` property.
     */
    constructor(options?: {
      /** Enables `Date`. Defaults to `true` */
      date?: boolean;

      /** Enables `eval`. Defaults to `true` */
      eval?: boolean;

      /** Enables `String.prototype.normalize`. Defaults to `true`. */
      stringNormalize?: boolean;

      /** Enables `RegExp`. Defaults to `true`. */
      regExp?: boolean;

      /** Enables `JSON`. Defaults to `true`. */
      json?: boolean;

      /** Enables `Proxy`. Defaults to `true`. */
      proxy?: boolean;

      /** Enables `Map` and `Set`. Defaults to `true`. */
      mapSet?: boolean;

      /**
       * Enables:
       *
       * - ArrayBuffer
       * - SharedArrayBuffer
       * - Uint8ClampedArray
       * - Int8Array
       * - Uint8Array
       * - Int16Array
       * - Uint16Array
       * - Int32Array
       * - Uint32Array
       * - BigInt64Array
       * - BigUint64Array
       * - Float32Array
       * - Float64Array
       * - DataView
       *
       * Defaults to `true`.
       */
      typedArrays?: boolean;

      /**
       * Enables:
       *
       * - Promise
       * - async functions
       * - async iterators
       * - async generators
       *
       * Defaults to `true`.
       */
      promise?: boolean;

      /** Enables `BigInt`. Defaults to `true`. */
      bigint?: boolean;

      /** Enables `BigFloat`. Defaults to `true`. */
      bigfloat?: boolean;

      /** Enables `BigDecimal`. Defaults to `true`. */
      bigdecimal?: boolean;

      /**
       * Enables:
       *
       * - Operators
       * - OperatorSet creation
       * - operator overloading
       *
       * Defaults to `true`.
       */
      operators?: boolean;

      /** Enables `"use math"`. Defaults to `true`. */
      useMath?: boolean;

      /** Enables `inspect`. Defaults to `true`. */
      inspect?: boolean;
      /** Enables `console`. Defaults to `true`. */
      console?: boolean;
      /** Enables `print`. Defaults to `true`. */
      print?: boolean;
      /** Enables `require`. Defaults to `true`. */
      moduleGlobals?: boolean;
      /**
       * Enables `setTimeout`, `clearTimeout`, `setInterval`, and
       * `clearInterval`. Defaults to `true`.
       */
      timers?: boolean;

      /** Enable builtin modules. */
      modules?: {
        /** Enables the "quickjs:std" module. Defaults to `true`. */
        "quickjs:std"?: boolean;
        /** Enables the "quickjs:os" module. Defaults to `true`. */
        "quickjs:os"?: boolean;
        /** Enables the "quickjs:bytecode" module. Defaults to `true`. */
        "quickjs:bytecode"?: boolean;
        /** Enables the "quickjs:context" module. Defaults to `true`. */
        "quickjs:context"?: boolean;
        /** Enables the "quickjs:engine" module. Defaults to `true`. */
        "quickjs:engine"?: boolean;
        /** Enables the "quickjs:encoding" module. Defaults to `true`. */
        "quickjs:encoding"?: boolean;
      };
    });

    /**
     * The `globalThis` object used by this context.
     *
     * You can add to or remove from it to change what is visible to the context.
     */
    globalThis: typeof globalThis;

    /**
     * Runs code within the context and returns the result.
     *
     * @param code The code to run.
     */
    eval(code: string): any;
  }
}

// WHATWG encoding spec at https://encoding.spec.whatwg.org/ would be better,
// but this is better than nothing
declare module "quickjs:encoding" {
  export function toUtf8(input: ArrayBuffer): string;
  export function fromUtf8(input: string): ArrayBuffer;
}

declare const std: typeof import("quickjs:std");
declare const os: typeof import("quickjs:os");

// undocumented from quickjs, but it's there
/** Get the current unix timestamp with microsecond precision. */
declare function __date_clock(): number;
