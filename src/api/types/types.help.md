# `types` - Type validator functions

The `types` namespace object contains various functions which can be used to identify the type of a value at runtime. It is based on [pheno](https://github.com/suchipi/pheno), with some yavascript-specific extensions.

## Usage

To check that a value is of a type, use `is`. To assert that a value is of a type, use `assert.type`:

```ts
is("hi", types.string); // true
is("hi", types.number); // false
is({ blah: 42 }, types.objectWithProperties({ blah: types.number })); // true

assert.type("hi", types.string);
assert.type("hi", types.number); // throws
assert.type({ blah: 42 }, types.objectWithProperties({ blah: types.number }));
```

In many cases, you can use a "normal" JavaScript value for the type instead of something from the `types` namespace. For instance, the following code block is equivalent to the previous one:

```ts
is("hi", String); // true
is("hi", Number); // false
is({ blah: 42 }, { blah: Number }); // true

assert.type("hi", String);
assert.type("hi", Number); // throws
assert.type({ blah: 42 }, { blah: Number });
```

For more info about using "normal" values, see the "Coercion" heading below.

## Explanation

There are two kinds of function properties found on the `types` namespace: those which return a boolean, and those which return a function. Functions which return a boolean are called "type validators", and can be used to check the type of a value. For example, `types.number` is a type validator:

```ts
is(42, types.number); // returns true
```

The other kind of function is a function which returns a function. These are called "type validator constructors", because the function they return is a type validator. They are used to construct complex type validators. For example, `types.exactString` is a type validator constructor:

```ts
const myType = types.exactString("potato");
// myType is a function which returns true or false

is("eggplant", myType); // returns false
is("potato", myType); // returns true
```

## List of Functions

### Type Validators

Here is a list of all the type validators:

- `any`
- `anyArray`
- `anyFunction`
- `anyMap`
- `anyObject`
- `anySet`
- `anyTypeValidator`
- `array` (alias of `arrayOfUnknown`)
- `arrayOfAny`
- `arrayOfUnknown`
- `Array` (alias of `arrayOfUnknown`)
- `bigint`
- `BigInt` (alias of `bigint`)
- `boolean`
- `Boolean` (alias of `boolean`)
- `Date`
- `Error`
- `false`
- `falsy`
- `Function` (alias of `unknownFunction`)
- `Infinity`
- `integer`
- `map` (alias of `unknownMap`)
- `Map` (alias of `unknownMap`)
- `NaN`
- `NegativeInfinity`
- `never`
- `nonNullOrUndefined`
- `null`
- `nullish`
- `void` (alias of `nullish`)
- `number` (doesn't include NaN, Infinity, or -Infinity)
- `Number` (alias of `number`)
- `numberIncludingNanAndInfinities`
- `object` (alias of `unknownObject`)
- `Object` (alias of `unknownObject`)
- `objectOrNull`
- `RegExp`
- `set` (alias of `unknownSet`)
- `Set` (alias of `unknownSet`)
- `string`
- `String` (alias of `string`)
- `Symbol`
- `symbol` (alias of `Symbol`)
- `true`
- `truthy`
- `undefined`
- `unknown`
- `unknownFunction`
- `unknownMap`
- `unknownObject`
- `unknownSet`
- `unknownTypeValidator`
- `ArrayBuffer`
- `SharedArrayBuffer`
- `DataView`
- `TypedArray`
- `Int8Array`
- `Uint8Array`
- `Uint8ClampedArray`
- `Int16Array`
- `Uint16Array`
- `Int32Array`
- `Uint32Array`
- `Float32Array`
- `Float64Array`
- `FILE`
- `Path`
- `JSX.Element` (alias of `JSX.unknownElement`)
- `JSX.unknownElement`
- `JSX.anyElement`
- `JSX.Fragment`

### Type Validator Constructors

And all the type validator constructors:

- `and`
- `arrayOf`
- `exactBigInt`
- `exactNumber`
- `exactString`
- `exactSymbol`
- `hasClassName`
- `hasToStringTag`
- `instanceOf`
- `intersection`
- `mapOf`
- `mappingObjectOf`
- `maybe`
- `objectWithOnlyTheseProperties`
- `objectWithProperties`
- `or`
- `optional`
- `partialObjectWithProperties`
- `record`
- `setOf`
- `stringMatching`
- `symbolFor`
- `union`

## Coercion

There is also a function, `types.coerce`, which returns an appropriate type validator value for a given input value, using the following logic:

| Input value                   | Output validator                   |
| ----------------------------- | ---------------------------------- |
| `String` or `string` global   | `types.string`                     |
| `Number` or `number` global   | `types.number`                     |
| `Boolean` or `boolean` global | `types.boolean`                    |
| `BigInt` or `bigint` global   | `types.bigint`                     |
| `Symbol` global               | `types.Symbol`                     |
| `RegExp` global               | `types.RegExp`                     |
| `Array` global                | `types.arrayOfUnknown`             |
| `Set` global                  | `types.unknownSet`                 |
| `Map` global                  | `types.unknownMap`                 |
| `Object` global               | `types.unknownObject`              |
| `Date` global                 | `types.Date`                       |
| `Function` global             | `types.unknownFunction`            |
| `ArrayBuffer` global          | `types.ArrayBuffer`                |
| `SharedArrayBuffer` global    | `types.SharedArrayBuffer`          |
| `DataView` global             | `types.DataView`                   |
| `Int8Array` global            | `types.Int8Array`                  |
| `Uint8Array` global           | `types.Uint8Array`                 |
| `Uint8ClampedArray` global    | `types.Uint8ClampedArray`          |
| `Int16Array` global           | `types.Int16Array`                 |
| `Uint16Array` global          | `types.Uint16Array`                |
| `Int32Array` global           | `types.Int32Array`                 |
| `Uint32Array` global          | `types.Uint32Array`                |
| `Float32Array` global         | `types.Float32Array`               |
| `Float64Array` global         | `types.Float64Array`               |
| `Path` global                 | `types.Path`                       |
| Any RegExp value              | Validator for matching strings     |
| Empty array                   | Validator for empty arrays         |
| Array with one item           | Validator for array of that item   |
| Array with multiple items     | Validator for tuple of those types |
| Class constructor function    | Validator for instances of it      |
| Any Object value              | Validator for same-shaped object   |
| null                          | `types.null`                       |
| undefined                     | `types.undefined`                  |
| true                          | `types.true`                       |
| false                         | `types.false`                      |
| NaN                           | `types.NaN`                        |
| Infinity                      | `types.Infinity`                   |
| `-Infinity`                   | `types.NegativeInfinity`           |
| Any string value              | `types.exactString(<the value>)`   |
| Any 'normal' number value     | `types.exactNumber(<the value>)`   |
| Any Symbol value              | `types.exactSymbol(<the value>)`   |
| Any BigInt value              | `types.exactBigInt(<the value>)`   |

> All type constructors, as well as `is` and `assert.type`, do coercion automatically! This means that in many cases, you do not need to access properties from the `types` namespace.

## Definition

```ts
// Defined in yavascript/src/api/types
declare type TypeValidator<T> = (value: any) => value is T;

// NOTE: Some of these types are simplified for the sake of readability.
// For the real types, run `yavascript --print-types`.
declare const types: {
  // basic types
  any: TypeValidator<any>;
  unknown: TypeValidator<unknown>;
  anyObject: TypeValidator<{
    [key: string | number | symbol]: any;
  }>;
  unknownObject: TypeValidator<{}>;
  object: TypeValidator<{}>;
  Object: TypeValidator<{}>;
  arrayOfAny: TypeValidator<Array<any>>;
  arrayOfUnknown: TypeValidator<Array<unknown>>;
  array: TypeValidator<Array<unknown>>;
  Array: TypeValidator<unknown[]>;
  anyArray: TypeValidator<Array<any>>;
  boolean: TypeValidator<boolean>;
  Boolean: TypeValidator<boolean>;
  string: TypeValidator<string>;
  String: TypeValidator<string>;
  null: TypeValidator<null>;
  undefined: TypeValidator<undefined>;
  nullish: TypeValidator<null | undefined>;
  void: TypeValidator<null | undefined>;
  numberIncludingNanAndInfinities: TypeValidator<number>;
  number: TypeValidator<number>;
  Number: TypeValidator<number>;
  NaN: TypeValidator<number>;
  Infinity: TypeValidator<number>;
  NegativeInfinity: TypeValidator<number>;
  integer: TypeValidator<number>;
  bigint: TypeValidator<bigint>;
  BigInt: TypeValidator<bigint>;
  never: TypeValidator<never>;
  anyFunction: TypeValidator<(...args: any) => any>;
  unknownFunction: TypeValidator<(...args: Array<unknown>) => unknown>;
  Function: TypeValidator<(...args: Array<unknown>) => unknown>;
  false: TypeValidator<false>;
  true: TypeValidator<true>;
  falsy: TypeValidator<false | null | undefined | "" | 0>;
  truthy: <T>(target: false | "" | 0 | T | null | undefined) => target is T;
  nonNullOrUndefined: <T>(target: T | null | undefined) => target is T;
  Error: TypeValidator<Error>;
  Symbol: TypeValidator<symbol>;
  symbol: TypeValidator<symbol>;
  RegExp: TypeValidator<RegExp>;
  Date: TypeValidator<Date>;
  anyMap: TypeValidator<Map<any, any>>;
  unknownMap: TypeValidator<Map<unknown, unknown>>;
  map: TypeValidator<Map<unknown, unknown>>;
  Map: TypeValidator<Map<unknown, unknown>>;
  anySet: TypeValidator<Set<any>>;
  unknownSet: TypeValidator<Set<unknown>>;
  set: TypeValidator<Set<unknown>>;
  Set: TypeValidator<Set<unknown>>;
  ArrayBuffer: TypeValidator<ArrayBuffer>;
  SharedArrayBuffer: TypeValidator<SharedArrayBuffer>;
  DataView: TypeValidator<DataView>;
  TypedArray: TypeValidator<
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
  >;
  Int8Array: TypeValidator<Int8Array>;
  Uint8Array: TypeValidator<Uint8Array>;
  Uint8ClampedArray: TypeValidator<Uint8ClampedArray>;
  Int16Array: TypeValidator<Int16Array>;
  Uint16Array: TypeValidator<Uint16Array>;
  Int32Array: TypeValidator<Int32Array>;
  Uint32Array: TypeValidator<Uint32Array>;
  Float32Array: TypeValidator<Float32Array>;
  Float64Array: TypeValidator<Float64Array>;

  // type constructors
  exactString<T extends string>(str: T): TypeValidator<T>;
  exactNumber<T extends number>(num: T): TypeValidator<T>;
  exactBigInt<T extends bigint>(num: T): TypeValidator<T>;
  exactSymbol<T extends symbol>(sym: T): TypeValidator<T>;

  hasClassName(name: string): TypeValidator<any>;
  hasToStringTag(name: string): TypeValidator<any>;
  instanceOf<Klass>(klass: Klass): TypeValidator<Klass["prototype"]>;

  stringMatching(regexp: RegExp): TypeValidator<string>;
  symbolFor(key: string): TypeValidator<symbol>;
  arrayOf<T>(typeValidator: TypeValidator<T>): TypeValidator<Array<T>>;

  intersection<Args extends Array<TypeValidator<any>>>(
    ...args: Args
  ): TypeValidator<Args[0] & Args[1] & Args[2] /* & ... */>;
  and: typeof types.intersection;
  union<Args extends Array<TypeValidator<any>>>(
    ...args: Args
  ): TypeValidator<Args[0] | Args[1] | Args[2] /* | ... */>;
  or: typeof types.union;

  mapOf<K, V>(
    keyType: TypeValidator<K>,
    valueType: TypeValidator<V>
  ): TypeValidator<Map<K, V>>;
  setOf<T>(itemType: TypeValidator<T>): TypeValidator<Set<T>>;
  maybe<T>(itemType: TypeValidator<T>): TypeValidator<T | undefined | null>;

  objectWithProperties<Obj>(properties: Obj): TypeValidator<Obj>;
  objectWithOnlyTheseProperties<Obj>(properties: Obj): TypeValidator<Obj>;
  partialObjectWithProperties<Obj>(properties: Obj): TypeValidator<{
    [key in keyof Obj]: Obj[key] | undefined | null;
  }>;

  mappingObjectOf<K, V>(
    keyType: TypeValidator<K>,
    valueType: TypeValidator<V>
  ): TypeValidator<Record<K, V>>;
  record: typeof types.mappingObjectOf;

  tuple<Args extends Array<TypeValidator<any>>>(
    ...args: Args
  ): TypeValidator<[Args[0], Args[1], Args[2] /* , ... */]>;

  coerce(value: any): TypeValidator<any>;

  FILE: TypeValidator<FILE>;
  Path: TypeValidator<Path>;
  JSX: {
    unknownElement: TypeValidator<JSX.Element<unknown, unknown>>;
    anyElement: TypeValidator<JSX.Element<any, any>>;
    Element: TypeValidator<JSX.Element<unknown, unknown>>;
    Fragment: TypeValidator<JSX.Fragment>;
  };
};
```
