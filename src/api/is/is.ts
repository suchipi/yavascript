import {
  TypeValidator,
  CoerceableToTypeValidator,
  UnwrapTypeFromCoerceableOrValidator,
  types,
} from "../types";
import { setHelpText } from "../help";
import isHelpText from "./is.help.md";

export const is = <T extends TypeValidator<any> | CoerceableToTypeValidator>(
  value: any,
  type: T
): value is UnwrapTypeFromCoerceableOrValidator<T> => {
  return types.coerce(type)(value);
};

setHelpText(is, isHelpText);
