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
