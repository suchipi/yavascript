# `print` - Print to stdout.

`print` is an alias for `console.log`, which prints values to stdout. Any value can be logged, not just strings. Non-string values will be formatted using the global `inspect` function.

```ts
// Defined in yavascript/src/api/console
declare function print(...args: any): void;
```
