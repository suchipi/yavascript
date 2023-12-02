# `logger` - Logger used by various functions

`logger` is used internally by yavascript API functions such as `which`, `exec`, `copy`, `glob`, and more.

You can modify the properties on the `logger` object in order to configure the amount and style of log output from yavascript API functions.

This is similar to the shell builtin `set -x`.

```ts
// Defined in yavascript/src/api/logger
declare const logger: {
  /** For verbose/debug logging. Defaults to a no-op function. */
  trace: (...args: Array<any>) => void;
  /** For curt/status logging. Default function writes to stderr. */
  info: (...args: Array<any>) => void;
};
```
