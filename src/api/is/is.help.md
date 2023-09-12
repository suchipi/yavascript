`is` - check type of value

Returns whether `value` is of type `type`. Useful for validating that values have the correct type at runtime, in library functions or etc.

`type` can be any of the following:

- a TypeValidator function from the `types` namespace
- a global constructor like `String`, `Number`, `Boolean`, `Set`, `Int8Array`, etc
- a user-defined class
- a primitive value like `true`, `false`, `null`, or `42`
- a Regular Expression (to match strings that match the regexp)
- an object or array containing any combination of the above

Note that yavascript has the following global aliases defined, which are also valid types:

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

See also `help(types)` and `help(assert.type)` (throws an error instead of returning a boolean).
