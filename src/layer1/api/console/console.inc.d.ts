/**
 * Prints special ANSI escape characters to stdout which instruct your terminal
 * emulator to clear the screen and clear your terminal scrollback.
 *
 * Identical to {@link console.clear}.
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
   */
  error(message?: any, ...optionalParams: any[]): void;

  /**
   * Prints special ANSI escape characters to stdout which instruct your terminal
   * emulator to clear the screen and clear your terminal scrollback.
   *
   * Identical to {@link clear}.
   */
  clear(): void;
}

declare var console: Console;
