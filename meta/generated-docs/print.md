# print (function)

`print` is an alias for `console.log`, which prints values to stdout. Any
value can be logged, not just strings. Non-string values will be formatted
using the global [inspect](#) function.

```ts
declare function print(...args: any): void;
```
