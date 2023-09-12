import * as std from "quickjs:std";
import { escape } from "../regexp-escape";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { setHelpText } from "../help";
import grepFileHelpText from "./grepFile.help.md";
import grepStringHelpText from "./grepString.help.md";
import stringProtoGrepHelpText from "./String_prototype_grep.help.md";

export function grepString(
  str: string,
  pattern: string | RegExp,
  options: { inverse?: boolean; details?: boolean } = {}
) {
  const lines = str.split("\n");
  const regexp =
    typeof pattern === "string" ? new RegExp(escape(pattern), "g") : pattern;

  const outLines: Array<
    | string
    | {
        lineNumber: number;
        lineContent: string;
        matches: RegExpMatchArray | null;
      }
  > = [];

  lines.forEach((line, index) => {
    const matches = line.match(regexp);
    let shouldInclude = matches != null;
    if (options.inverse) {
      shouldInclude = !shouldInclude;
    }
    if (!shouldInclude) return;

    let outLine: (typeof outLines)[0];
    if (options.details) {
      outLine = {
        lineNumber: index + 1,
        lineContent: line,
        matches,
      };
    } else {
      outLine = line;
    }
    outLines.push(outLine);
  });

  return outLines;
}

setHelpText(grepString, grepStringHelpText);

export function grepFile(
  path: string | Path,
  pattern: string | RegExp,
  options?: { inverse?: boolean; details?: boolean }
) {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  const content = std.loadFile(path);
  return grepString(content, pattern, options);
}

setHelpText(grepFile, grepFileHelpText);

export function installToStringProto(stringProto: any) {
  stringProto.grep = function grep(
    pattern: string | RegExp,
    options?: { inverse?: boolean; lineNumbers?: boolean }
  ) {
    return grepString(this as string, pattern, options);
  };

  setHelpText(stringProto.grep, stringProtoGrepHelpText);
}
