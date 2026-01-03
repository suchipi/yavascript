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
  options?: GlobOptions,
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
