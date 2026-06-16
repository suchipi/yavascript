import * as std from "quickjs:std";
import { escape } from "../regexp-escape";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import type { Path } from "../path";

export function grepString(
  str: string,
  pattern: string | RegExp,
  options: { inverse?: boolean; details?: boolean } = {},
) {
  const lines = str.split("\n");

  return grepArray(lines, pattern, options);
}

export function grepArray<T>(
  targetArray: Array<T>,
  pattern: string | RegExp,
  options: { inverse?: boolean; details?: boolean } = {},
) {
  const regexp =
    typeof pattern === "string" ? new RegExp(escape(pattern), "g") : pattern;

  const outLines: Array<
    | T
    | {
        lineNumber: number;
        lineContent: T;
        matches: RegExpMatchArray | null;

        index: number; // same as lineNumber - 1
        content: T; // same as lineContent
      }
  > = [];

  targetArray.forEach((item, index) => {
    const matches = String(item).match(regexp);
    let shouldInclude = matches != null;
    if (options.inverse) {
      shouldInclude = !shouldInclude;
    }
    if (!shouldInclude) return;

    let outLine: (typeof outLines)[0];
    if (options.details) {
      outLine = {
        lineNumber: index + 1,
        lineContent: item,
        matches,

        index,
        content: item,
      };
    } else {
      outLine = item;
    }
    outLines.push(outLine);
  });

  return outLines;
}

export function grepFile(
  path: string | Path,
  pattern: string | RegExp,
  options?: { inverse?: boolean; details?: boolean },
) {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object",
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  const content = std.loadFile(path);
  return grepString(content, pattern, options);
}

export function installToStringProto(stringProto: any) {
  stringProto.grep = function grep(
    pattern: string | RegExp,
    options?: { inverse?: boolean; lineNumbers?: boolean },
  ) {
    return grepString(this as string, pattern, options);
  };
}

export function installToArrayProto(arrayProto: any) {
  arrayProto.grep = function grep(
    pattern: string | RegExp,
    options?: { inverse?: boolean; lineNumbers?: boolean },
  ) {
    return grepArray(this, pattern, options);
  };
}
