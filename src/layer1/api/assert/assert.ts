import * as engine from "quickjs:engine";
import { assertType as phenoAssertType } from "pheno";
import { makeErrorWithProperties } from "../../error-with-properties";
import {
  TypeValidator,
  CoerceableToTypeValidator,
  UnwrapTypeFromCoerceableOrValidator,
  types,
} from "../types";

function assert<ValueType>(
  value: ValueType,
  message?: string,
): asserts value is ValueType extends null | undefined | false | 0 | ""
  ? never
  : ValueType {
  if (value) return;

  let errMsg = message || "Assertion failed";

  try {
    const [callerFrame] = engine.getStackFrames(1);
    if (callerFrame != null) {
      let locDescription = "";
      if (callerFrame.fileName) {
        locDescription += callerFrame.fileName;
        if (callerFrame.lineNumber) {
          locDescription += ":" + callerFrame.lineNumber;
          if (callerFrame.columnNumber) {
            locDescription += ":" + callerFrame.columnNumber;
          }
        }
      }

      if (locDescription.length > 0) {
        errMsg += ` at ${locDescription}`;
      }
    }
  } catch {
    // ignored
  }

  throw makeErrorWithProperties(errMsg, { value });
}

const assertType = <T extends TypeValidator<any> | CoerceableToTypeValidator>(
  value: any,
  type: T,
  optionalMessage?: string,
): asserts value is UnwrapTypeFromCoerceableOrValidator<T> => {
  const validator = types.coerce(type);
  if (optionalMessage != null) {
    if (!validator(value)) {
      throw new TypeError(optionalMessage);
    }
  } else {
    phenoAssertType(value, validator);
  }
};

const assert_: typeof assert & { type: typeof assertType } = Object.assign(
  assert,
  { type: assertType },
);

export { assert_ as assert };
