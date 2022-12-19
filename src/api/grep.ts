import * as std from "std";
import { escape } from "./regexp-escape";

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

    let outLine: typeof outLines[0];
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

export function grepFile(
  path: string,
  pattern: string | RegExp,
  options?: { inverse?: boolean; details?: boolean }
) {
  const content = std.loadFile(path);
  return grepString(content, pattern, options);
}

export function installToStringProto(stringProto: any) {
  stringProto.grep = function grep(
    pattern: string | RegExp,
    options?: { inverse?: boolean; lineNumbers?: boolean }
  ) {
    return grepString(this as string, pattern, options);
  };
}
