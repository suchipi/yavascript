# `console.info` - Prints values to stdout.

`console.info` logs its arguments to stdout. Any value can be logged, not just strings. Non-string values will be formatted using the global `inspect` function.

```ts
// Defined in yavascript/src/api/console
declare function info(...args: any): void;
```
