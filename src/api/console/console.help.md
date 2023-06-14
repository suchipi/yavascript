`console` - Prints to stdout/stderr.

The `console` object contains several functions on it which assist in printing values to stdout/stderr. Any value can be logged, not just strings. Non-string values will be formatted using the global `inspect` function.

```ts
// Defined in yavascript/src/api/console
declare var console: {
  // Write to stdout
  log(...args: any): void;
  info(...args: any): void;

  // Write to stderr
  warn(...args: any): void;
  error(...args: any): void;

  // Clear screen and scrollback by printing ANSI escape characters to stdout
  clear(): void;
};
```
