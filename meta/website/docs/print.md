---
hide_title: true
---
## print (function)

`print` is an alias for [console.log](./console.md#consolelog-method), which prints values to stdout.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](./inspect.md#inspect-inspectfunction).

```ts
declare function print(...args: any): void;
```
