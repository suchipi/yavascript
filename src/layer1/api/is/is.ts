import {
  TypeValidator,
  CoerceableToTypeValidator,
  UnwrapTypeFromCoerceableOrValidator,
  types,
} from "../types";

export const is = <T extends TypeValidator<any> | CoerceableToTypeValidator>(
  value: any,
  type: T,
): value is UnwrapTypeFromCoerceableOrValidator<T> => {
  return Boolean(types.coerce(type)(value));
};
