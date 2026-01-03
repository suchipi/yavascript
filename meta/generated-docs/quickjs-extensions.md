- [ObjectConstructor (interface)](#objectconstructor-interface)
  - [ObjectConstructor.toPrimitive (method)](#objectconstructortoprimitive-method)
  - [ObjectConstructor.isPrimitive (method)](#objectconstructorisprimitive-method)
- [StringConstructor (interface)](#stringconstructor-interface)
  - [StringConstructor.cooked (method)](#stringconstructorcooked-method)
- [SymbolConstructor (interface)](#symbolconstructor-interface)
  - [SymbolConstructor.typeofValue (readonly property)](#symbolconstructortypeofvalue-readonly-property)
  - [SymbolConstructor.operatorSet (readonly property)](#symbolconstructoroperatorset-readonly-property)
- [OperatorSet (type)](#operatorset-type)
  - [OperatorSet.**is** (`"OperatorSet"` property)](#operatorsetis-operatorset-property)
- [OperatorFunctions (interface)](#operatorfunctions-interface)
  - [OperatorFunctions.pos (function property)](#operatorfunctionspos-function-property)
  - [OperatorFunctions.neg (function property)](#operatorfunctionsneg-function-property)
- [SelfOperators (interface)](#selfoperators-interface)
  - [SelfOperators.left (undefined property)](#selfoperatorsleft-undefined-property)
  - [SelfOperators.right (undefined property)](#selfoperatorsright-undefined-property)
- [LeftOperators (interface)](#leftoperators-interface)
  - [LeftOperators.left (object property)](#leftoperatorsleft-object-property)
  - [LeftOperators.right (undefined property)](#leftoperatorsright-undefined-property)
- [RightOperators (interface)](#rightoperators-interface)
  - [RightOperators.left (undefined property)](#rightoperatorsleft-undefined-property)
  - [RightOperators.right (object property)](#rightoperatorsright-object-property)
- [OperatorsConstructor (interface)](#operatorsconstructor-interface)
  - [OperatorsConstructor(...) (call signature)](#operatorsconstructor-call-signature)
  - [OperatorsConstructor.create (function property)](#operatorsconstructorcreate-function-property)
  - [OperatorsConstructor.updateBigIntOperators (method)](#operatorsconstructorupdatebigintoperators-method)
- [Operators (OperatorsConstructor)](#operators-operatorsconstructor)
- [Number (interface)](#number-interface)
- [Boolean (interface)](#boolean-interface)
- [String (interface)](#string-interface)
- [BigInt (interface)](#bigint-interface)
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
- [BigFloatRoundingMode (type)](#bigfloatroundingmode-type)
- [BigFloatEnvConstructor (interface)](#bigfloatenvconstructor-interface)
  - [BigFloatEnvConstructor new(...) (construct signature)](#bigfloatenvconstructor-new-construct-signature)
  - [BigFloatEnvConstructor.prec (getter)](#bigfloatenvconstructorprec-getter)
  - [BigFloatEnvConstructor.expBits (getter)](#bigfloatenvconstructorexpbits-getter)
  - [BigFloatEnvConstructor.setPrec (method)](#bigfloatenvconstructorsetprec-method)
  - [BigFloatEnvConstructor.precMin (readonly number property)](#bigfloatenvconstructorprecmin-readonly-number-property)
  - [BigFloatEnvConstructor.precMax (readonly number property)](#bigfloatenvconstructorprecmax-readonly-number-property)
  - [BigFloatEnvConstructor.expBitsMin (readonly number property)](#bigfloatenvconstructorexpbitsmin-readonly-number-property)
  - [BigFloatEnvConstructor.expBitsMax (readonly number property)](#bigfloatenvconstructorexpbitsmax-readonly-number-property)
  - [BigFloatEnvConstructor.RNDN (readonly BigFloatRoundingMode property)](#bigfloatenvconstructorrndn-readonly-bigfloatroundingmode-property)
  - [BigFloatEnvConstructor.RNDZ (readonly BigFloatRoundingMode property)](#bigfloatenvconstructorrndz-readonly-bigfloatroundingmode-property)
  - [BigFloatEnvConstructor.RNDD (readonly BigFloatRoundingMode property)](#bigfloatenvconstructorrndd-readonly-bigfloatroundingmode-property)
  - [BigFloatEnvConstructor.RNDU (readonly BigFloatRoundingMode property)](#bigfloatenvconstructorrndu-readonly-bigfloatroundingmode-property)
  - [BigFloatEnvConstructor.RNDNA (readonly BigFloatRoundingMode property)](#bigfloatenvconstructorrndna-readonly-bigfloatroundingmode-property)
  - [BigFloatEnvConstructor.RNDA (readonly BigFloatRoundingMode property)](#bigfloatenvconstructorrnda-readonly-bigfloatroundingmode-property)
  - [BigFloatEnvConstructor.RNDF (readonly BigFloatRoundingMode property)](#bigfloatenvconstructorrndf-readonly-bigfloatroundingmode-property)
  - [BigFloatEnvConstructor.prototype (BigFloatEnv property)](#bigfloatenvconstructorprototype-bigfloatenv-property)
- [BigFloatEnv (BigFloatEnvConstructor)](#bigfloatenv-bigfloatenvconstructor)
- [BigFloatEnv (interface)](#bigfloatenv-interface)
  - [BigFloatEnv.prec (getter)](#bigfloatenvprec-getter)
  - [BigFloatEnv.prec (setter)](#bigfloatenvprec-setter)
  - [BigFloatEnv.expBits (getter)](#bigfloatenvexpbits-getter)
  - [BigFloatEnv.expBits (setter)](#bigfloatenvexpbits-setter)
  - [BigFloatEnv.rndMode (getter)](#bigfloatenvrndmode-getter)
  - [BigFloatEnv.rndMode (setter)](#bigfloatenvrndmode-setter)
  - [BigFloatEnv.subnormal (getter)](#bigfloatenvsubnormal-getter)
  - [BigFloatEnv.subnormal (setter)](#bigfloatenvsubnormal-setter)
  - [BigFloatEnv.invalidOperation (getter)](#bigfloatenvinvalidoperation-getter)
  - [BigFloatEnv.invalidOperation (setter)](#bigfloatenvinvalidoperation-setter)
  - [BigFloatEnv.divideByZero (getter)](#bigfloatenvdividebyzero-getter)
  - [BigFloatEnv.divideByZero (setter)](#bigfloatenvdividebyzero-setter)
  - [BigFloatEnv.overflow (getter)](#bigfloatenvoverflow-getter)
  - [BigFloatEnv.overflow (setter)](#bigfloatenvoverflow-setter)
  - [BigFloatEnv.underflow (getter)](#bigfloatenvunderflow-getter)
  - [BigFloatEnv.underflow (setter)](#bigfloatenvunderflow-setter)
  - [BigFloatEnv.inexact (getter)](#bigfloatenvinexact-getter)
  - [BigFloatEnv.inexact (setter)](#bigfloatenvinexact-setter)
  - [BigFloatEnv.clearStatus (method)](#bigfloatenvclearstatus-method)
- [BigFloatConstructor (interface)](#bigfloatconstructor-interface)
  - [BigFloatConstructor(...) (call signature)](#bigfloatconstructor-call-signature)
  - [BigFloatConstructor.prototype (BigFloat property)](#bigfloatconstructorprototype-bigfloat-property)
  - [BigFloatConstructor.LN2 (getter)](#bigfloatconstructorln2-getter)
  - [BigFloatConstructor.PI (getter)](#bigfloatconstructorpi-getter)
  - [BigFloatConstructor.MIN_VALUE (getter)](#bigfloatconstructormin_value-getter)
  - [BigFloatConstructor.MAX_VALUE (getter)](#bigfloatconstructormax_value-getter)
  - [BigFloatConstructor.EPSILON (getter)](#bigfloatconstructorepsilon-getter)
  - [BigFloatConstructor.fpRound (method)](#bigfloatconstructorfpround-method)
  - [BigFloatConstructor.parseFloat (method)](#bigfloatconstructorparsefloat-method)
  - [BigFloatConstructor.isFinite (method)](#bigfloatconstructorisfinite-method)
  - [BigFloatConstructor.isNaN (method)](#bigfloatconstructorisnan-method)
  - [BigFloatConstructor.add (method)](#bigfloatconstructoradd-method)
  - [BigFloatConstructor.sub (method)](#bigfloatconstructorsub-method)
  - [BigFloatConstructor.mul (method)](#bigfloatconstructormul-method)
  - [BigFloatConstructor.div (method)](#bigfloatconstructordiv-method)
  - [BigFloatConstructor.floor (method)](#bigfloatconstructorfloor-method)
  - [BigFloatConstructor.ceil (method)](#bigfloatconstructorceil-method)
  - [BigFloatConstructor.round (method)](#bigfloatconstructorround-method)
  - [BigFloatConstructor.trunc (method)](#bigfloatconstructortrunc-method)
  - [BigFloatConstructor.abs (method)](#bigfloatconstructorabs-method)
  - [BigFloatConstructor.fmod (method)](#bigfloatconstructorfmod-method)
  - [BigFloatConstructor.remainder (method)](#bigfloatconstructorremainder-method)
  - [BigFloatConstructor.sqrt (method)](#bigfloatconstructorsqrt-method)
  - [BigFloatConstructor.sin (method)](#bigfloatconstructorsin-method)
  - [BigFloatConstructor.cos (method)](#bigfloatconstructorcos-method)
  - [BigFloatConstructor.tan (method)](#bigfloatconstructortan-method)
  - [BigFloatConstructor.asin (method)](#bigfloatconstructorasin-method)
  - [BigFloatConstructor.acos (method)](#bigfloatconstructoracos-method)
  - [BigFloatConstructor.atan (method)](#bigfloatconstructoratan-method)
  - [BigFloatConstructor.atan2 (method)](#bigfloatconstructoratan2-method)
  - [BigFloatConstructor.exp (method)](#bigfloatconstructorexp-method)
  - [BigFloatConstructor.log (method)](#bigfloatconstructorlog-method)
  - [BigFloatConstructor.pow (method)](#bigfloatconstructorpow-method)
- [BigFloat (BigFloatConstructor)](#bigfloat-bigfloatconstructor)
- [BigFloat (interface)](#bigfloat-interface)
  - [BigFloat.valueOf (method)](#bigfloatvalueof-method)
  - [BigFloat.toString (method)](#bigfloattostring-method)
  - [BigFloat.toPrecision (method)](#bigfloattoprecision-method)
  - [BigFloat.toFixed (method)](#bigfloattofixed-method)
  - [BigFloat.toExponential (method)](#bigfloattoexponential-method)
- [BigDecimalRoundingMode (type)](#bigdecimalroundingmode-type)
- [BigDecimalRoundingObject (type)](#bigdecimalroundingobject-type)
- [BigDecimalConstructor (interface)](#bigdecimalconstructor-interface)
  - [BigDecimalConstructor(...) (call signature)](#bigdecimalconstructor-call-signature)
  - [BigDecimalConstructor(...) (call signature)](#bigdecimalconstructor-call-signature-1)
  - [BigDecimalConstructor.add (method)](#bigdecimalconstructoradd-method)
  - [BigDecimalConstructor.sub (method)](#bigdecimalconstructorsub-method)
  - [BigDecimalConstructor.mul (method)](#bigdecimalconstructormul-method)
  - [BigDecimalConstructor.div (method)](#bigdecimalconstructordiv-method)
  - [BigDecimalConstructor.mod (method)](#bigdecimalconstructormod-method)
  - [BigDecimalConstructor.sqrt (method)](#bigdecimalconstructorsqrt-method)
  - [BigDecimalConstructor.round (method)](#bigdecimalconstructorround-method)
  - [BigDecimalConstructor.prototype (BigDecimal property)](#bigdecimalconstructorprototype-bigdecimal-property)
- [BigDecimal (BigDecimalConstructor)](#bigdecimal-bigdecimalconstructor)
- [BigDecimal (interface)](#bigdecimal-interface)
  - [BigDecimal.valueOf (method)](#bigdecimalvalueof-method)
  - [BigDecimal.toString (method)](#bigdecimaltostring-method)
  - [BigDecimal.toPrecision (method)](#bigdecimaltoprecision-method)
  - [BigDecimal.toFixed (method)](#bigdecimaltofixed-method)
  - [BigDecimal.toExponential (method)](#bigdecimaltoexponential-method)

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
  readonly operatorSet: unique symbol;
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

## SymbolConstructor.operatorSet (readonly property)

To override operators (+, -, ==, etc) for an object, set its
`Symbol.operatorSet` property to an `OperatorSet` object, which can be
created via `Operators.create`.

```ts
readonly operatorSet: unique symbol;
```

# OperatorSet (type)

An object that, if placed on another object's `Symbol.operatorSet` property,
will overload its operators to behave as defined by the functions this
OperatorSet was constructed with.

You can create an OperatorSet via `Operators(...)` or
`Operators.create(...)`.

```ts
declare type OperatorSet = {
  __is__: "OperatorSet";
};
```

## OperatorSet.**is** (`"OperatorSet"` property)

This property is not here at runtime; we just use it to make this type
differ from an empty object.

```ts
__is__: "OperatorSet";
```

# OperatorFunctions (interface)

```ts
interface OperatorFunctions<Left, Right> {
  "+": (left: Left, right: Right) => any;
  "-": (left: Left, right: Right) => any;
  "*": (left: Left, right: Right) => any;
  "/": (left: Left, right: Right) => any;
  "%": (left: Left, right: Right) => any;
  "**": (left: Left, right: Right) => any;
  "|": (left: Left, right: Right) => any;
  "&": (left: Left, right: Right) => any;
  "^": (left: Left, right: Right) => any;
  "<<": (left: Left, right: Right) => any;
  ">>": (left: Left, right: Right) => any;
  ">>>": (left: Left, right: Right) => any;
  "==": (left: Left, right: Right) => any;
  "<": (left: Left, right: Right) => any;
  pos: (left: Left, right: Right) => any;
  neg: (left: Left, right: Right) => any;
  "++": (left: Left, right: Right) => any;
  "--": (left: Left, right: Right) => any;
  "~": (left: Left, right: Right) => any;
}
```

## OperatorFunctions.pos (function property)

```ts
pos: (left: Left, right: Right) => any;
```

## OperatorFunctions.neg (function property)

```ts
neg: (left: Left, right: Right) => any;
```

# SelfOperators (interface)

```ts
interface SelfOperators<T> extends Partial<OperatorFunctions<T, T>> {
  left?: undefined;
  right?: undefined;
}
```

## SelfOperators.left (undefined property)

```ts
left?: undefined;
```

## SelfOperators.right (undefined property)

```ts
right?: undefined;
```

# LeftOperators (interface)

```ts
interface LeftOperators<T, Left> extends Partial<OperatorFunctions<Left, T>> {
  left: {};
  right?: undefined;
}
```

## LeftOperators.left (object property)

```ts
left: {
}
```

## LeftOperators.right (undefined property)

```ts
right?: undefined;
```

# RightOperators (interface)

```ts
interface RightOperators<T, Right> extends Partial<
  OperatorFunctions<T, Right>
> {
  left?: undefined;
  right: {};
}
```

## RightOperators.left (undefined property)

```ts
left?: undefined;
```

## RightOperators.right (object property)

```ts
right: {
}
```

# OperatorsConstructor (interface)

```ts
interface OperatorsConstructor {
  <T>(
    selfOperators?: SelfOperators<T>,
    ...otherOperators: Array<LeftOperators<T, any> | RightOperators<T, any>>
  ): OperatorSet;
  create: <T>(
    selfOperators?: SelfOperators<T>,
    ...otherOperators: Array<LeftOperators<T, any> | RightOperators<T, any>>
  ) => OperatorSet;
  updateBigIntOperators(
    ops: Pick<OperatorFunctions<BigInt, BigInt>, "/" | "**">,
  ): void;
}
```

## OperatorsConstructor(...) (call signature)

Creates a new OperatorSet object, which should be placed on an object's
Symbol.operatorSet property.

```ts
<T>(selfOperators?: SelfOperators<T>, ...otherOperators: Array<LeftOperators<T, any> | RightOperators<T, any>>): OperatorSet;
```

## OperatorsConstructor.create (function property)

Creates a new OperatorSet object, which should be placed on an object's
Symbol.operatorSet property.

```ts
create: <T>(
  selfOperators?: SelfOperators<T>,
  ...otherOperators: Array<LeftOperators<T, any> | RightOperators<T, any>>
) => OperatorSet;
```

## OperatorsConstructor.updateBigIntOperators (method)

In math mode, the BigInt division and power operators can be overloaded by
using this function.

```ts
updateBigIntOperators(ops: Pick<OperatorFunctions<BigInt, BigInt>, "/" | "**">): void;
```

# Operators (OperatorsConstructor)

```ts
var Operators: OperatorsConstructor;
```

# Number (interface)

```ts
interface Number {
  [Symbol.operatorSet]: OperatorSet;
}
```

# Boolean (interface)

```ts
interface Boolean {
  [Symbol.operatorSet]: OperatorSet;
}
```

# String (interface)

```ts
interface String {
  [Symbol.operatorSet]: OperatorSet;
}
```

# BigInt (interface)

```ts
interface BigInt {
  [Symbol.operatorSet]: OperatorSet;
}
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

# BigFloatRoundingMode (type)

```ts
declare type BigFloatRoundingMode = number & {
  __is__: "BigFloatRoundingMode";
};
```

# BigFloatEnvConstructor (interface)

```ts
interface BigFloatEnvConstructor {
  new (precision?: number, roundingMode?: BigFloatRoundingMode): BigFloatEnv;
  get prec(): number;
  get expBits(): number;
  setPrec<Ret>(func: () => Ret, prec: number, expBits?: number): Ret;
  readonly precMin: number;
  readonly precMax: number;
  readonly expBitsMin: number;
  readonly expBitsMax: number;
  readonly RNDN: BigFloatRoundingMode;
  readonly RNDZ: BigFloatRoundingMode;
  readonly RNDD: BigFloatRoundingMode;
  readonly RNDU: BigFloatRoundingMode;
  readonly RNDNA: BigFloatRoundingMode;
  readonly RNDA: BigFloatRoundingMode;
  readonly RNDF: BigFloatRoundingMode;
  prototype: BigFloatEnv;
}
```

## BigFloatEnvConstructor new(...) (construct signature)

Creates a new floating point environment. Its status flags are reset.

- If unspecified, `precision` defaults to the precision from the global floating point environment.
- If unspecified, `roundingMode` defaults to RNDN.

```ts
new (precision?: number, roundingMode?: BigFloatRoundingMode): BigFloatEnv;
```

## BigFloatEnvConstructor.prec (getter)

The mantissa precision in bits of the global floating point environment.

The initial value is 113.

```ts
get prec(): number;
```

## BigFloatEnvConstructor.expBits (getter)

The exponent size in bits of the global floating point environment,
assuming an IEEE 754 representation.

The initial value is 15.

```ts
get expBits(): number;
```

## BigFloatEnvConstructor.setPrec (method)

Sets the mantissa precision of the global floating point environment to
`prec` and the exponent size to `expBits`, then calls the function `func`.
Then the precision and exponent size are reset to their previous values
and the return value of `func` is returned (or an exception is raised if
`func` raised an exception).

If expBits is undefined, it is set to [BigFloatEnv.expBitsMax](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorexpbitsmax-number-property).

- `@param` _func_ — The function to call within the modified environment
- `@param` _prec_ — The mantissa precision (in bits) to use in the modified environment
- `@param` _expBits_ — The exponent size (in bits) to use in the modified environment. Defaults to [BigFloatEnv.expBitsMax](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorexpbitsmax-number-property).

```ts
setPrec<Ret>(func: () => Ret, prec: number, expBits?: number): Ret;
```

## BigFloatEnvConstructor.precMin (readonly number property)

Integer; the minimum allowed precision. Must be at least 2.

```ts
readonly precMin: number;
```

## BigFloatEnvConstructor.precMax (readonly number property)

Integer; the maximum allowed precision. Must be at least 113.

```ts
readonly precMax: number;
```

## BigFloatEnvConstructor.expBitsMin (readonly number property)

Integer; the minimum allowed exponent size in bits. Must be at least 3.

```ts
readonly expBitsMin: number;
```

## BigFloatEnvConstructor.expBitsMax (readonly number property)

Integer; the maximum allowed exponent size in bits. Must be at least 15.

```ts
readonly expBitsMax: number;
```

## BigFloatEnvConstructor.RNDN (readonly BigFloatRoundingMode property)

Round to nearest, with ties to even rounding mode.

```ts
readonly RNDN: BigFloatRoundingMode;
```

## BigFloatEnvConstructor.RNDZ (readonly BigFloatRoundingMode property)

Round to zero rounding mode.

```ts
readonly RNDZ: BigFloatRoundingMode;
```

## BigFloatEnvConstructor.RNDD (readonly BigFloatRoundingMode property)

Round to -Infinity rounding mode.

```ts
readonly RNDD: BigFloatRoundingMode;
```

## BigFloatEnvConstructor.RNDU (readonly BigFloatRoundingMode property)

Round to +Infinity rounding mode.

```ts
readonly RNDU: BigFloatRoundingMode;
```

## BigFloatEnvConstructor.RNDNA (readonly BigFloatRoundingMode property)

Round to nearest, with ties away from zero rounding mode.

```ts
readonly RNDNA: BigFloatRoundingMode;
```

## BigFloatEnvConstructor.RNDA (readonly BigFloatRoundingMode property)

Round away from zero rounding mode.

```ts
readonly RNDA: BigFloatRoundingMode;
```

## BigFloatEnvConstructor.RNDF (readonly BigFloatRoundingMode property)

Faithful rounding mode. The result is non-deterministically rounded to
-Infinity or +Infinity.

This rounding mode usually gives a faster and deterministic running time
for the floating point operations.

```ts
readonly RNDF: BigFloatRoundingMode;
```

## BigFloatEnvConstructor.prototype (BigFloatEnv property)

```ts
prototype: BigFloatEnv;
```

# BigFloatEnv (BigFloatEnvConstructor)

```ts
var BigFloatEnv: BigFloatEnvConstructor;
```

# BigFloatEnv (interface)

A BigFloatEnv contains:

- the mantissa precision in bits
- the exponent size in bits assuming an IEEE 754 representation;
- the subnormal flag (if true, subnormal floating point numbers can be generated by the floating point operations).
- the rounding mode
- the floating point status. The status flags can only be set by the floating point operations. They can be reset with BigFloatEnv.prototype.clearStatus() or with the various status flag setters.

```ts
interface BigFloatEnv {
  get prec(): number;
  set prec(newValue: number);
  get expBits(): number;
  set expBits(newValue: number);
  get rndMode(): BigFloatRoundingMode;
  set rndMode(newMode: BigFloatRoundingMode);
  get subnormal(): boolean;
  set subnormal(newValue: boolean);
  get invalidOperation(): boolean;
  set invalidOperation(newValue: boolean);
  get divideByZero(): boolean;
  set divideByZero(newValue: boolean);
  get overflow(): boolean;
  set overflow(newValue: boolean);
  get underflow(): boolean;
  set underflow(newValue: boolean);
  get inexact(): boolean;
  set inexact(newValue: boolean);
  clearStatus(): void;
}
```

## BigFloatEnv.prec (getter)

The mantissa precision, in bits.

If precision was not specified as an argument to the BigFloatEnv
constructor, defaults to the precision value of the global floating-point
environment ([BigFloatEnv.prec](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorprec-getter)).

```ts
get prec(): number;
```

## BigFloatEnv.prec (setter)

```ts
set prec(newValue: number);
```

## BigFloatEnv.expBits (getter)

The exponent size in bits assuming an IEEE 754 representation.

Defaults to the exponent size of the global floating-point environment
([BigFloatEnv.expBits](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorexpbits-getter)).

```ts
get expBits(): number;
```

## BigFloatEnv.expBits (setter)

```ts
set expBits(newValue: number);
```

## BigFloatEnv.rndMode (getter)

The rounding mode.

If the rounding mode was not specified as an argument to the BigFloatEnv
constructor, defaults to [BigFloatEnv.RNDN](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorrndn-bigfloatroundingmode-property).

```ts
get rndMode(): BigFloatRoundingMode;
```

## BigFloatEnv.rndMode (setter)

```ts
set rndMode(newMode: BigFloatRoundingMode);
```

## BigFloatEnv.subnormal (getter)

subnormal flag. It is false when expBits = expBitsMax. Defaults to false.

```ts
get subnormal(): boolean;
```

## BigFloatEnv.subnormal (setter)

```ts
set subnormal(newValue: boolean);
```

## BigFloatEnv.invalidOperation (getter)

Status flag; cleared by `clearStatus`.

```ts
get invalidOperation(): boolean;
```

## BigFloatEnv.invalidOperation (setter)

```ts
set invalidOperation(newValue: boolean);
```

## BigFloatEnv.divideByZero (getter)

Status flag; cleared by `clearStatus`.

```ts
get divideByZero(): boolean;
```

## BigFloatEnv.divideByZero (setter)

```ts
set divideByZero(newValue: boolean);
```

## BigFloatEnv.overflow (getter)

Status flag; cleared by `clearStatus`.

```ts
get overflow(): boolean;
```

## BigFloatEnv.overflow (setter)

```ts
set overflow(newValue: boolean);
```

## BigFloatEnv.underflow (getter)

Status flag; cleared by `clearStatus`.

```ts
get underflow(): boolean;
```

## BigFloatEnv.underflow (setter)

```ts
set underflow(newValue: boolean);
```

## BigFloatEnv.inexact (getter)

Status flag; cleared by `clearStatus`.

```ts
get inexact(): boolean;
```

## BigFloatEnv.inexact (setter)

```ts
set inexact(newValue: boolean);
```

## BigFloatEnv.clearStatus (method)

Clear the status flags (invalidOperation, divideByZero, overflow,
underflow, and inexact).

```ts
clearStatus(): void;
```

# BigFloatConstructor (interface)

```ts
interface BigFloatConstructor {
  (value: number | string | BigInt | BigFloat): BigFloat;
  prototype: BigFloat;
  get LN2(): BigFloat;
  get PI(): BigFloat;
  get MIN_VALUE(): BigFloat;
  get MAX_VALUE(): BigFloat;
  get EPSILON(): BigFloat;
  fpRound(a: BigFloat, e?: BigFloatEnv): BigFloat;
  parseFloat(a: string, radix?: number, e?: BigFloatEnv): BigFloat;
  isFinite(a: BigFloat): boolean;
  isNaN(a: BigFloat): boolean;
  add(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;
  sub(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;
  mul(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;
  div(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;
  floor(x: BigFloat): BigFloat;
  ceil(x: BigFloat): BigFloat;
  round(x: BigFloat): BigFloat;
  trunc(x: BigFloat): BigFloat;
  abs(x: BigFloat): BigFloat;
  fmod(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
  remainder(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
  sqrt(x: BigFloat, e?: BigFloatEnv): BigFloat;
  sin(x: BigFloat, e?: BigFloatEnv): BigFloat;
  cos(x: BigFloat, e?: BigFloatEnv): BigFloat;
  tan(x: BigFloat, e?: BigFloatEnv): BigFloat;
  asin(x: BigFloat, e?: BigFloatEnv): BigFloat;
  acos(x: BigFloat, e?: BigFloatEnv): BigFloat;
  atan(x: BigFloat, e?: BigFloatEnv): BigFloat;
  atan2(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
  exp(x: BigFloat, e?: BigFloatEnv): BigFloat;
  log(x: BigFloat, e?: BigFloatEnv): BigFloat;
  pow(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
}
```

## BigFloatConstructor(...) (call signature)

If `value` is a numeric type, it is converted to BigFloat without rounding.

If `value`` is a string, it is converted to BigFloat using the precision of the global floating point environment ([BigFloatEnv.prec](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorprec-getter)).

```ts
(value: number | string | BigInt | BigFloat): BigFloat;
```

## BigFloatConstructor.prototype (BigFloat property)

```ts
prototype: BigFloat;
```

## BigFloatConstructor.LN2 (getter)

The value of [Math.LN2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2) rounded to nearest, ties to even with the
current global precision.

The constant values are cached for small precisions.

```ts
get LN2(): BigFloat;
```

## BigFloatConstructor.PI (getter)

The value of [Math.PI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI) rounded to nearest, ties to even with
the current global precision.

The constant values are cached for small precisions.

```ts
get PI(): BigFloat;
```

## BigFloatConstructor.MIN_VALUE (getter)

The value of [Number.MIN_VALUE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE) as a BigFloat.

```ts
get MIN_VALUE(): BigFloat;
```

## BigFloatConstructor.MAX_VALUE (getter)

The value of [Number.MAX_VALUE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE) as a BigFloat.

```ts
get MAX_VALUE(): BigFloat;
```

## BigFloatConstructor.EPSILON (getter)

The value of [Number.EPSILON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON) as a BigFloat.

```ts
get EPSILON(): BigFloat;
```

## BigFloatConstructor.fpRound (method)

Rounds the floating point number `a` according to the floating point
environment `e` or the global environment if `e` is undefined.

```ts
fpRound(a: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.parseFloat (method)

Parses the string `a` as a floating point number in radix `radix`.

The radix is 0 (default) or from 2 to 36. The radix 0 means radix 10
unless there is a hexadecimal or binary prefix.

The result is rounded according to the floating point environment `e` or
the global environment if `e` is undefined.

```ts
parseFloat(a: string, radix?: number, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.isFinite (method)

Returns true if `a` is a finite bigfloat. Returns false otherwise.

```ts
isFinite(a: BigFloat): boolean;
```

## BigFloatConstructor.isNaN (method)

Returns true if a is a NaN bigfloat. Returns false otherwise.

```ts
isNaN(a: BigFloat): boolean;
```

## BigFloatConstructor.add (method)

Adds `a` and `b` together and rounds the resulting floating point number
according to the floating point environment `e`, or the global environment
if e is undefined.

If `e` is specified, the floating point status flags on `e` are updated.

```ts
add(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.sub (method)

Subtracts `b` from `a` and rounds the resulting floating point number
according to the floating point environment `e`, or the global environment
if e is undefined.

If `e` is specified, the floating point status flags on `e` are updated.

```ts
sub(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.mul (method)

Multiplies `a` and `b` together and rounds the resulting floating point
number according to the floating point environment `e`, or the global
environment if e is undefined.

If `e` is specified, the floating point status flags on `e` are updated.

```ts
mul(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.div (method)

Divides `a` by `b` and rounds the resulting floating point number
according to the floating point environment `e`, or the global environment
if e is undefined.

If `e` is specified, the floating point status flags on `e` are updated.

```ts
div(a: BigFloat, b: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.floor (method)

Rounds `x` down to the nearest integer.

No additional rounding (ie. BigFloatEnv-related rounding) is performed.

```ts
floor(x: BigFloat): BigFloat;
```

## BigFloatConstructor.ceil (method)

Rounds `x` up to the nearest integer.

No additional rounding (ie. BigFloatEnv-related rounding) is performed.

```ts
ceil(x: BigFloat): BigFloat;
```

## BigFloatConstructor.round (method)

Rounds `x` to the nearest integer.

No additional rounding (ie. BigFloatEnv-related rounding) is performed.

```ts
round(x: BigFloat): BigFloat;
```

## BigFloatConstructor.trunc (method)

Truncates the fractional part of `x`, resulting in an integer.

No additional rounding (ie. BigFloatEnv-related rounding) is performed.

```ts
trunc(x: BigFloat): BigFloat;
```

## BigFloatConstructor.abs (method)

Returns the absolute value of `x`.

No additional rounding (ie. BigFloatEnv-related rounding) is performed.

```ts
abs(x: BigFloat): BigFloat;
```

## BigFloatConstructor.fmod (method)

Floating point remainder. The quotient is truncated to zero.

`e` is an optional floating point environment.

```ts
fmod(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.remainder (method)

Floating point remainder. The quotient is rounded to the nearest integer
with ties to even.

`e` is an optional floating point environment.

```ts
remainder(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.sqrt (method)

Square root. Returns a rounded floating point number.

e is an optional floating point environment.

```ts
sqrt(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.sin (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
sin(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.cos (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
cos(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.tan (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
tan(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.asin (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
asin(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.acos (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
acos(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.atan (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
atan(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.atan2 (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
atan2(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.exp (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
exp(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.log (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
log(x: BigFloat, e?: BigFloatEnv): BigFloat;
```

## BigFloatConstructor.pow (method)

Returns a rounded floating point number.

`e` is an optional floating point environment.

```ts
pow(x: BigFloat, y: BigFloat, e?: BigFloatEnv): BigFloat;
```

# BigFloat (BigFloatConstructor)

```ts
var BigFloat: BigFloatConstructor;
```

# BigFloat (interface)

The BigFloat type represents floating point numbers in base 2 with the IEEE 754 semantics.

A floating point number is represented as a sign, mantissa and exponent.

The special values NaN, +/-Infinity, +0 and -0 are supported.

The mantissa and exponent can have any bit length with an implementation specific minimum and maximum.

```ts
interface BigFloat {
  valueOf(): BigFloat;
  toString(radix?: number): string;
  toPrecision(
    precision: number,
    roundingMode?: BigFloatRoundingMode,
    radix?: number,
  ): string;
  toFixed(
    fractionDigits: number,
    roundingMode?: BigFloatRoundingMode,
    radix?: number,
  ): string;
  toExponential(
    fractionDigits: number,
    roundingMode?: BigFloatRoundingMode,
    radix?: number,
  ): string;
  [Symbol.typeofValue]: () => "bigfloat";
}
```

## BigFloat.valueOf (method)

```ts
valueOf(): BigFloat;
```

## BigFloat.toString (method)

radix must be between 2 and 36

```ts
toString(radix?: number): string;
```

## BigFloat.toPrecision (method)

Returns a string containing a number represented either in exponential or
fixed-point notation with a specified number of digits.

- `@param` _precision_ — Number of significant digits. There is no range limit on this number.
- `@param` _roundingMode_ — The rounding mode to use when representing the value. Defaults to [BigFloatEnv.RNDNA](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorrndna-bigfloatroundingmode-property).
- `@param` _radix_ — The base to use when representing the value. Must be an integer between 2 and 36. Defaults to 10.

```ts
toPrecision(precision: number, roundingMode?: BigFloatRoundingMode, radix?: number): string;
```

## BigFloat.toFixed (method)

Returns a string representing a number in fixed-point notation.

- `@param` _fractionDigits_ — Number of digits after the decimal point. There is no range limit on this number.
- `@param` _roundingMode_ — The rounding mode to use when representing the value. Defaults to [BigFloatEnv.RNDNA](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorrndna-bigfloatroundingmode-property).
- `@param` _radix_ — The base to use when representing the value. Must be an integer between 2 and 36. Defaults to 10.

```ts
toFixed(fractionDigits: number, roundingMode?: BigFloatRoundingMode, radix?: number): string;
```

## BigFloat.toExponential (method)

Returns a string containing a number represented in exponential notation.

- `@param` _fractionDigits_ — Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
- `@param` _roundingMode_ — The rounding mode to use when representing the value. Defaults to [BigFloatEnv.RNDNA](/meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorrndna-bigfloatroundingmode-property).
- `@param` _radix_ — The base to use when representing the value. Must be an integer between 2 and 36. Defaults to 10.

```ts
toExponential(fractionDigits: number, roundingMode?: BigFloatRoundingMode, radix?: number): string;
```

# BigDecimalRoundingMode (type)

```ts
declare type BigDecimalRoundingMode =
  | "floor"
  | "ceiling"
  | "down"
  | "up"
  | "half-even"
  | "half-up";
```

# BigDecimalRoundingObject (type)

```ts
declare type BigDecimalRoundingObject =
  | {
      maximumSignificantDigits: number;
      roundingMode: BigDecimalRoundingMode;
    }
  | {
      maximumFractionDigits: number;
      roundingMode: BigDecimalRoundingMode;
    };
```

# BigDecimalConstructor (interface)

```ts
interface BigDecimalConstructor {
  (): BigDecimal;
  (value: number | string | BigInt | BigFloat): BigDecimal;
  add(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
  sub(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
  mul(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
  div(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
  mod(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
  sqrt(a: BigDecimal, e: BigDecimalRoundingObject): BigDecimal;
  round(a: BigDecimal, e: BigDecimalRoundingObject): BigDecimal;
  prototype: BigDecimal;
}
```

## BigDecimalConstructor(...) (call signature)

```ts
(): BigDecimal;
```

## BigDecimalConstructor(...) (call signature)

```ts
(value: number | string | BigInt | BigFloat): BigDecimal;
```

## BigDecimalConstructor.add (method)

Adds together `a` and `b` and rounds the result according to the rounding
object `e`. If the rounding object is not present, the operation is
executed with infinite precision; in other words, no rounding occurs when
the rounding object is not present.

```ts
add(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
```

## BigDecimalConstructor.sub (method)

Subtracts `b` from `a` and rounds the result according to the rounding
object `e`. If the rounding object is not present, the operation is
executed with infinite precision; in other words, no rounding occurs when
the rounding object is not present.

```ts
sub(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
```

## BigDecimalConstructor.mul (method)

Multiplies together `a` and `b` and rounds the result according to the
rounding object `e`. If the rounding object is not present, the operation
is executed with infinite precision; in other words, no rounding occurs
when the rounding object is not present.

```ts
mul(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
```

## BigDecimalConstructor.div (method)

Divides `a` by `b` and rounds the result according to the rounding object
`e`.

If the rounding object is not present, an attempt is made to perform the
operation with infinite precision. However, not all quotients can be
represented with infinite precision. If the quotient cannot be represented
with infinite precision, a RangeError is thrown.

A RangeError is thrown when dividing by zero.

```ts
div(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
```

## BigDecimalConstructor.mod (method)

Perform the modulo operation of `a` by `b` and round the result according
to the rounding object `e`. If the rounding object is not present, the
operation is executed with infinite precision; in other words, no rounding
occurs when the rounding object is not present.

```ts
mod(a: BigDecimal, b: BigDecimal, e?: BigDecimalRoundingObject): BigDecimal;
```

## BigDecimalConstructor.sqrt (method)

Obtain the square root of `a`, rounding the result according to the
rounding object `e`.

If `a` is less than zero, a RangeError will be thrown.

Note that the rounding object is _required_.

```ts
sqrt(a: BigDecimal, e: BigDecimalRoundingObject): BigDecimal;
```

## BigDecimalConstructor.round (method)

Rounds `a` using the rounding object `e`.

```ts
round(a: BigDecimal, e: BigDecimalRoundingObject): BigDecimal;
```

## BigDecimalConstructor.prototype (BigDecimal property)

```ts
prototype: BigDecimal;
```

# BigDecimal (BigDecimalConstructor)

```ts
var BigDecimal: BigDecimalConstructor;
```

# BigDecimal (interface)

The BigDecimal type represents floating point numbers in base 10.

It is inspired from the proposal available at https://github.com/littledan/proposal-bigdecimal.

The BigDecimal floating point numbers are always normalized and finite.
There is no concept of -0, Infinity or NaN. By default, all the computations
are done with infinite precision.

```ts
interface BigDecimal {
  valueOf(): BigDecimal;
  toString(): string;
  toPrecision(precision: number, roundingMode?: BigDecimalRoundingMode): string;
  toFixed(
    fractionDigits: number,
    roundingMode?: BigDecimalRoundingMode,
  ): string;
  toExponential(
    fractionDigits: number,
    roundingMode?: BigDecimalRoundingMode,
  ): string;
}
```

## BigDecimal.valueOf (method)

Returns the bigdecimal primitive value corresponding to this BigDecimal.

```ts
valueOf(): BigDecimal;
```

## BigDecimal.toString (method)

Converts this BigDecimal to a string with infinite precision in base 10.

```ts
toString(): string;
```

## BigDecimal.toPrecision (method)

Returns a string containing a number represented either in exponential or
fixed-point notation with a specified number of digits.

- `@param` _precision_ — Number of significant digits. There is no range limit on this number.
- `@param` _roundingMode_ — The rounding mode to use when representing the value. Defaults to "half-up".

```ts
toPrecision(precision: number, roundingMode?: BigDecimalRoundingMode): string;
```

## BigDecimal.toFixed (method)

Returns a string representing a number in fixed-point notation.

- `@param` _fractionDigits_ — Number of digits after the decimal point. There is no range limit on this number.
- `@param` _roundingMode_ — The rounding mode to use when representing the value. Defaults to "half-up".

```ts
toFixed(fractionDigits: number, roundingMode?: BigDecimalRoundingMode): string;
```

## BigDecimal.toExponential (method)

Returns a string containing a number represented in exponential notation.

- `@param` _fractionDigits_ — Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
- `@param` _roundingMode_ — The rounding mode to use when representing the value. Defaults to "half-up".

```ts
toExponential(fractionDigits: number, roundingMode?: BigDecimalRoundingMode): string;
```
