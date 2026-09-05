import * as std from "quickjs:std";
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
      let locPreview = "";

      if (callerFrame.fileName) {
        locDescription += callerFrame.fileName;
        if (callerFrame.lineNumber) {
          locDescription += ":" + callerFrame.lineNumber;
          if (callerFrame.columnNumber) {
            locDescription += ":" + callerFrame.columnNumber;
          }

          try {
            const fileContent = std.loadFile(callerFrame.fileName);
            const lines = fileContent.split(/\n|\r\n/g);

            const paddingAmount = Math.max(
              ...[
                callerFrame.lineNumber - 1,
                callerFrame.lineNumber,
                callerFrame.lineNumber + 1,
              ].map((num) => String(num).length),
            );

            // Note: lineNumber is 1-based, slice is 0-based
            const linesAround = lines.slice(
              callerFrame.lineNumber - 2,
              callerFrame.lineNumber + 1,
            );

            locPreview = linesAround
              .map(
                (line, index) =>
                  String(callerFrame.lineNumber - 1 + index).padStart(
                    paddingAmount,
                    " ",
                  ) +
                  " | " +
                  line,
              )
              .join("\n");
          } catch {
            // ignored
          }
        }
      }

      if (locDescription.length > 0) {
        errMsg += ` at ${locDescription}`;
      }
      if (locPreview.length > 0) {
        errMsg += `\n${locPreview}\n`;
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
