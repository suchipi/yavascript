# assert (function)

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

## assert(...) (call signature)

Throws an error if `value` is not truthy.

- `@param` _value_ — The value to test for truthiness
- `@param` _message_ — An optional error message to use. If unspecified, "Assertion failed" will be used.

```ts
<ValueType>(value: ValueType, message?: string): asserts value is ValueType extends null | undefined | false | 0 | "" ? never : ValueType;
```

## assert.type (function property)

Throws an error if `value` is not of the type `type`.

`type` should be either a [TypeValidator](#), or a value which can be coerced into one via [types.coerce](#).

```ts
type: <T extends TypeValidator<any> | CoerceableToTypeValidator>(value: any, type: T, optionalMessage?: string) => asserts value is UnwrapTypeFromCoerceableOrValidator<T>;
```
