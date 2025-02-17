/**
 * Clear the contents and scrollback buffer of the tty by printing special characters into stdout.
 */
declare function clear(): void;

interface Console {
  /** Writes to stdout, with newline appended. */
  log(message?: any, ...optionalParams: any[]): void;
  /** Writes to stdout, with newline appended. */
  info(message?: any, ...optionalParams: any[]): void;
  /** Writes to stderr, with newline appended. */
  warn(message?: any, ...optionalParams: any[]): void;
  /** Writes to stderr, with newline appended. */
  error(message?: any, ...optionalParams: any[]): void;
  /** Same as {@link clear}(). */
  clear(): void;
}

declare var console: Console;
