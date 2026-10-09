/**
 * Returns the process's current working directory.
 *
 * Provides the same functionality as the shell builtin of the same name.
 *
 * **Example**
 * ```ts
 * const here = pwd();
 * console.log(here);
 * ```
 */
declare const pwd: {
  /**
   * Returns the process's current working directory.
   *
   * Provides the same functionality as the shell builtin of the same name.
   *
   * **Example**
   * ```ts
   * const readmePath = pwd().concat("README.md");
   * console.log(readmePath);
   * ```
   */
  (): Path;

  /**
   * A frozen, read-only `Path` object containing what `pwd()` was when
   * yavascript first started up.
   *
   * **Example**
   * ```ts
   * cd("src");
   * cd(pwd.initial);
   * ```
   */
  readonly initial: Path;
};
