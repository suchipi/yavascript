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
   * glob(["./*.js"], { trace: console.log });
   * ```
   */
  trace?: (...args: Array<any>) => void;

  /**
   * Directory to interpret glob patterns relative to. Defaults to `pwd()`.
   */
  dir?: string | Path;
};

/**
 * Search the filesystem for files matching the specified glob patterns.
 *
 * Uses [minimatch](https://www.npmjs.com/package/minimatch) with its default
 * options.
 */
declare function glob(
  patterns: string | Array<string>,
  options?: GlobOptions
): Array<Path>;
