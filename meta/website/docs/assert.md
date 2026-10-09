---
hide_title: true
---
## assert (function)

```ts
const assert: {
  <ValueType>(
    value: ValueType,
    message?: string,
  ): asserts value is ValueType extends null | undefined | false | 0 | ""
    ? never
    : ValueType;
  type: <T extends TypeValidator<any> | CoerceableToTypeValidator>(
    value: any,
    type: T,
    optionalMessage?: string,
  ) => asserts value is UnwrapTypeFromCoerceableOrValidator<T>;
};
```

### assert(...) (call signature)

Throws an error if `value` is not truthy.

- `@param` _value_ — The value to test for truthiness
- `@param` _message_ — An optional error message to use. If unspecified, "Assertion failed" will be used.

**Example**

```ts
const files = ls();
assert(files.length > 0, "Expected the current directory to have files");
```

```ts
<ValueType>(value: ValueType, message?: string): asserts value is ValueType extends null | undefined | false | 0 | "" ? never : ValueType;
```

### assert.type (function property)

Throws an error if its argument isn't the correct type.

- `@param` _value_ — The value to test the type of
- `@param` _type_ — The type that `value` should be, as either a `TypeValidator` (from the `types.*` namespace) or a value which can be coerced into a `TypeValidator` via the `types.coerce` function, like `String`, `Boolean`, etc.
- `@param` _message_ — An optional error message to use. If unspecified, a generic-but-descriptive message will be used.

**Example**

```ts
const port: unknown = 8080;
assert.type(port, Number, "port must be a number");
console.log(port.toFixed(0));
```

```ts
type: <T extends TypeValidator<any> | CoerceableToTypeValidator>(value: any, type: T, optionalMessage?: string) => asserts value is UnwrapTypeFromCoerceableOrValidator<T>;
```
