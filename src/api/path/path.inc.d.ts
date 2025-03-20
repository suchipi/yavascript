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
   * this Path. In other words:
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
   * Create a new Path by appending additional path segments onto the end of
   * this Path's segments.
   *
   * The returned path will use this path's separator.
   */
  concat(...other: Array<string | Path | Array<string | Path>>): Path;

  /**
   * Return whether this path is absolute; that is, whether it starts with
   * either `/`, `\`, or a drive letter (ie `C:`).
   */
  isAbsolute(): boolean;

  /**
   * Make a second Path object containing the same segments and separator as
   * this one.
   *
   * Note that although it contains the same segments, the new Path does not use
   * the same Array instance for segments as this one.
   */
  clone(): this;

  /**
   * Express this path relative to `dir`.
   *
   * @param dir - The directory to create a new path relative to.
   * @param options - Options that affect the resulting path.
   */
  relativeTo(
    dir: Path | string,
    options?: {
      /**
       * Defaults to false. When true, a leading `./` will be omitted from the
       * path, if present. Note that a leading `../` will never be omitted.
       */
      noLeadingDot?: boolean;
    }
  ): Path;

  /**
   * Turn this path into a string by joining its segments using its separator.
   */
  toString(): string;

  /**
   * Alias for `toString`; causes Path objects to be serialized as strings when
   * they (or an object referencing them) are passed into JSON.stringify.
   */
  toJSON(): string;

  /**
   * Return the final path segment of this path. If this path has no path
   * segments, the empty string is returned.
   */
  basename(): string;

  /**
   * Return the trailing extension of this path. The `options` parameter works
   * the same as the global `extname`'s `options` parameter.
   */
  extname(options?: { full?: boolean }): string;

  /**
   * Return a new Path containing all of the path segments in this one except
   * for the last one; ie. the path to the directory that contains this path.
   */
  dirname(): Path;

  /**
   * Return whether this path starts with the provided value, by comparing one
   * path segment at a time.
   *
   * The starting segments of this path must *exactly* match the segments in the
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
   * Return whether this path ends with the provided value, by comparing one
   * path segment at a time.
   *
   * The ending segments of this path must *exactly* match the segments in the
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
   * Return the path segment index at which `value` appears in this path, or
   * `-1` if it doesn't appear in this path.
   *
   * @param value - The value to search for. If the value contains more than one path segment, the returned index will refer to the location of the value's first path segment.
   * @param fromIndex - The index into this path's segments to begin searching at. Defaults to `0`.
   */
  indexOf(
    value: string | Path | Array<string | Path>,
    fromIndex?: number | undefined
  ): number;

  /**
   * Return whether `value` appears in this path.
   *
   * @param value - The value to search for.
   * @param fromIndex - The index into this path's segments to begin searching at. Defaults to `0`.
   */
  includes(
    value: string | Path | Array<string | Path>,
    fromIndex?: number | undefined
  ): boolean;

  /**
   * Return a new Path wherein the segments in `value` have been replaced with
   * the segments in `replacement`. If the segments in `value` are not present
   * in this path, a clone of this path is returned.
   *
   * Note that only the first match is replaced.
   *
   * @param value - What should be replaced
   * @param replacement - What it should be replaced with
   */
  replace(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>
  ): Path;

  /**
   * Return a new Path wherein all occurrences of the segments in `value` have
   * been replaced with the segments in `replacement`. If the segments in
   * `value` are not present in this path, a clone of this path is returned.
   *
   * @param value - What should be replaced
   * @param replacement - What it should be replaced with
   */
  replaceAll(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>
  ): Path;

  /**
   * Return a copy of this path but with the final segment replaced with `replacement`
   *
   * @param replacement - The new final segment(s) for the returned Path
   */
  replaceLast(replacement: string | Path | Array<string | Path>): Path;
}
