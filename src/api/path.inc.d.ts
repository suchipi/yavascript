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
