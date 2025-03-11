- [types (object)](#types-object)
  - [types.any (property)](#typesany-property)
  - [types.unknown (property)](#typesunknown-property)
  - [types.anyObject (property)](#typesanyobject-property)
  - [types.unknownObject (property)](#typesunknownobject-property)
  - [types.object (property)](#typesobject-property)
  - [types.Object (property)](#typesobject-property)
  - [types.arrayOfAny (property)](#typesarrayofany-property)
  - [types.arrayOfUnknown (property)](#typesarrayofunknown-property)
  - [types.array (property)](#typesarray-property)
  - [types.Array (property)](#typesarray-property)
  - [types.anyArray (property)](#typesanyarray-property)
  - [types.boolean (property)](#typesboolean-property)
  - [types.Boolean (property)](#typesboolean-property)
  - [types.string (property)](#typesstring-property)
  - [types.String (property)](#typesstring-property)
  - [types.null (property)](#typesnull-property)
  - [types.undefined (property)](#typesundefined-property)
  - [types.nullish (property)](#typesnullish-property)
  - [types.void (property)](#typesvoid-property)
  - [types.numberIncludingNanAndInfinities (property)](#typesnumberincludingnanandinfinities-property)
  - [types.number (property)](#typesnumber-property)
  - [types.Number (property)](#typesnumber-property)
  - [types.NaN (property)](#typesnan-property)
  - [types.Infinity (property)](#typesinfinity-property)
  - [types.NegativeInfinity (property)](#typesnegativeinfinity-property)
  - [types.integer (property)](#typesinteger-property)
  - [types.bigint (property)](#typesbigint-property)
  - [types.BigInt (property)](#typesbigint-property)
  - [types.never (property)](#typesnever-property)
  - [types.anyFunction (property)](#typesanyfunction-property)
  - [types.unknownFunction (property)](#typesunknownfunction-property)
  - [types.Function (property)](#typesfunction-property)
  - [types.false (property)](#typesfalse-property)
  - [types.true (property)](#typestrue-property)
  - [types.falsy (property)](#typesfalsy-property)
  - [types.truthy (function property)](#typestruthy-function-property)
  - [types.nonNullOrUndefined (function property)](#typesnonnullorundefined-function-property)
  - [types.Error (property)](#typeserror-property)
  - [types.Symbol (property)](#typessymbol-property)
  - [types.symbol (property)](#typessymbol-property)
  - [types.RegExp (property)](#typesregexp-property)
  - [types.Date (property)](#typesdate-property)
  - [types.anyMap (property)](#typesanymap-property)
  - [types.unknownMap (property)](#typesunknownmap-property)
  - [types.map (property)](#typesmap-property)
  - [types.Map (property)](#typesmap-property)
  - [types.anySet (property)](#typesanyset-property)
  - [types.unknownSet (property)](#typesunknownset-property)
  - [types.set (property)](#typesset-property)
  - [types.Set (property)](#typesset-property)
  - [types.ArrayBuffer (property)](#typesarraybuffer-property)
  - [types.SharedArrayBuffer (property)](#typessharedarraybuffer-property)
  - [types.DataView (property)](#typesdataview-property)
  - [types.TypedArray (property)](#typestypedarray-property)
  - [types.Int8Array (property)](#typesint8array-property)
  - [types.Uint8Array (property)](#typesuint8array-property)
  - [types.Uint8ClampedArray (property)](#typesuint8clampedarray-property)
  - [types.Int16Array (property)](#typesint16array-property)
  - [types.Uint16Array (property)](#typesuint16array-property)
  - [types.Int32Array (property)](#typesint32array-property)
  - [types.Uint32Array (property)](#typesuint32array-property)
  - [types.Float32Array (property)](#typesfloat32array-property)
  - [types.Float64Array (property)](#typesfloat64array-property)
  - [types.exactString (method)](#typesexactstring-method)
  - [types.exactNumber (method)](#typesexactnumber-method)
  - [types.exactBigInt (method)](#typesexactbigint-method)
  - [types.exactSymbol (method)](#typesexactsymbol-method)
  - [types.hasClassName (method)](#typeshasclassname-method)
  - [types.hasToStringTag (method)](#typeshastostringtag-method)
  - [types.instanceOf (method)](#typesinstanceof-method)
  - [types.stringMatching (method)](#typesstringmatching-method)
  - [types.symbolFor (method)](#typessymbolfor-method)
  - [types.arrayOf (method)](#typesarrayof-method)
  - [types.intersection (function property)](#typesintersection-function-property)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature-1)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature-2)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature-3)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature-4)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature-5)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature-6)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature-7)
    - [types.intersection(...) (call signature)](#typesintersection-call-signature-8)
  - [types.and (function property)](#typesand-function-property)
    - [types.and(...) (call signature)](#typesand-call-signature)
    - [types.and(...) (call signature)](#typesand-call-signature-1)
    - [types.and(...) (call signature)](#typesand-call-signature-2)
    - [types.and(...) (call signature)](#typesand-call-signature-3)
    - [types.and(...) (call signature)](#typesand-call-signature-4)
    - [types.and(...) (call signature)](#typesand-call-signature-5)
    - [types.and(...) (call signature)](#typesand-call-signature-6)
    - [types.and(...) (call signature)](#typesand-call-signature-7)
    - [types.and(...) (call signature)](#typesand-call-signature-8)
  - [types.union (function property)](#typesunion-function-property)
    - [types.union(...) (call signature)](#typesunion-call-signature)
    - [types.union(...) (call signature)](#typesunion-call-signature-1)
    - [types.union(...) (call signature)](#typesunion-call-signature-2)
    - [types.union(...) (call signature)](#typesunion-call-signature-3)
    - [types.union(...) (call signature)](#typesunion-call-signature-4)
    - [types.union(...) (call signature)](#typesunion-call-signature-5)
    - [types.union(...) (call signature)](#typesunion-call-signature-6)
    - [types.union(...) (call signature)](#typesunion-call-signature-7)
    - [types.union(...) (call signature)](#typesunion-call-signature-8)
  - [types.or (function property)](#typesor-function-property)
    - [types.or(...) (call signature)](#typesor-call-signature)
    - [types.or(...) (call signature)](#typesor-call-signature-1)
    - [types.or(...) (call signature)](#typesor-call-signature-2)
    - [types.or(...) (call signature)](#typesor-call-signature-3)
    - [types.or(...) (call signature)](#typesor-call-signature-4)
    - [types.or(...) (call signature)](#typesor-call-signature-5)
    - [types.or(...) (call signature)](#typesor-call-signature-6)
    - [types.or(...) (call signature)](#typesor-call-signature-7)
    - [types.or(...) (call signature)](#typesor-call-signature-8)
  - [types.mapOf (method)](#typesmapof-method)
  - [types.setOf (method)](#typessetof-method)
  - [types.maybe (method)](#typesmaybe-method)
  - [types.objectWithProperties (method)](#typesobjectwithproperties-method)
  - [types.objectWithOnlyTheseProperties (method)](#typesobjectwithonlytheseproperties-method)
  - [types.mappingObjectOf (method)](#typesmappingobjectof-method)
  - [types.record (method)](#typesrecord-method)
  - [types.partialObjectWithProperties (method)](#typespartialobjectwithproperties-method)
  - [types.tuple (function property)](#typestuple-function-property)
    - [types.tuple(...) (call signature)](#typestuple-call-signature)
    - [types.tuple(...) (call signature)](#typestuple-call-signature-1)
    - [types.tuple(...) (call signature)](#typestuple-call-signature-2)
    - [types.tuple(...) (call signature)](#typestuple-call-signature-3)
    - [types.tuple(...) (call signature)](#typestuple-call-signature-4)
    - [types.tuple(...) (call signature)](#typestuple-call-signature-5)
    - [types.tuple(...) (call signature)](#typestuple-call-signature-6)
    - [types.tuple(...) (call signature)](#typestuple-call-signature-7)
    - [types.tuple(...) (call signature)](#typestuple-call-signature-8)
  - [types.coerce (function property)](#typescoerce-function-property)
  - [types.FILE (property)](#typesfile-property)
  - [types.Path (property)](#typespath-property)
  - [types.JSX (object property)](#typesjsx-object-property)
    - [types.JSX.unknownElement (property)](#typesjsxunknownelement-property)
    - [types.JSX.anyElement (property)](#typesjsxanyelement-property)
    - [types.JSX.Element (property)](#typesjsxelement-property)
    - [types.JSX.Fragment (property)](#typesjsxfragment-property)
- [TypeValidator (type)](#typevalidator-type)
- [CoerceToTypeValidator (type)](#coercetotypevalidator-type)
- [CoerceableToTypeValidator (type)](#coerceabletotypevalidator-type)
- [UnwrapTypeFromCoerceableOrValidator (type)](#unwraptypefromcoerceableorvalidator-type)

# types (object)

```ts
const types: {
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
  exactString<T extends string>(str: T): TypeValidator<T>;
  exactNumber<T extends number>(num: T): TypeValidator<T>;
  exactBigInt<T extends bigint>(num: T): TypeValidator<T>;
  exactSymbol<T extends symbol>(sym: T): TypeValidator<T>;
  hasClassName<Name extends string>(
    name: Name
  ): TypeValidator<{
    constructor: Function & {
      name: Name;
    };
  }>;
  hasToStringTag(name: string): TypeValidator<any>;
  instanceOf<
    Klass extends Function & {
      prototype: any;
    }
  >(
    klass: Klass
  ): TypeValidator<Klass["prototype"]>;
  stringMatching(regexp: RegExp): TypeValidator<string>;
  symbolFor(key: string): TypeValidator<symbol>;
  arrayOf<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(
    typeValidator: T
  ): TypeValidator<Array<UnwrapTypeFromCoerceableOrValidator<T>>>;
  intersection: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth> &
        UnwrapTypeFromCoerceableOrValidator<Ninth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth> &
        UnwrapTypeFromCoerceableOrValidator<Ninth> &
        UnwrapTypeFromCoerceableOrValidator<Tenth>
    >;
  };
  and: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth> &
        UnwrapTypeFromCoerceableOrValidator<Ninth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      UnwrapTypeFromCoerceableOrValidator<First> &
        UnwrapTypeFromCoerceableOrValidator<Second> &
        UnwrapTypeFromCoerceableOrValidator<Third> &
        UnwrapTypeFromCoerceableOrValidator<Fourth> &
        UnwrapTypeFromCoerceableOrValidator<Fifth> &
        UnwrapTypeFromCoerceableOrValidator<Sixth> &
        UnwrapTypeFromCoerceableOrValidator<Seventh> &
        UnwrapTypeFromCoerceableOrValidator<Eighth> &
        UnwrapTypeFromCoerceableOrValidator<Ninth> &
        UnwrapTypeFromCoerceableOrValidator<Tenth>
    >;
  };
  union: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
      | UnwrapTypeFromCoerceableOrValidator<Ninth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
      | UnwrapTypeFromCoerceableOrValidator<Ninth>
      | UnwrapTypeFromCoerceableOrValidator<Tenth>
    >;
  };
  or: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
      | UnwrapTypeFromCoerceableOrValidator<Ninth>
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      | UnwrapTypeFromCoerceableOrValidator<First>
      | UnwrapTypeFromCoerceableOrValidator<Second>
      | UnwrapTypeFromCoerceableOrValidator<Third>
      | UnwrapTypeFromCoerceableOrValidator<Fourth>
      | UnwrapTypeFromCoerceableOrValidator<Fifth>
      | UnwrapTypeFromCoerceableOrValidator<Sixth>
      | UnwrapTypeFromCoerceableOrValidator<Seventh>
      | UnwrapTypeFromCoerceableOrValidator<Eighth>
      | UnwrapTypeFromCoerceableOrValidator<Ninth>
      | UnwrapTypeFromCoerceableOrValidator<Tenth>
    >;
  };
  mapOf<
    K extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
    V extends TypeValidator<any> | CoerceableToTypeValidator | unknown
  >(
    keyType: K,
    valueType: V
  ): TypeValidator<
    Map<
      UnwrapTypeFromCoerceableOrValidator<K>,
      UnwrapTypeFromCoerceableOrValidator<V>
    >
  >;
  setOf<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(
    itemType: T
  ): TypeValidator<Set<UnwrapTypeFromCoerceableOrValidator<T>>>;
  maybe<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(
    itemType: T
  ): TypeValidator<UnwrapTypeFromCoerceableOrValidator<T> | undefined | null>;
  objectWithProperties<
    T extends {
      [key: string | number | symbol]:
        | TypeValidator<any>
        | CoerceableToTypeValidator
        | unknown;
    }
  >(
    properties: T
  ): TypeValidator<{
    [key in keyof T]: UnwrapTypeFromCoerceableOrValidator<T[key]>;
  }>;
  objectWithOnlyTheseProperties<
    T extends {
      [key: string | number | symbol]:
        | TypeValidator<any>
        | CoerceableToTypeValidator
        | unknown;
    }
  >(
    properties: T
  ): TypeValidator<{
    [key in keyof T]: UnwrapTypeFromCoerceableOrValidator<T[key]>;
  }>;
  mappingObjectOf<
    Values extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
    Keys extends TypeValidator<any> | CoerceableToTypeValidator | unknown
  >(
    keyType: Keys,
    valueType: Values
  ): TypeValidator<
    Record<
      UnwrapTypeFromCoerceableOrValidator<Keys> extends string | number | symbol
        ? UnwrapTypeFromCoerceableOrValidator<Keys>
        : never,
      UnwrapTypeFromCoerceableOrValidator<Values>
    >
  >;
  record<
    Values extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
    Keys extends TypeValidator<any> | CoerceableToTypeValidator | unknown
  >(
    keyType: Keys,
    valueType: Values
  ): TypeValidator<
    Record<
      UnwrapTypeFromCoerceableOrValidator<Keys> extends string | number | symbol
        ? UnwrapTypeFromCoerceableOrValidator<Keys>
        : never,
      UnwrapTypeFromCoerceableOrValidator<Values>
    >
  >;
  partialObjectWithProperties<
    T extends {
      [key: string | number | symbol]:
        | TypeValidator<any>
        | CoerceableToTypeValidator
        | unknown;
    }
  >(
    properties: T
  ): TypeValidator<{
    [key in keyof T]:
      | UnwrapTypeFromCoerceableOrValidator<T[key]>
      | null
      | undefined;
  }>;
  tuple: {
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>,
        UnwrapTypeFromCoerceableOrValidator<Seventh>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>,
        UnwrapTypeFromCoerceableOrValidator<Seventh>,
        UnwrapTypeFromCoerceableOrValidator<Eighth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>,
        UnwrapTypeFromCoerceableOrValidator<Seventh>,
        UnwrapTypeFromCoerceableOrValidator<Eighth>,
        UnwrapTypeFromCoerceableOrValidator<Ninth>
      ]
    >;
    <
      First extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown,
      Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown
    >(
      first: First,
      second: Second,
      third: Third,
      fourth: Fourth,
      fifth: Fifth,
      sixth: Sixth,
      seventh: Seventh,
      eighth: Eighth,
      ninth: Ninth,
      tenth: Tenth
    ): TypeValidator<
      [
        UnwrapTypeFromCoerceableOrValidator<First>,
        UnwrapTypeFromCoerceableOrValidator<Second>,
        UnwrapTypeFromCoerceableOrValidator<Third>,
        UnwrapTypeFromCoerceableOrValidator<Fourth>,
        UnwrapTypeFromCoerceableOrValidator<Fifth>,
        UnwrapTypeFromCoerceableOrValidator<Sixth>,
        UnwrapTypeFromCoerceableOrValidator<Seventh>,
        UnwrapTypeFromCoerceableOrValidator<Eighth>,
        UnwrapTypeFromCoerceableOrValidator<Ninth>,
        UnwrapTypeFromCoerceableOrValidator<Tenth>
      ]
    >;
  };
  coerce: <V extends CoerceableToTypeValidator | TypeValidator<any> | unknown>(
    value: V
  ) => TypeValidator<UnwrapTypeFromCoerceableOrValidator<V>>;
  FILE: TypeValidator<FILE>;
  Path: TypeValidator<Path>;
  JSX: {
    unknownElement: TypeValidator<
      JSX.Element<
        {
          [key: string | symbol | number]: unknown;
        },
        unknown
      >
    >;
    anyElement: TypeValidator<JSX.Element<any, any>>;
    Element: TypeValidator<
      JSX.Element<
        {
          [key: string | symbol | number]: unknown;
        },
        unknown
      >
    >;
    Fragment: TypeValidator<JSX.Fragment>;
  };
};
```

## types.any (property)

```ts
any: TypeValidator<any>;
```

## types.unknown (property)

```ts
unknown: TypeValidator<unknown>;
```

## types.anyObject (property)

```ts
anyObject: TypeValidator<{
  [key: string | number | symbol]: any;
}>;
```

## types.unknownObject (property)

```ts
unknownObject: TypeValidator<{}>;
```

## types.object (property)

```ts
object: TypeValidator<{}>;
```

## types.Object (property)

```ts
Object: TypeValidator<{}>;
```

## types.arrayOfAny (property)

```ts
arrayOfAny: TypeValidator<Array<any>>;
```

## types.arrayOfUnknown (property)

```ts
arrayOfUnknown: TypeValidator<Array<unknown>>;
```

## types.array (property)

```ts
array: TypeValidator<Array<unknown>>;
```

## types.Array (property)

```ts
Array: TypeValidator<unknown[]>;
```

## types.anyArray (property)

```ts
anyArray: TypeValidator<Array<any>>;
```

## types.boolean (property)

```ts
boolean: TypeValidator<boolean>;
```

## types.Boolean (property)

```ts
Boolean: TypeValidator<boolean>;
```

## types.string (property)

```ts
string: TypeValidator<string>;
```

## types.String (property)

```ts
String: TypeValidator<string>;
```

## types.null (property)

```ts
null: TypeValidator<null>;
```

## types.undefined (property)

```ts
undefined: TypeValidator<undefined>;
```

## types.nullish (property)

```ts
nullish: TypeValidator<null | undefined>;
```

## types.void (property)

```ts
void: TypeValidator<null | undefined>;
```

## types.numberIncludingNanAndInfinities (property)

```ts
numberIncludingNanAndInfinities: TypeValidator<number>;
```

## types.number (property)

```ts
number: TypeValidator<number>;
```

## types.Number (property)

```ts
Number: TypeValidator<number>;
```

## types.NaN (property)

```ts
NaN: TypeValidator<number>;
```

## types.Infinity (property)

```ts
Infinity: TypeValidator<number>;
```

## types.NegativeInfinity (property)

```ts
NegativeInfinity: TypeValidator<number>;
```

## types.integer (property)

```ts
integer: TypeValidator<number>;
```

## types.bigint (property)

```ts
bigint: TypeValidator<bigint>;
```

## types.BigInt (property)

```ts
BigInt: TypeValidator<bigint>;
```

## types.never (property)

```ts
never: TypeValidator<never>;
```

## types.anyFunction (property)

```ts
anyFunction: TypeValidator<(...args: any) => any>;
```

## types.unknownFunction (property)

```ts
unknownFunction: TypeValidator<(...args: Array<unknown>) => unknown>;
```

## types.Function (property)

```ts
Function: TypeValidator<(...args: Array<unknown>) => unknown>;
```

## types.false (property)

```ts
false: TypeValidator<false>;
```

## types.true (property)

```ts
true: TypeValidator<true>;
```

## types.falsy (property)

```ts
falsy: TypeValidator<false | null | undefined | "" | 0>;
```

## types.truthy (function property)

```ts
truthy: <T>(target: false | "" | 0 | T | null | undefined) => target is T;
```

## types.nonNullOrUndefined (function property)

```ts
nonNullOrUndefined: <T>(target: T | null | undefined) => target is T;
```

## types.Error (property)

```ts
Error: TypeValidator<Error>;
```

## types.Symbol (property)

```ts
Symbol: TypeValidator<symbol>;
```

## types.symbol (property)

```ts
symbol: TypeValidator<symbol>;
```

## types.RegExp (property)

```ts
RegExp: TypeValidator<RegExp>;
```

## types.Date (property)

```ts
Date: TypeValidator<Date>;
```

## types.anyMap (property)

```ts
anyMap: TypeValidator<Map<any, any>>;
```

## types.unknownMap (property)

```ts
unknownMap: TypeValidator<Map<unknown, unknown>>;
```

## types.map (property)

```ts
map: TypeValidator<Map<unknown, unknown>>;
```

## types.Map (property)

```ts
Map: TypeValidator<Map<unknown, unknown>>;
```

## types.anySet (property)

```ts
anySet: TypeValidator<Set<any>>;
```

## types.unknownSet (property)

```ts
unknownSet: TypeValidator<Set<unknown>>;
```

## types.set (property)

```ts
set: TypeValidator<Set<unknown>>;
```

## types.Set (property)

```ts
Set: TypeValidator<Set<unknown>>;
```

## types.ArrayBuffer (property)

```ts
ArrayBuffer: TypeValidator<ArrayBuffer>;
```

## types.SharedArrayBuffer (property)

```ts
SharedArrayBuffer: TypeValidator<SharedArrayBuffer>;
```

## types.DataView (property)

```ts
DataView: TypeValidator<DataView>;
```

## types.TypedArray (property)

```ts
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
```

## types.Int8Array (property)

```ts
Int8Array: TypeValidator<Int8Array>;
```

## types.Uint8Array (property)

```ts
Uint8Array: TypeValidator<Uint8Array>;
```

## types.Uint8ClampedArray (property)

```ts
Uint8ClampedArray: TypeValidator<Uint8ClampedArray>;
```

## types.Int16Array (property)

```ts
Int16Array: TypeValidator<Int16Array>;
```

## types.Uint16Array (property)

```ts
Uint16Array: TypeValidator<Uint16Array>;
```

## types.Int32Array (property)

```ts
Int32Array: TypeValidator<Int32Array>;
```

## types.Uint32Array (property)

```ts
Uint32Array: TypeValidator<Uint32Array>;
```

## types.Float32Array (property)

```ts
Float32Array: TypeValidator<Float32Array>;
```

## types.Float64Array (property)

```ts
Float64Array: TypeValidator<Float64Array>;
```

## types.exactString (method)

```ts
exactString<T extends string>(str: T): TypeValidator<T>;
```

## types.exactNumber (method)

```ts
exactNumber<T extends number>(num: T): TypeValidator<T>;
```

## types.exactBigInt (method)

```ts
exactBigInt<T extends bigint>(num: T): TypeValidator<T>;
```

## types.exactSymbol (method)

```ts
exactSymbol<T extends symbol>(sym: T): TypeValidator<T>;
```

## types.hasClassName (method)

```ts
hasClassName<Name extends string>(name: Name): TypeValidator<{
  constructor: Function & {
    name: Name;
  };
}>;
```

## types.hasToStringTag (method)

```ts
hasToStringTag(name: string): TypeValidator<any>;
```

## types.instanceOf (method)

```ts
instanceOf<Klass extends Function & {
  prototype: any;
}>(klass: Klass): TypeValidator<Klass["prototype"]>;
```

## types.stringMatching (method)

```ts
stringMatching(regexp: RegExp): TypeValidator<string>;
```

## types.symbolFor (method)

```ts
symbolFor(key: string): TypeValidator<symbol>;
```

## types.arrayOf (method)

```ts
arrayOf<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(typeValidator: T): TypeValidator<Array<UnwrapTypeFromCoerceableOrValidator<T>>>;
```

## types.intersection (function property)

```ts
intersection: {
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth> & UnwrapTypeFromCoerceableOrValidator<Ninth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth> & UnwrapTypeFromCoerceableOrValidator<Ninth> & UnwrapTypeFromCoerceableOrValidator<Tenth>>;
};
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second>>;
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third>>;
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth>>;
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth>>;
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth>>;
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh>>;
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth>>;
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth> & UnwrapTypeFromCoerceableOrValidator<Ninth>>;
```

### types.intersection(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth> & UnwrapTypeFromCoerceableOrValidator<Ninth> & UnwrapTypeFromCoerceableOrValidator<Tenth>>;
```

## types.and (function property)

```ts
and: {
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth> & UnwrapTypeFromCoerceableOrValidator<Ninth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth> & UnwrapTypeFromCoerceableOrValidator<Ninth> & UnwrapTypeFromCoerceableOrValidator<Tenth>>;
};
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second>>;
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third>>;
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth>>;
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth>>;
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth>>;
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh>>;
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth>>;
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth> & UnwrapTypeFromCoerceableOrValidator<Ninth>>;
```

### types.and(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> & UnwrapTypeFromCoerceableOrValidator<Second> & UnwrapTypeFromCoerceableOrValidator<Third> & UnwrapTypeFromCoerceableOrValidator<Fourth> & UnwrapTypeFromCoerceableOrValidator<Fifth> & UnwrapTypeFromCoerceableOrValidator<Sixth> & UnwrapTypeFromCoerceableOrValidator<Seventh> & UnwrapTypeFromCoerceableOrValidator<Eighth> & UnwrapTypeFromCoerceableOrValidator<Ninth> & UnwrapTypeFromCoerceableOrValidator<Tenth>>;
```

## types.union (function property)

```ts
union: {
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth> | UnwrapTypeFromCoerceableOrValidator<Ninth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth> | UnwrapTypeFromCoerceableOrValidator<Ninth> | UnwrapTypeFromCoerceableOrValidator<Tenth>>;
};
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second>>;
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third>>;
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth>>;
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth>>;
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth>>;
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh>>;
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth>>;
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth> | UnwrapTypeFromCoerceableOrValidator<Ninth>>;
```

### types.union(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth> | UnwrapTypeFromCoerceableOrValidator<Ninth> | UnwrapTypeFromCoerceableOrValidator<Tenth>>;
```

## types.or (function property)

```ts
or: {
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth> | UnwrapTypeFromCoerceableOrValidator<Ninth>>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth> | UnwrapTypeFromCoerceableOrValidator<Ninth> | UnwrapTypeFromCoerceableOrValidator<Tenth>>;
};
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second>>;
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third>>;
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth>>;
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth>>;
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth>>;
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh>>;
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth>>;
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth> | UnwrapTypeFromCoerceableOrValidator<Ninth>>;
```

### types.or(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<UnwrapTypeFromCoerceableOrValidator<First> | UnwrapTypeFromCoerceableOrValidator<Second> | UnwrapTypeFromCoerceableOrValidator<Third> | UnwrapTypeFromCoerceableOrValidator<Fourth> | UnwrapTypeFromCoerceableOrValidator<Fifth> | UnwrapTypeFromCoerceableOrValidator<Sixth> | UnwrapTypeFromCoerceableOrValidator<Seventh> | UnwrapTypeFromCoerceableOrValidator<Eighth> | UnwrapTypeFromCoerceableOrValidator<Ninth> | UnwrapTypeFromCoerceableOrValidator<Tenth>>;
```

## types.mapOf (method)

```ts
mapOf<K extends TypeValidator<any> | CoerceableToTypeValidator | unknown, V extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(keyType: K, valueType: V): TypeValidator<Map<UnwrapTypeFromCoerceableOrValidator<K>, UnwrapTypeFromCoerceableOrValidator<V>>>;
```

## types.setOf (method)

```ts
setOf<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(itemType: T): TypeValidator<Set<UnwrapTypeFromCoerceableOrValidator<T>>>;
```

## types.maybe (method)

```ts
maybe<T extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(itemType: T): TypeValidator<UnwrapTypeFromCoerceableOrValidator<T> | undefined | null>;
```

## types.objectWithProperties (method)

```ts
objectWithProperties<T extends {
  [key: string | number | symbol]: TypeValidator<any> | CoerceableToTypeValidator | unknown;
}>(properties: T): TypeValidator<{ [key in keyof T]: UnwrapTypeFromCoerceableOrValidator<T[key]> }>;
```

## types.objectWithOnlyTheseProperties (method)

```ts
objectWithOnlyTheseProperties<T extends {
  [key: string | number | symbol]: TypeValidator<any> | CoerceableToTypeValidator | unknown;
}>(properties: T): TypeValidator<{ [key in keyof T]: UnwrapTypeFromCoerceableOrValidator<T[key]> }>;
```

## types.mappingObjectOf (method)

```ts
mappingObjectOf<Values extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Keys extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(keyType: Keys, valueType: Values): TypeValidator<Record<UnwrapTypeFromCoerceableOrValidator<Keys> extends string | number | symbol ? UnwrapTypeFromCoerceableOrValidator<Keys> : never, UnwrapTypeFromCoerceableOrValidator<Values>>>;
```

## types.record (method)

```ts
record<Values extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Keys extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(keyType: Keys, valueType: Values): TypeValidator<Record<UnwrapTypeFromCoerceableOrValidator<Keys> extends string | number | symbol ? UnwrapTypeFromCoerceableOrValidator<Keys> : never, UnwrapTypeFromCoerceableOrValidator<Values>>>;
```

## types.partialObjectWithProperties (method)

```ts
partialObjectWithProperties<T extends {
  [key: string | number | symbol]: TypeValidator<any> | CoerceableToTypeValidator | unknown;
}>(properties: T): TypeValidator<{ [key in keyof T]: UnwrapTypeFromCoerceableOrValidator<T[key]> | null | undefined }>;
```

## types.tuple (function property)

```ts
tuple: {
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>]>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>]>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>]>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>]>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>]>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>, UnwrapTypeFromCoerceableOrValidator<Seventh>]>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>, UnwrapTypeFromCoerceableOrValidator<Seventh>, UnwrapTypeFromCoerceableOrValidator<Eighth>]>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>, UnwrapTypeFromCoerceableOrValidator<Seventh>, UnwrapTypeFromCoerceableOrValidator<Eighth>, UnwrapTypeFromCoerceableOrValidator<Ninth>]>;
  <First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>, UnwrapTypeFromCoerceableOrValidator<Seventh>, UnwrapTypeFromCoerceableOrValidator<Eighth>, UnwrapTypeFromCoerceableOrValidator<Ninth>, UnwrapTypeFromCoerceableOrValidator<Tenth>]>;
};
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>]>;
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>]>;
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>]>;
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>]>;
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>]>;
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>, UnwrapTypeFromCoerceableOrValidator<Seventh>]>;
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>, UnwrapTypeFromCoerceableOrValidator<Seventh>, UnwrapTypeFromCoerceableOrValidator<Eighth>]>;
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>, UnwrapTypeFromCoerceableOrValidator<Seventh>, UnwrapTypeFromCoerceableOrValidator<Eighth>, UnwrapTypeFromCoerceableOrValidator<Ninth>]>;
```

### types.tuple(...) (call signature)

```ts
<First extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Second extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Third extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fourth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Fifth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Sixth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Seventh extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Eighth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Ninth extends TypeValidator<any> | CoerceableToTypeValidator | unknown, Tenth extends TypeValidator<any> | CoerceableToTypeValidator | unknown>(first: First, second: Second, third: Third, fourth: Fourth, fifth: Fifth, sixth: Sixth, seventh: Seventh, eighth: Eighth, ninth: Ninth, tenth: Tenth): TypeValidator<[UnwrapTypeFromCoerceableOrValidator<First>, UnwrapTypeFromCoerceableOrValidator<Second>, UnwrapTypeFromCoerceableOrValidator<Third>, UnwrapTypeFromCoerceableOrValidator<Fourth>, UnwrapTypeFromCoerceableOrValidator<Fifth>, UnwrapTypeFromCoerceableOrValidator<Sixth>, UnwrapTypeFromCoerceableOrValidator<Seventh>, UnwrapTypeFromCoerceableOrValidator<Eighth>, UnwrapTypeFromCoerceableOrValidator<Ninth>, UnwrapTypeFromCoerceableOrValidator<Tenth>]>;
```

## types.coerce (function property)

```ts
coerce: <V extends CoerceableToTypeValidator | TypeValidator<any> | unknown>(
  value: V
) => TypeValidator<UnwrapTypeFromCoerceableOrValidator<V>>;
```

## types.FILE (property)

```ts
FILE: TypeValidator<FILE>;
```

## types.Path (property)

```ts
Path: TypeValidator<Path>;
```

## types.JSX (object property)

```ts
JSX: {
  unknownElement: TypeValidator<
    JSX.Element<
      {
        [key: string | symbol | number]: unknown;
      },
      unknown
    >
  >;
  anyElement: TypeValidator<JSX.Element<any, any>>;
  Element: TypeValidator<
    JSX.Element<
      {
        [key: string | symbol | number]: unknown;
      },
      unknown
    >
  >;
  Fragment: TypeValidator<JSX.Fragment>;
}
```

### types.JSX.unknownElement (property)

```ts
unknownElement: TypeValidator<
  JSX.Element<
    {
      [key: string | symbol | number]: unknown;
    },
    unknown
  >
>;
```

### types.JSX.anyElement (property)

```ts
anyElement: TypeValidator<JSX.Element<any, any>>;
```

### types.JSX.Element (property)

```ts
Element: TypeValidator<
  JSX.Element<
    {
      [key: string | symbol | number]: unknown;
    },
    unknown
  >
>;
```

### types.JSX.Fragment (property)

```ts
Fragment: TypeValidator<JSX.Fragment>;
```

# TypeValidator (type)

```ts
declare type TypeValidator<T> = (value: any) => value is T;
```

# CoerceToTypeValidator (type)

```ts
declare type CoerceToTypeValidator<V extends CoerceableToTypeValidator> =
  V extends StringConstructor
    ? TypeValidator<string>
    : V extends NumberConstructor
    ? TypeValidator<number>
    : V extends BooleanConstructor
    ? TypeValidator<boolean>
    : V extends BigIntConstructor
    ? TypeValidator<BigInt>
    : V extends SymbolConstructor
    ? TypeValidator<Symbol>
    : V extends RegExpConstructor
    ? TypeValidator<RegExp>
    : V extends ArrayConstructor
    ? TypeValidator<Array<unknown>>
    : V extends SetConstructor
    ? TypeValidator<Set<unknown>>
    : V extends MapConstructor
    ? TypeValidator<Map<unknown, unknown>>
    : V extends ObjectConstructor
    ? TypeValidator<{
        [key: string | number | symbol]: unknown;
      }>
    : V extends DateConstructor
    ? TypeValidator<Date>
    : V extends FunctionConstructor
    ? TypeValidator<Function>
    : V extends ArrayBufferConstructor
    ? TypeValidator<ArrayBuffer>
    : V extends SharedArrayBufferConstructor
    ? TypeValidator<SharedArrayBuffer>
    : V extends DataViewConstructor
    ? TypeValidator<DataView>
    : V extends Int8ArrayConstructor
    ? TypeValidator<Int8Array>
    : V extends Uint8ArrayConstructor
    ? TypeValidator<Uint8Array>
    : V extends Uint8ClampedArrayConstructor
    ? TypeValidator<Uint8ClampedArray>
    : V extends Int16ArrayConstructor
    ? TypeValidator<Int16Array>
    : V extends Uint16ArrayConstructor
    ? TypeValidator<Uint16Array>
    : V extends Int32ArrayConstructor
    ? TypeValidator<Int32Array>
    : V extends Uint32ArrayConstructor
    ? TypeValidator<Uint32Array>
    : V extends Float32ArrayConstructor
    ? TypeValidator<Float32Array>
    : V extends Float64ArrayConstructor
    ? TypeValidator<Float64Array>
    : V extends RegExp
    ? TypeValidator<string>
    : V extends {}
    ? TypeValidator<{
        [key in keyof V]: CoerceToTypeValidator<V[key]>;
      }>
    : V extends []
    ? TypeValidator<[]>
    : V extends [any]
    ? TypeValidator<Array<CoerceToTypeValidator<V[0]>>>
    : V extends Array<any>
    ? TypeValidator<Array<unknown>>
    : V extends {
        new (...args: any): any;
      }
    ? TypeValidator<InstanceType<V>>
    : TypeValidator<V>;
```

# CoerceableToTypeValidator (type)

```ts
declare type CoerceableToTypeValidator =
  | boolean
  | number
  | string
  | bigint
  | undefined
  | null
  | RegExp
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor
  | RegExpConstructor
  | ArrayConstructor
  | SetConstructor
  | MapConstructor
  | ObjectConstructor
  | DateConstructor
  | FunctionConstructor
  | ArrayBufferConstructor
  | SharedArrayBufferConstructor
  | DataViewConstructor
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | {}
  | []
  | [any]
  | Array<any>
  | {
      new (...args: any): any;
    };
```

# UnwrapTypeFromCoerceableOrValidator (type)

```ts
declare type UnwrapTypeFromCoerceableOrValidator<
  V extends CoerceableToTypeValidator | TypeValidator<any> | unknown
> = V extends TypeValidator<infer T>
  ? T
  : V extends CoerceableToTypeValidator
  ? CoerceToTypeValidator<V> extends TypeValidator<infer T>
    ? T
    : never
  : unknown;
```
