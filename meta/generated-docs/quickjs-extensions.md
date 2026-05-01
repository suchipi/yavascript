- [ObjectConstructor (interface)](#objectconstructor-interface)
  - [ObjectConstructor.toPrimitive (method)](#objectconstructortoprimitive-method)
  - [ObjectConstructor.isPrimitive (method)](#objectconstructorisprimitive-method)
- [StringConstructor (interface)](#stringconstructor-interface)
  - [StringConstructor.cooked (method)](#stringconstructorcooked-method)
- [SymbolConstructor (interface)](#symbolconstructor-interface)
  - [SymbolConstructor.typeofValue (readonly property)](#symbolconstructortypeofvalue-readonly-property)
- [BigIntConstructor (interface)](#bigintconstructor-interface)
  - [BigIntConstructor.tdiv (method)](#bigintconstructortdiv-method)
  - [BigIntConstructor.fdiv (method)](#bigintconstructorfdiv-method)
  - [BigIntConstructor.cdiv (method)](#bigintconstructorcdiv-method)
  - [BigIntConstructor.ediv (method)](#bigintconstructorediv-method)
  - [BigIntConstructor.tdivrem (method)](#bigintconstructortdivrem-method)
  - [BigIntConstructor.fdivrem (method)](#bigintconstructorfdivrem-method)
  - [BigIntConstructor.cdivrem (method)](#bigintconstructorcdivrem-method)
  - [BigIntConstructor.edivrem (method)](#bigintconstructoredivrem-method)
  - [BigIntConstructor.sqrt (method)](#bigintconstructorsqrt-method)
  - [BigIntConstructor.sqrtrem (method)](#bigintconstructorsqrtrem-method)
  - [BigIntConstructor.floorLog2 (method)](#bigintconstructorfloorlog2-method)
  - [BigIntConstructor.ctz (method)](#bigintconstructorctz-method)

# ObjectConstructor (interface)

```ts
interface ObjectConstructor {
  toPrimitive(
    input: any,
    hint: "string" | "number" | "default",
  ): string | number | bigint | boolean | undefined | symbol | null;
  isPrimitive(input: any): boolean;
}
```

## ObjectConstructor.toPrimitive (method)

Convert the specified value to a primitive value.

The provided hint indicates a preferred return type, which may or may not
be respected by the engine.

See the abstract operation "ToPrimitive" in the ECMAScript standard for
more info.

```ts
toPrimitive(input: any, hint: "string" | "number" | "default"): string | number | bigint | boolean | undefined | symbol | null;
```

## ObjectConstructor.isPrimitive (method)

Returns a boolean indicating whether the specified value is a primitive value.

```ts
isPrimitive(input: any): boolean;
```

# StringConstructor (interface)

```ts
interface StringConstructor {
  cooked(
    strings: readonly string[] | ArrayLike<string>,
    ...substitutions: any[]
  ): string;
}
```

## StringConstructor.cooked (method)

A no-op template literal tag.

https://github.com/tc39/proposal-string-cooked

```ts
cooked(strings: readonly string[] | ArrayLike<string>, ...substitutions: any[]): string;
```

# SymbolConstructor (interface)

```ts
interface SymbolConstructor {
  readonly typeofValue: unique symbol;
}
```

## SymbolConstructor.typeofValue (readonly property)

A method that changes the result of using the `typeof` operator on the
object. Called by the semantics of the typeof operator.

Note that the following semantics will come into play when use of the
`typeof` operator causes the engine to call a `Symbol.typeofValue` method
on an object:

- If the method returns any value other than one of the string values
  which are normally the result of using the `typeof` operator, the engine
  behaves as if no `Symbol.typeofValue` method was present on the object.
- If an error is thrown from this method, or an error is thrown while
  accessing this property, the error will be silently ignored, and the
  engine will behave as if no `Symbol.typeofValue` method was present on
  the object.
- If this property is present on an object, but the value of that property
  is not a function, the engine will not consider that value when
  determining the result of the `typeof` operation (it'll ignore it).

```ts
readonly typeofValue: unique symbol;
```

# BigIntConstructor (interface)

```ts
interface BigIntConstructor {
  tdiv(a: bigint, b: bigint): bigint;
  fdiv(a: bigint, b: bigint): bigint;
  cdiv(a: bigint, b: bigint): bigint;
  ediv(a: bigint, b: bigint): bigint;
  tdivrem(a: bigint, b: bigint): [bigint, bigint];
  fdivrem(a: bigint, b: bigint): [bigint, bigint];
  cdivrem(a: bigint, b: bigint): [bigint, bigint];
  edivrem(a: bigint, b: bigint): [bigint, bigint];
  sqrt(a: bigint): bigint;
  sqrtrem(a: bigint): [bigint, bigint];
  floorLog2(a: bigint): bigint;
  ctz(a: bigint): bigint;
}
```

## BigIntConstructor.tdiv (method)

Return trunc(a/b).

b = 0 raises a RangeError exception.

```ts
tdiv(a: bigint, b: bigint): bigint;
```

## BigIntConstructor.fdiv (method)

Return \lfloor a/b \rfloor.

b = 0 raises a RangeError exception.

```ts
fdiv(a: bigint, b: bigint): bigint;
```

## BigIntConstructor.cdiv (method)

Return \lceil a/b \rceil.

b = 0 raises a RangeError exception.

```ts
cdiv(a: bigint, b: bigint): bigint;
```

## BigIntConstructor.ediv (method)

Return sgn(b) \lfloor a/{|b|} \rfloor (Euclidian division).

b = 0 raises a RangeError exception.

```ts
ediv(a: bigint, b: bigint): bigint;
```

## BigIntConstructor.tdivrem (method)

Perform trunc(a/b) and return an array of two elements. The first element
is the quotient, the second is the remainder.

b = 0 raises a RangeError exception.

```ts
tdivrem(a: bigint, b: bigint): [bigint, bigint];
```

## BigIntConstructor.fdivrem (method)

Perform \lfloor a/b \rfloor and return an array of two elements. The first
element is the quotient, the second is the remainder.

b = 0 raises a RangeError exception.

```ts
fdivrem(a: bigint, b: bigint): [bigint, bigint];
```

## BigIntConstructor.cdivrem (method)

Perform \lceil a/b \rceil and return an array of two elements. The first
element is the quotient, the second is the remainder.

b = 0 raises a RangeError exception.

```ts
cdivrem(a: bigint, b: bigint): [bigint, bigint];
```

## BigIntConstructor.edivrem (method)

Perform sgn(b) \lfloor a/{|b|} \rfloor (Euclidian division) and return an
array of two elements. The first element is the quotient, the second is
the remainder.

b = 0 raises a RangeError exception.

```ts
edivrem(a: bigint, b: bigint): [bigint, bigint];
```

## BigIntConstructor.sqrt (method)

Return \lfloor \sqrt(a) \rfloor.

A RangeError exception is raised if a < 0.

```ts
sqrt(a: bigint): bigint;
```

## BigIntConstructor.sqrtrem (method)

Return an array of two elements. The first element is
\lfloor \sqrt{a} \rfloor. The second element is
a-\lfloor \sqrt{a} \rfloor^2.

A RangeError exception is raised if a < 0.

```ts
sqrtrem(a: bigint): [bigint, bigint];
```

## BigIntConstructor.floorLog2 (method)

Return -1 if a \leq 0 otherwise return \lfloor \log2(a) \rfloor.

```ts
floorLog2(a: bigint): bigint;
```

## BigIntConstructor.ctz (method)

Return the number of trailing zeros in the two’s complement binary representation of a.

Return -1 if a=0.

```ts
ctz(a: bigint): bigint;
```
