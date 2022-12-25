import * as os from "os";
import { makeErrorWithProperties } from "../error-with-properties";

function validateSegments(segments: Array<string>): Array<string> {
  return segments.filter((part, index) => {
    // first part can be "" to represent left side of root "/"
    if (index === 0) return true;
    return Boolean(part);
  });
}

export class Path {
  static OS_SEGMENT_SEPARATOR = os.platform === "win32" ? "\\" : "/";
  static OS_ENV_VAR_SEPARATOR = os.platform === "win32" ? ";" : ":";

  static splitToSegments(inputParts: Array<string> | string): Array<string> {
    if (!Array.isArray(inputParts)) {
      inputParts = [inputParts];
    }

    return validateSegments(
      inputParts.map((part) => part.split(/(?:\/|\\)+/g)).flat(1)
    );
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

  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): string {
    return new Path(...inputs).normalize().toString();
  }

  static isAbsolute(path: string): boolean {
    return new Path(path).isAbsolute();
  }

  static tag(
    _strings: TemplateStringsArray,
    ..._values: ReadonlyArray<string | Path | Array<string | Path>>
  ) {
    const strings = [..._strings];
    const values = [..._values];

    const zipped: Array<string | Path | Array<string | Path>> = [];

    let sourceIsStrings = true;
    while (strings.length + values.length > 0) {
      const next = sourceIsStrings ? strings.shift() : values.shift();
      if (next != null) {
        zipped.push(next);
      }
      sourceIsStrings = !sourceIsStrings;
    }

    if (zipped[0] === "") {
      zipped.shift();
    }

    return new Path(...zipped);
  }

  static tagUsingBase(dir: string | Path): typeof Path.tag {
    const ret = (strings, ...values) => {
      const stringsClone = Object.assign([...strings], {
        raw: [...strings.raw],
      });
      stringsClone[0] = Path.join(dir, strings[0]);
      stringsClone.raw[0] = Path.join(dir, strings.raw[0]);
      return Path.tag(stringsClone, ...values);
    };
    Object.defineProperty(ret, "name", {
      value: `tagUsingBase(${dir})`,
      configurable: true,
    });
    return ret;
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
    const path = new Path();
    path.segments = validateSegments(segments);
    path.separator = separator;
    return path;
  }

  resolve(from: string | Path = os.getcwd()): Path {
    if (this.isAbsolute()) {
      return this.normalize();
    }

    const fromPath = typeof from === "string" ? new Path(from) : from;
    const result = fromPath.concat(this).normalize();
    if (!result.isAbsolute()) {
      throw makeErrorWithProperties(
        `Could not resolve ${this.toString()} from ${fromPath.toString()}`,
        {
          this: this.toString(),
          from: fromPath.toString(),
        }
      );
    }
    return result;
  }

  normalize(): Path {
    // we clone this cause we're gonna mutate it
    const segments = [...this.segments];

    const newSegments: Array<string> = [];
    let currentSegment: string | undefined;
    while (segments.length > 0) {
      currentSegment = segments.shift();

      switch (currentSegment) {
        case ".": {
          if (newSegments.length === 0) {
            newSegments.push(currentSegment);
          }
          break;
        }
        case "..": {
          if (newSegments.length === 0) {
            newSegments.push(currentSegment);
          } else {
            newSegments.pop();
          }

          break;
        }
        default: {
          if (currentSegment != null) {
            newSegments.push(currentSegment);
          }
          break;
        }
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
    const result = this.segments.join(this.separator);
    if (result == "") {
      return "/";
    } else {
      return result;
    }
  }
}
