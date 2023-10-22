# `__date_clock` - Get high-resolution unix timestamp

`__date_clock` is a QuickJS builtin function which provides the current unix timestamp with microsecond precision.

Contrast with `Date.now()`, which has millisecond precision.

```ts
// Defined in quickjs
declare function __date_clock(): number;
```
