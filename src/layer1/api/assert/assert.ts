import * as std from "quickjs:std";
import * as os from "quickjs:os";
import * as engine from "quickjs:engine";
import { assertType as phenoAssertType } from "pheno";
import { makeErrorWithProperties } from "../../error-with-properties";
import { hasColors } from "../../has-colors";
import { fileNameToLang, langHasAngleBracketAssertions } from "../../langs";
import { colorizeJs } from "../repl/colorize-js";
import { colorText, makeColors } from "../repl/js-colors";
import {
  TypeValidator,
  CoerceableToTypeValidator,
  UnwrapTypeFromCoerceableOrValidator,
  types,
} from "../types";
import { red, bold } from "../strings";
// not using normal Path here to avoid creating a dependency cycle
import { Path as NicePath } from "nice-path";

function splitLines(content: string): Array<{ text: string; offset: number }> {
  const lines: Array<{ text: string; offset: number }> = [];
  const newline = /\r\n|\n/g;
  let offset = 0;
  let match: RegExpExecArray | null;
  while ((match = newline.exec(content)) != null) {
    lines.push({ text: content.slice(offset, match.index), offset });
    offset = match.index + match[0].length;
  }
  lines.push({ text: content.slice(offset), offset });
  return lines;
}

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
      let paddingAmount = -1;

      if (callerFrame.fileName != null) {
        const cwd = os.getcwd();
        if (new NicePath(callerFrame.fileName).startsWith(cwd)) {
          locDescription += new NicePath(callerFrame.fileName)
            .relativeTo(cwd, { noLeadingDot: true })
            .toString();
        } else {
          locDescription += callerFrame.fileName;
        }

        if (callerFrame.lineNumber != null) {
          locDescription += ":" + callerFrame.lineNumber;
          if (callerFrame.columnNumber != null) {
            locDescription += ":" + callerFrame.columnNumber;
          }

          try {
            const fileContent = std.loadFile(callerFrame.fileName);
            const lines = splitLines(fileContent);

            paddingAmount = Math.max(
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

            const lastLine = linesAround[linesAround.length - 1];
            const lang = fileNameToLang(callerFrame.fileName) ?? "js";
            // Tokenizing starts at the top of the file because a token can
            // start before the code frame does (eg. template literal, comment)
            const [, , styleNames] = colorizeJs(
              fileContent.slice(0, lastLine.offset + lastLine.text.length),
              { jsx: !langHasAngleBracketAssertions(lang) },
            );
            const colors = makeColors(hasColors());

            locPreview = linesAround
              .map(
                ({ text, offset }, index) =>
                  red(
                    String(callerFrame.lineNumber - 1 + index).padStart(
                      paddingAmount,
                      " ",
                    ) + bold(" │ "),
                  ) +
                  colorText(
                    colors,
                    text,
                    0,
                    styleNames.slice(offset, offset + text.length),
                  ),
              )
              .join("\n");
          } catch {
            // ignored
          }
        }
      }

      if (locDescription.length > 0 && locPreview.length === 0) {
        errMsg += ` at ${bold(locDescription)}`;
      } else if (locPreview.length > 0) {
        let underline = "─".repeat(locDescription.length);

        if (paddingAmount !== -1) {
          const underlineChars = underline.split("");
          underlineChars.splice(paddingAmount + 1, 1, "┬");
          underline = underlineChars.join("");
        }

        errMsg += `\n${bold(red(locDescription))}\n${bold(red(underline))}\n${locPreview}\n`;
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
