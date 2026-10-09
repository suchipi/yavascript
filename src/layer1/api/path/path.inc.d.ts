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
 *
 * **Example**
 * ```ts
 * const projectDir = new Path("/home/suchipi", "Code/my-project");
 * const readme = projectDir.concat("README.md");
 * console.log(readme.toString(), readme.segments, readme.separator);
 * ```
 */
declare class Path {
  /**
   * The character used to separate path segments on the current operating
   * system where yavascript is running.
   *
   * Its value is either a forward slash (`"/"`) or a backslash (`"\"`). Its value
   * is a backslash on windows, and a forward slash on all other operating
   * systems.
   *
   * **Example**
   * ```ts
   * console.log(Path.OS_SEGMENT_SEPARATOR);
   * ```
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
   * const entries: Array<string> = env.PATH.split(Path.OS_ENV_VAR_SEPARATOR);
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
   *
   * **Example**
   * ```ts
   * const extensions = Array.from(Path.OS_PROGRAM_EXTENSIONS);
   * console.log(extensions);
   * ```
   */
  static readonly OS_PROGRAM_EXTENSIONS: ReadonlySet<string>;

  /**
   * Returns a boolean indicating whether `other` is a Path instance.
   *
   * @param other - Any value
   *
   * **Example**
   * ```ts
   * function countSegments(input: string | Path) {
   *   return Path.isPath(input) ? input.segments.length : -1;
   * }
   * console.log(countSegments(pwd()), countSegments("README.md"));
   * ```
   */
  static isPath(other: unknown): other is Path;

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
   *
   * **Example**
   * ```ts
   * console.log(Path.detectSeparator("C:\\Users\\suchipi")); // "\"
   * console.log(Path.detectSeparator("README.md", "/")); // "/"
   * ```
   */
  static detectSeparator<Fallback extends string | null = string>(
    input: Array<string> | string,
    // @ts-ignore might be instantiated with a different subtype
    fallback: Fallback = Path.OS_SEGMENT_SEPARATOR,
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
   *
   * **Example**
   * ```ts
   * const path = Path.normalize("/home/suchipi", "./Code/../Downloads");
   * console.log(path.toString()); // "/home/suchipi/Downloads"
   * ```
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
   *
   * **Example**
   * ```ts
   * console.log(Path.isAbsolute("/usr/bin")); // true
   * console.log(Path.isAbsolute("./src/index.ts")); // false
   * ```
   */
  static isAbsolute(path: string | Path): boolean;

  /**
   * Creates a new Path containing the user-provided segments and separator. In
   * most cases, you won't need to do this, and can use `new Path(...)` instead.
   *
   * If unspecified, the `separator` parameter defaults to
   * `Path.OS_SEGMENT_SEPARATOR`.
   *
   * **Example**
   * ```ts
   * const path = Path.fromRaw(["", "usr", "bin"], "/");
   * console.log(path.toString()); // "/usr/bin"
   * ```
   */
  static fromRaw(segments: Array<string>, separator?: string): Path;

  /**
   * Creates a new Path object using the provided input(s), which will be
   * concatenated together in order left-to-right.
   *
   * **Example**
   * ```ts
   * const path = new Path("/usr", "local/bin", ["node"]);
   * console.log(path.toString()); // "/usr/local/bin/node"
   * ```
   */
  constructor(...inputs: Array<string | Path | Array<string | Path>>);

  /**
   * An array of the path segments that make up this path.
   *
   * For `/tmp/foo.txt`, it'd be `["", "tmp", "foo.txt"]`.
   *
   * For `C:\something\somewhere.txt`, it'd be `["C:", "something", "somewhere.txt"]`.
   *
   * **Example**
   * ```ts
   * const path = new Path("/tmp/foo.txt");
   * console.log(path.segments); // ["", "tmp", "foo.txt"]
   * ```
   */
  segments: Array<string>;

  /**
   * The path separator that should be used to turn this path into a string.
   *
   * Will be either `"/"` or `"\"`.
   *
   * **Example**
   * ```ts
   * const path = new Path("C:\\Users\\suchipi");
   * console.log(path.separator); // "\"
   * ```
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
   *
   * **Example**
   * ```ts
   * const path = new Path("/home/suchipi/./Code/../Downloads");
   * console.log(path.normalize().toString()); // "/home/suchipi/Downloads"
   * ```
   */
  normalize(): Path;

  /**
   * Creates a new Path by appending additional path segments onto the end of
   * the target Path's segments.
   *
   * The returned Path will use the same separator as the target Path.
   *
   * **Example**
   * ```ts
   * const srcDir = new Path("/home/suchipi/my-project/src");
   * const indexFile = srcDir.concat("lib", "index.ts");
   * console.log(indexFile.toString()); // "/home/suchipi/my-project/src/lib/index.ts"
   * ```
   */
  concat(...other: Array<string | Path | Array<string | Path>>): Path;

  /**
   * Returns a boolean indicating whether the target Path is absolute; that
   * is, whether it starts with either a slash (`/` or `\`) or a drive letter
   * (ie `C:`).
   *
   * Note that Windows UNC Paths (eg. `\\MYSERVER\share$\`) are considered
   * absolute.
   *
   * **Example**
   * ```ts
   * let path = new Path("./src/index.ts");
   * if (!path.isAbsolute()) {
   *   path = pwd().concat(path).normalize();
   * }
   * console.log(path);
   * ```
   */
  isAbsolute(): boolean;

  /**
   * Creates a new Path object containing the same segments and separator as
   * the target Path.
   *
   * Note that although it contains the same segments, the new Path does not use
   * the same Array instance for segments as the target Path it was cloned from.
   *
   * **Example**
   * ```ts
   * const original = new Path("/usr/bin");
   * const cloned = original.clone();
   * cloned.segments.push("node");
   * console.log(original.toString(), cloned.toString()); // "/usr/bin", "/usr/bin/node"
   * ```
   */
  clone(): this;

  /**
   * Creates a new Path which expresses the target Path relative to `dir`.
   *
   * @param dir - The directory to create a new path relative to.
   * @param options - Options that affect the resulting path (see {@link PathRelativeToOptions}).
   *
   * **Example**
   * ```ts
   * const file = new Path("/home/suchipi/my-project/src/index.ts");
   * const relative = file.relativeTo("/home/suchipi/my-project");
   * console.log(relative.toString()); // "./src/index.ts"
   * ```
   */
  relativeTo(dir: Path | string, options?: PathRelativeToOptions): Path;

  /**
   * Turns the target Path into a string by joining its segments using its
   * separator as the delimiter.
   *
   * **Example**
   * ```ts
   * const path = new Path("/usr", "bin");
   * console.log("Installing to " + path.toString());
   * ```
   */
  toString(): string;

  /**
   * Alias for `toString`. The presence of this method causes Path objects to be
   * serialized as strings when they (or an object referencing them) get(s) passed
   * into JSON.stringify.
   *
   * **Example**
   * ```ts
   * const config = { outDir: new Path("/home/suchipi/my-project/dist") };
   * console.log(JSON.stringify(config)); // "{\"outDir\":\"/home/suchipi/my-project/dist\"}"
   * ```
   */
  toJSON(): string;

  /**
   * Returns the final segment of the target Path. If the target Path has no
   * segments, an empty string (`""`) is returned.
   *
   * **Example**
   * ```ts
   * const path = new Path("/home/suchipi/notes.txt");
   * console.log(path.basename()); // "notes.txt"
   * ```
   */
  basename(): string;

  /**
   * Returns the trailing file extension of this path.
   *
   * @param options - Works the same as the options parameter for the global {@link extname} (see {@link ExtnameOptions}).
   *
   * **Example**
   * ```ts
   * const path = new Path("src/types.d.ts");
   * console.log(path.extname(), path.extname({ full: true })); // ".ts", ".d.ts"
   * ```
   */
  extname(options?: ExtnameOptions): string;

  /**
   * Creates a new Path containing all of the segments in the target Path except
   * for the last one; ie. the path to the directory that contains the target Path.
   *
   * **Example**
   * ```ts
   * const path = new Path("/home/suchipi/notes.txt");
   * console.log(path.dirname().toString()); // "/home/suchipi"
   * ```
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
   *
   * **Example**
   * ```ts
   * const path = new Path("/home/user/.config/app.toml");
   * console.log(path.startsWith("/home/user")); // true
   * ```
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
   *
   * **Example**
   * ```ts
   * const path = new Path("/home/user/.config/app.toml");
   * console.log(path.endsWith(".config/app.toml")); // true
   * ```
   */
  endsWith(value: string | Path | Array<string | Path>): boolean;

  /**
   * Returns the index at which `value` appears in the target Path's segments,
   * or `-1` if `value` doesn't appear in the target Path.
   *
   * @param value - The value to search for. If the value contains more than one path segment, the returned index will refer to the location of the value's first path segment.
   * @param fromIndex - The index into the target Path's segments to begin searching at. Defaults to `0`.
   *
   * **Example**
   * ```ts
   * const path = new Path("/home/user/my-project/node_modules/kleur");
   * console.log(path.indexOf("node_modules")); // 4
   * ```
   */
  indexOf(
    value: string | Path | Array<string | Path>,
    fromIndex?: number | undefined,
  ): number;

  /**
   * Returns a boolean indicating whether `value` appears in the target Path.
   *
   * @param value - The value to search for.
   * @param fromIndex - The index into the target Path's segments to begin searching at. Defaults to `0`.
   *
   * **Example**
   * ```ts
   * const path = new Path("/home/user/my-project/node_modules/kleur");
   * if (path.includes("node_modules")) {
   *   console.log("This file belongs to a dependency");
   * }
   * ```
   */
  includes(
    value: string | Path | Array<string | Path>,
    fromIndex?: number | undefined,
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
   *
   * **Example**
   * ```ts
   * const source = new Path("/my-project/src/utils/math.ts");
   * const output = source.replace("src", "dist");
   * console.log(output.toString()); // "/my-project/dist/utils/math.ts"
   * ```
   */
  replace(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>,
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
   *
   * **Example**
   * ```ts
   * const path = new Path("/a/tmp/b/tmp/c");
   * console.log(path.replaceAll("tmp", "temp").toString()); // "/a/temp/b/temp/c"
   * ```
   */
  replaceAll(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>,
  ): Path;

  /**
   * Creates a new Path based on the target Path but with the final segment
   * replaced with `replacement`.
   *
   * If the target Path has no segments, the newly created Path will be the same
   * as `new Path(replacement)`; ie. non-empty.
   *
   * @param replacement - The new final segment(s) for the returned Path
   *
   * **Example**
   * ```ts
   * const source = new Path("/my-project/src/index.ts");
   * const compiled = source.replaceLast("blah.js");
   * console.log(compiled.toString()); // "/my-project/src/blah.js"
   * ```
   */
  replaceLast(replacement: string | Path | Array<string | Path>): Path;

  /**
   * Return a boolean indicating whether this Path has the same separator and
   * segments as another Path.
   *
   * To check only segments and not separator, use {@link Path.prototype.hasEqualSegments}.
   *
   * **Example**
   * ```ts
   * const binDir = new Path("/usr/bin");
   * console.log(binDir.equals("/usr/bin")); // true
   * console.log(binDir.equals("/usr/local/bin")); // false
   * ```
   */
  equals(other: string | Path | Array<string | Path>): boolean;

  /**
   * Return a boolean indicating whether this Path has the same segments as
   * another Path. **Separator is not checked; use {@link Path.prototype.equals} for that.**
   *
   * **Example**
   * ```ts
   * const posixPath = new Path("src/index.ts");
   * const win32Path = new Path("src\\index.ts");
   * console.log(posixPath.hasEqualSegments(win32Path)); // false
   * ```
   */
  hasEqualSegments(other: string | Path | Array<string | Path>): boolean;
}

/**
 * Options for {@link Path.prototype.relativeTo}.
 *
 * **Example**
 * ```ts
 * const options: PathRelativeToOptions = { noLeadingDot: true };
 * const file = new Path("/my-project/src/index.ts");
 * console.log(file.relativeTo("/my-project", options).toString()); // "src/index.ts"
 * ```
 */
declare interface PathRelativeToOptions {
  /**
   * Defaults to false. When true, a leading `./` will be omitted from the
   * path, if present. Note that a leading `../` will never be omitted.
   *
   * **Example**
   * ```ts
   * const file = new Path("/my-project/src/index.ts");
   * const relative = file.relativeTo("/my-project", { noLeadingDot: true });
   * console.log(relative.toString()); // "src/index.ts"
   * ```
   */
  noLeadingDot?: boolean;
}

/**
 * Errors which can be thrown by {@link Path}'s methods/constructor.
 *
 * **Example**
 * ```ts
 * try {
 *   Path.normalize("/home/../..");
 * } catch (error) {
 *   if (error instanceof PathErrors.NormalizeGoingOutsideRootError) {
 *     console.error("That path goes above the filesystem root");
 *   }
 * }
 * ```
 */
declare namespace PathErrors {
  export class HolesInSegmentsError extends Error {}
  export class ZeroSegmentsError extends Error {}
  export class NormalizeGoingOutsideRootError extends Error {}
  export class RelativeToSelfError extends Error {}
}
