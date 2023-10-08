/**
 * Returns whether `value` is of type `type`. Useful for validating that values have the correct type at runtime, in library functions or etc.
 *
 * Run `help(is)` for more info.
 */
declare const is: <T extends TypeValidator<any> | CoerceableToTypeValidator>(
  value: any,
  type: T
) => value is UnwrapTypeFromCoerceableOrValidator<T>;

/**
 * Alias to {@link is}, for Civet, because `is` is a reserved keyword in Civet.
 */
declare const _is: typeof is;
