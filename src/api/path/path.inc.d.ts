/** An object that represents a filesystem path. */
declare class Path {
  /** The character used to separate path segments on this OS. */
  static readonly OS_SEGMENT_SEPARATOR: "/" | "\\";

  /**
   * The character used to separate entries within the PATH environment
   * variable on this OS.
   */
  static readonly OS_ENV_VAR_SEPARATOR: ":" | ";";

  /**
   * A list of suffixes that could appear in the filename for a program on the
   * current OS. For instance, on Windows, programs often end with ".exe".
   *
   * On Unix-like OSes, this is empty, On Windows, it's based on `env.PATHEXT`.
   */
  static readonly OS_PROGRAM_EXTENSIONS: ReadonlySet<string>;

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
  static join(...inputs: Array<string | Path | Array<string | Path>>): Path;

  /**
   * Turns the input path(s) into an absolute path by resolving all `.` and `..`
   * segments, using `pwd()` as a base dir to use when resolving leading `.` or
   * `..` segments.
   */
  static resolve(...inputs: Array<string | Path | Array<string | Path>>): Path;

  /**
   * Concatenates the input path(s) and then resolves all non-leading `.` and
   * `..` segments.
   */
  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): Path;

  /**
   * Return whether the provided path is absolute; that is, whether it
   * starts with either `/` or a drive letter (ie `C:`).
   */
  static isAbsolute(path: string | Path): boolean;

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
   * Create an absolute path by `concat`ting `subpaths` onto this Path (which is
   * presumed to be an absolute path) and then using `normalize()` on the
   * result. If the result is not an absolute path, an error will be thrown.
   */
  resolve(...subpaths: Array<string | Path>): Path;

  /**
   * Resolve all non-leading `.` and `..` segments in this path.
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
}
