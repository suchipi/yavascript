# `assert.type` - Throws an error if its argument isn't the correct type.

Accepts three arguments: `value`, `type` and (optionally) `message`.

- `value` - The value to test the type of
- `type` - The type that `value` should be, as either a `TypeValidator` (from the `types.*` namespace) or a value which can be coerced into a `TypeValidator` via the `types.coerce` function, like `String`, `Boolean`, etc.
- `message` - An optional error message to use. If unspecified, a generic-but-descriptive message will be used.

```ts
// Defined in yavascript/src/api/assert
declare function type(
  value: any,
  type: TypeValidator<any> | CoerceableToTypeValidator,
  message?: string
): void;
```

See `help(types)` for a list of `TypeValidator`s.

See `help(is)` for a function which returns a boolean instead of throwing.
