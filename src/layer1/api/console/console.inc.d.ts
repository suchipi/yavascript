/**
 * Prints special ANSI escape characters to stdout which instruct your terminal
 * emulator to clear the screen and clear your terminal scrollback.
 *
 * Identical to {@link console.clear}.
 *
 * **Example**
 * ```ts
 * clear();
 * ```
 */
declare function clear(): void;

interface Console {
  /**
   * Logs its arguments to stdout, with a newline appended.
   *
   * Any value can be logged, not just strings. Non-string values will be
   * formatted using {@link inspect}.
   *
   * Functionally identical to {@link console.info}, {@link echo}, and
   * {@link print}. Contrast with {@link console.error}, which prints to stderr
   * instead of stdout.
   *
   * **Example**
   * ```ts
   * console.log("hello", 42, { some: "object" });
   * ```
   */
  log(message?: any, ...optionalParams: any[]): void;

  /**
   * Logs its arguments to stdout, with a newline appended.
   *
   * Any value can be logged, not just strings. Non-string values will be
   * formatted using {@link inspect}.
   *
   * Functionally identical to {@link console.log}, {@link echo}, and
   * {@link print}. Contrast with {@link console.error}, which prints to stderr
   * instead of stdout.
   *
   * **Example**
   * ```ts
   * console.info("Build finished in", 12, "seconds");
   * ```
   */
  info(message?: any, ...optionalParams: any[]): void;

  /**
   * Logs its arguments to stderr, with a newline appended.
   *
   * Any value can be logged, not just strings. Non-string values will be
   * formatted using {@link inspect}.
   *
   * Functionally identical to {@link console.error}. Contrast with
   * {@link console.log}, which prints to stdout instead of stderr.
   *
   * **Example**
   * ```ts
   * console.warn("config.toml not found; using defaults");
   * ```
   */
  warn(message?: any, ...optionalParams: any[]): void;

  /**
   * Logs its arguments to stderr, with a newline appended.
   *
   * Any value can be logged, not just strings. Non-string values will be
   * formatted using {@link inspect}.
   *
   * Functionally identical to {@link console.warn}. Contrast with
   * {@link console.log}, which prints to stdout instead of stderr.
   *
   * **Example**
   * ```ts
   * console.error("Something went wrong:", new Error("oh no"));
   * ```
   */
  error(message?: any, ...optionalParams: any[]): void;

  /**
   * Prints special ANSI escape characters to stdout which instruct your terminal
   * emulator to clear the screen and clear your terminal scrollback.
   *
   * Identical to {@link clear}.
   *
   * **Example**
   * ```ts
   * console.clear();

   * ```
   */
  clear(): void;
}

declare var console: Console;
