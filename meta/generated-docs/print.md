- [print (function)](#print-function)

# print (function)

`print` is an alias for [console.log](/meta/generated-docs/console.md#consolelog-method), which prints values to stdout.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](/meta/generated-docs/inspect.md#inspect-inspectfunction).

```ts
declare function print(...args: any): void;
```
