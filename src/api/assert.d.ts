export const assert: {
  /**
   * Throws an error if `value` is not truthy.
   *
   * @param value - The value to test for truthiness
   * @param message - An optional error message to use. If unspecified, "Assertion failed" will be used.
   */
  <ValueType>(
    value: ValueType,
    message?: string
  ): asserts value is ValueType extends null | undefined | false | 0 | ""
    ? never
    : ValueType;

  string(value: any, message?: string): asserts value is string;
  String(value: any, message?: string): asserts value is string;
  number(value: any, message?: string): asserts value is number;
  Number(value: any, message?: string): asserts value is number;
  boolean(value: any, message?: string): asserts value is boolean;
  Boolean(value: any, message?: string): asserts value is boolean;
  bigint(value: any, message?: string): asserts value is bigint;
  BigInt(value: any, message?: string): asserts value is bigint;
  symbol(value: any, message?: string): asserts value is symbol;
  Symbol(value: any, message?: string): asserts value is symbol;
  null(value: any, message?: string): asserts value is null;
  undefined(value: any, message?: string): asserts value is undefined;
  void(value: any, message?: string): asserts value is null | undefined;
  object(
    value: any,
    message?: string
  ): asserts value is {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Object(
    value: any,
    message?: string
  ): asserts value is {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Array(value: any, message?: string): asserts value is unknown[];
  function(
    value: any,
    message?: string
  ): asserts value is Function & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  Function(
    value: any,
    message?: string
  ): asserts value is Function & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  tagged(value: any, tag: string, message?: string): void;
  instanceOf<T>(value: any, klass: new (...args: any) => T): asserts value is T;
  Error(value: any, message?: string): asserts value is Error;
  Infinity(value: any, message?: string): asserts value is number;
  NegativeInfinity(value: any, message?: string): asserts value is number;
  NaN(value: any, message?: string): asserts value is number;
  Date(value: any, message?: string): asserts value is Date;
  RegExp(value: any, message?: string): asserts value is RegExp;
  Map(value: any, message?: string): asserts value is Map<unknown, unknown>;
  Set(value: any, message?: string): asserts value is Set<unknown>;
  WeakMap(value: any, message?: string): asserts value is Map<unknown, unknown>;
  WeakSet(value: any, message?: string): asserts value is Set<unknown>;
  ArrayBuffer(value: any, message?: string): asserts value is ArrayBuffer;
  SharedArrayBuffer(
    value: any,
    message?: string
  ): asserts value is SharedArrayBuffer;
  DataView(value: any, message?: string): asserts value is DataView;
  TypedArray(value: any, message?: string): asserts value is TypedArray;
  Int8Array(value: any, message?: string): asserts value is Int8Array;
  Uint8Array(value: any, message?: string): asserts value is Uint8Array;
  Uint8ClampedArray(
    value: any,
    message?: string
  ): asserts value is Uint8ClampedArray;
  Int16Array(value: any, message?: string): asserts value is Int16Array;
  Uint16Array(value: any, message?: string): asserts value is Uint16Array;
  Int32Array(value: any, message?: string): asserts value is Int32Array;
  Uint32Array(value: any, message?: string): asserts value is Uint32Array;
  Float32Array(value: any, message?: string): asserts value is Float32Array;
  Float64Array(value: any, message?: string): asserts value is Float64Array;
  Promise(value: any, message?: string): asserts value is Promise<unknown>;
  Generator(
    value: any,
    message?: string
  ): asserts value is Generator<unknown, any, unknown>;
  GeneratorFunction(
    value: any,
    message?: string
  ): asserts value is GeneratorFunction;
  AsyncFunction(
    value: any,
    message?: string
  ): asserts value is ((...args: any) => Promise<unknown>) & {
    [key: string]: unknown;
    [key: number]: unknown;
    [key: symbol]: unknown;
  };
  AsyncGenerator(
    value: any
  ): asserts value is AsyncGenerator<unknown, any, unknown>;
  AsyncGeneratorFunction(
    value: any,
    message?: string
  ): asserts value is AsyncGeneratorFunction;

  FILE(value: any, message?: string): asserts value is FILE;

  JSX: {
    /** Returns whether `value` is a JSX Element object as created via JSX syntax. */
    Element(value: any, message?: string): asserts value is JSX.Element;
    /** Returns whether `value` is a JSX fragment element as created via JSX syntax. */
    Fragment(value: any, message?: string): asserts value is JSX.Fragment;
  };
};
