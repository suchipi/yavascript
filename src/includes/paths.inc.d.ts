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
