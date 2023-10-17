# `console.error` - Prints values to stderr.

`console.error` logs its arguments to stderr. Any value can be logged, not just strings. Non-string values will be formatted using the global `inspect` function.

```ts
// Defined in yavascript/src/api/console
declare function error(...args: any): void;
```
