# `console.log` - Prints values to stdout.

`console.log` logs its arguments to stdout. Any value can be logged, not just strings. Non-string values will be formatted using the global `inspect` function.

```ts
// Defined in yavascript/src/api/console
declare function log(...args: any): void;
```
