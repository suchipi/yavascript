# print (function)

`print` is an alias for `console.log`, which prints values to stdout. Any
value can be logged, not just strings. Non-string values will be formatted
using the global [inspect](/meta/generated-docs/inspect.md#inspect-inspectfunction) function.

```ts
declare function print(...args: any): void;
```
