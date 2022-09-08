declare type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;
declare type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

declare const is: {
  string(value: any): value is string;
  String(value: any): value is string;
  number(value: any): value is number;
  Number(value: any): value is number;
  boolean(value: any): value is boolean;
  Boolean(value: any): value is boolean;
  bigint(value: any): value is bigint;
  BigInt(value: any): value is BigInt;
  symbol(value: any): value is symbol;
  Symbol(value: any): value is symbol;
  null(value: any): value is null;
  undefined(value: any): value is undefined;
  void(value: any): value is null | undefined;
  object(value: any): value is {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Object(value: any): value is {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Array(value: any): value is unknown[];
  function(value: any): value is Function & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Function(value: any): value is Function & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  tagged(value: any, tag: string): boolean;
  instanceOf<T>(value: any, klass: new (...args: any) => T): value is T;
  Error(value: any): value is Error;
  Infinity(value: any): value is number;
  NegativeInfinity(value: any): value is number;
  NaN(value: any): value is number;
  Date(value: any): value is Date;
  RegExp(value: any): value is RegExp;
  Map(value: any): value is Map<unknown, unknown>;
  Set(value: any): value is Set<unknown>;
  WeakMap(value: any): value is Map<unknown, unknown>;
  WeakSet(value: any): value is Set<unknown>;
  ArrayBuffer(value: any): value is ArrayBuffer;
  SharedArrayBuffer(value: any): value is SharedArrayBuffer;
  DataView(value: any): value is DataView;
  TypedArray(value: any): value is TypedArray;
  Int8Array(value: any): value is Int8Array;
  Uint8Array(value: any): value is Uint8Array;
  Uint8ClampedArray(value: any): value is Uint8ClampedArray;
  Int16Array(value: any): value is Int16Array;
  Uint16Array(value: any): value is Uint16Array;
  Int32Array(value: any): value is Int32Array;
  Uint32Array(value: any): value is Uint32Array;
  Float32Array(value: any): value is Float32Array;
  Float64Array(value: any): value is Float64Array;
  Promise(value: any): value is Promise<unknown>;
  Generator(value: any): value is Generator<unknown, any, unknown>;
  GeneratorFunction(value: any): value is GeneratorFunction;
  AsyncFunction(value: any): value is ((...args: any) => Promise<unknown>) & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  AsyncGenerator(value: any): value is AsyncGenerator<unknown, any, unknown>;
  AsyncGeneratorFunction(value: any): value is AsyncGeneratorFunction;
};
