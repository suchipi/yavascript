import * as os from "os";
import { makeErrorWithProperties } from "../error-with-properties";

export class Path {
  static OS_SEGMENT_SEPARATOR = os.platform === "win32" ? "\\" : "/";
  static OS_ENV_VAR_SEPARATOR = os.platform === "win32" ? ";" : ":";

  static splitToSegments(inputParts: Array<string> | string): Array<string> {
    if (!Array.isArray(inputParts)) {
      inputParts = [inputParts];
    }

    return inputParts
      .map((part) => part.split(/(?:\/|\\)+/g))
      .flat(1)
      .filter((part, index) => {
        // first part can be "" to represent left side of root "/"
        if (index === 0) return true;
        return Boolean(part);
      });
  }

  static detectSeparator<Fallback extends string | null = string>(
    input: Array<string> | string,
    // @ts-ignore might be instantiated with a different subtype
    fallback: Fallback = Path.OS_SEGMENT_SEPARATOR
  ): string | Fallback {
    let testStr = input;
    if (Array.isArray(input)) {
      testStr = input.join("|");
    }

    for (const char of testStr) {
      if (char === "/") {
        return "/";
      } else if (char === "\\") {
        return "\\";
      }
    }

    return fallback;
  }

  static join(...inputs: Array<string | Path | Array<string | Path>>): string {
    return new Path(...inputs).toString();
  }

  static resolve(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): string {
    return new Path(...inputs).resolve().toString();
  }

  static isAbsolute(path: string): boolean {
    return new Path(path).isAbsolute();
  }

  segments: Array<string>;
  separator: string;

  constructor(...inputs: Array<string | Path | Array<string | Path>>) {
    const parts = inputs
      .flat(1)
      .map((part) => (typeof part === "string" ? part : part.segments))
      .flat(1);

    this.segments = Path.splitToSegments(parts);
    this.separator = Path.detectSeparator(parts);
  }

  static from(
    segments: Array<string>,
    separator: string = Path.OS_SEGMENT_SEPARATOR
  ) {
    const path = new Path("/");
    path.segments = segments;
    path.separator = separator;
    return path;
  }

  resolve(from: string | Path = os.getcwd()): Path {
    const fromPath = typeof from === "string" ? new Path(from) : from;
    // we clone this cause we're gonna mutate it
    const segments = [...this.segments];

    const newSegments: Array<string> = [];
    let currentSegment: string | undefined;
    while (segments.length > 0) {
      currentSegment = segments.shift();
      if (currentSegment === "." || currentSegment === "..") {
        if (newSegments.length === 0) {
          newSegments.push(...fromPath.segments);
        }

        if (currentSegment === "..") {
          if (newSegments.length > 0) {
            newSegments.pop();
          } else {
            throw makeErrorWithProperties("Cannot resolve leading ..", {
              from: fromPath.toString(),
              path: this.toString(),
            });
          }
        }
      } else if (currentSegment != null) {
        newSegments.push(currentSegment);
      }
    }

    return Path.from(newSegments, this.separator);
  }

  concat(other: string | Path | Array<string | Path>): Path {
    const otherSegments = new Path(other).segments;
    return Path.from(this.segments.concat(otherSegments), this.separator);
  }

  isAbsolute(): boolean {
    const firstPart = this.segments[0];

    // empty first component indicates that path starts with leading slash
    if (firstPart === "") return true;

    // windows drive
    if (/^[A-Za-z]:/.test(firstPart)) return true;

    // TODO: windows UNC paths (not supported very well by these path APIs at all, yet)

    return false;
  }

  toString() {
    return this.segments.join(this.separator);
  }
}
