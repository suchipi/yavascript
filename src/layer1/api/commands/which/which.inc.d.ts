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
 *
 * **Example**
 * ```ts
 * const gitPath = which("git");
 * if (gitPath == null) {
 *   throw new Error("git is not installed");
 * }
 * ```
 */
declare function which(binaryName: string, options?: WhichOptions): Path | null;

declare type WhichOptions = {
  /**
   * A list of folders where programs may be found. Defaults to
   * `env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR) || []`.
   *
   * **Example**
   * ```ts
   * const tool = which("my-tool", {
   *   searchPaths: ["./bin", "/usr/local/bin"],
   * });
   * ```
   */
  searchPaths?: Array<Path | string>;

  /**
   * A list of filename extension suffixes to include in the search, ie
   * `[".exe"]`. Defaults to {@link Path.OS_PROGRAM_EXTENSIONS}.
   *
   * **Example**
   * ```ts
   * const node = which("node", { suffixes: [".exe", ".cmd"] });
   * ```
   */
  suffixes?: Array<string>;

  /**
   * Options which control logging.
   *
   * **Example**
   * ```ts
   * which("git", { logging: { trace: console.error } });
   * ```
   */
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
