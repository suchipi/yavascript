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
   * On Unix-like OSes, this is empty. On Windows, it's based on `env.PATHEXT`.
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

  /**
   * Create a new Path object using the provided segments and separator.
   *
   * If unspecified, `separator` defaults to `Path.OS_SEGMENT_SEPARATOR`.
   */
  static fromRaw(segments: Array<string>, separator?: string): Path;

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
