declare const assert: {
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

  /**
   * Throws an error if its argument isn't the correct type.
   *
   * @param value - The value to test the type of
   * @param type - The type that `value` should be, as either a `TypeValidator` (from the `types.*` namespace) or a value which can be coerced into a `TypeValidator` via the `types.coerce` function, like `String`, `Boolean`, etc.
   * @param message - An optional error message to use. If unspecified, a generic-but-descriptive message will be used.
   */
  type: <T extends TypeValidator<any> | CoerceableToTypeValidator>(
    value: any,
    type: T,
    optionalMessage?: string
  ) => asserts value is UnwrapTypeFromCoerceableOrValidator<T>;
};
