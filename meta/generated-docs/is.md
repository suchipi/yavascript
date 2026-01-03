- [is (function)](#is-function)
  - [Example](#example)
- [\_is (value)](#_is-value)

# is (function)

Returns whether `value` is of type `type`. Useful for validating that values
have the correct type at runtime, in library functions or etc.

The `type` parameter can be any of the following:

- a TypeValidator function from the `types` namespace
- a global constructor like `String`, `Number`, `Boolean`, `Set`,
  `Int8Array`, etc
- a user-defined class
- a primitive value like `true`, `false`, `null`, or `42`
- a Regular Expression (to match strings that match the regexp)
- an object or array containing any combination of the above

Note that yavascript has the following global aliases defined, which are also
valid types:

```ts
const bigint = BigInt;
const boolean = Boolean;
const number = Number;
const string = String;
const symbol = Symbol;
```

## Example

```ts
is(42, Number); // true
is(42, number); // true
is(42, types.number); // true

is(42, String); // false
is(42, Set); // false
is(42, Array); // false

is(42, 42); // true
is(42, 45); // false

is({ kind: "success", data: 99 }, { kind: "success" }); // true
```

```ts
// Defined in yavascript/src/api/is
declare function is(value: any, type: TypeValidator<any>): boolean;
```

See also [types](/meta/generated-docs/types.md#types-object) (which contains [TypeValidator](/meta/generated-docs/types.md#typevalidator-type)s that can be
used by `is`) and [assert.type](/meta/generated-docs/assert.md#asserttype-function-property) (which throws an error instead of
returning a boolean).

```ts
const is: <T extends TypeValidator<any> | CoerceableToTypeValidator>(
  value: any,
  type: T,
) => value is UnwrapTypeFromCoerceableOrValidator<T>;
```

# \_is (value)

Alias to [is](/meta/generated-docs/is.md#is-function), for when using the Civet language, because `is` is a
reserved keyword in Civet.

```ts
const _is: typeof is;
```
