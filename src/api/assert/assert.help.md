# `assert` - Throws an error if its argument isn't truthy.

Accepts two arguments: `value`, and (optionally) `message`.

- `value` - The value to test for truthiness
- `message` - An optional error message to use. If unspecified, "Assertion failed" will be used.

```ts
// Defined in yavascript/src/api/assert
declare function assert(value: any, message?: string): void;
```

`assert` also has a property on it called `type`. See `help(assert.type)` for more info.
