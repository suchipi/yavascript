# `console.warn` - Prints values to stderr.

`console.warn` logs its arguments to stderr. Any value can be logged, not just strings. Non-string values will be formatted using the global `inspect` function.

```ts
// Defined in yavascript/src/api/console
declare function warn(...args: any): void;
```
