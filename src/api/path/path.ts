import * as os from "quickjs:os";
import { assert } from "../assert";
import { types } from "../types";
import { is } from "../is";
import { makeErrorWithProperties } from "../../error-with-properties";
import { appendSlashIfWindowsDriveLetter } from "./_win32Helpers";
import { quote } from "../strings";

function validateSegments(
  segments: Array<string>,
  separator: string
): Array<string> {
  return segments.filter((part, index) => {
    // first part can be "" to represent left side of root "/"
    // second part can be "" to support windows UNC paths
    if (part === "" && index === 0) {
      return true;
    } else if (
      part === "" &&
      index === 1 &&
      separator === "\\" &&
      segments[0] === ""
    ) {
      return true;
    }

    return Boolean(part);
  });
}

class Path {
  static OS_SEGMENT_SEPARATOR = os.platform === "win32" ? "\\" : "/";
  static OS_ENV_VAR_SEPARATOR = os.platform === "win32" ? ";" : ":";

  static splitToSegments(inputParts: Array<string> | string): Array<string> {
    assert.type(
      inputParts,
      types.or(types.string, types.arrayOf(types.string))
    );

    if (!Array.isArray(inputParts)) {
      inputParts = [inputParts];
    }

    const separator = Path.detectSeparator(inputParts);

    return validateSegments(
      inputParts.map((part) => part.split(/(?:\/|\\)/g)).flat(1),
      separator
    );
  }

  static detectSeparator<Fallback extends string | null = string>(
    input: Array<string> | string,
    // @ts-ignore might be instantiated with a different subtype
    fallback: Fallback = Path.OS_SEGMENT_SEPARATOR
  ): string | Fallback {
    assert.type(input, types.or(types.string, types.arrayOf(types.string)));
    assert.type(fallback, types.or(types.string, types.null));

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
    assert.type(
      inputs,
      types.arrayOf(
        types.or(
          types.string,
          types.Path,
          types.arrayOf(types.or(types.string, types.Path))
        )
      )
    );

    return new Path(...inputs).toString();
  }

  static resolve(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): string {
    assert.type(
      inputs,
      types.arrayOf(
        types.or(
          types.string,
          types.Path,
          types.arrayOf(types.or(types.string, types.Path))
        )
      )
    );

    return new Path(...inputs).resolve().toString();
  }

  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): string {
    assert.type(
      inputs,
      types.arrayOf(
        types.or(
          types.string,
          types.Path,
          types.arrayOf(types.or(types.string, types.Path))
        )
      )
    );

    return new Path(...inputs).normalize().toString();
  }

  static isAbsolute(path: string | Path): boolean {
    assert.type(path, types.or(types.string, types.Path));

    if (is(path, types.Path)) {
      return path.isAbsolute();
    } else {
      return new Path(path).isAbsolute();
    }
  }

  segments: Array<string>;
  separator: string;

  constructor(...inputs: Array<string | Path | Array<string | Path>>) {
    assert.type(
      inputs,
      types.arrayOf(
        types.or(
          types.string,
          types.Path,
          types.arrayOf(types.or(types.string, types.Path))
        )
      )
    );

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
    assert.type(segments, types.arrayOf(types.string));
    assert.type(separator, types.string);

    const path = new Path();
    path.segments = validateSegments(segments, separator);
    path.separator = separator;
    return path;
  }

  resolve(...subpaths: Array<string | Path>): Path {
    assert.type(subpaths, types.arrayOf(types.or(types.string, types.Path)));

    const result = this.concat(subpaths).normalize();
    if (!result.isAbsolute()) {
      throw makeErrorWithProperties(
        `.resolve could not create an absolute path. If you're okay with non-absolute paths, use '.concat(others).normalize()' instead of '.resolve(...others)'.`,
        {
          this: this,
          subpaths,
          result,
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

  concat(...others: Array<string | Path | Array<string | Path>>): Path {
    assert.type(
      others,
      types.arrayOf(
        types.or(
          types.string,
          types.Path,
          types.arrayOf(types.or(types.string, types.Path))
        )
      )
    );

    const otherSegments = new Path(others.flat(1)).segments;
    return Path.from(this.segments.concat(otherSegments), this.separator);
  }

  isAbsolute(): boolean {
    const firstPart = this.segments[0];

    // empty first component indicates that path starts with leading slash.
    // could be unix fs root, or windows unc path
    if (firstPart === "") return true;

    // windows drive
    if (/^[A-Za-z]:/.test(firstPart)) return true;

    return false;
  }

  clone() {
    return (this.constructor as typeof Path).from(
      this.segments,
      this.separator
    );
  }

  relativeTo(
    dir: Path | string,
    options: { noLeadingDot?: boolean } = {}
  ): Path {
    if (!is(dir, types.Path)) {
      dir = new Path(dir);
    }

    const ownSegments = [...this.segments];
    const dirSegments = [...dir.segments];

    while (ownSegments[0] === dirSegments[0]) {
      ownSegments.shift();
      dirSegments.shift();
    }

    if (dirSegments.length === 0) {
      if (options.noLeadingDot) {
        return Path.from(ownSegments, this.separator);
      } else {
        return Path.from([".", ...ownSegments], this.separator);
      }
    } else {
      const dotDots = dirSegments.map((_) => "..");
      return Path.from([...dotDots, ...ownSegments]);
    }
  }

  toString() {
    let result = this.segments.join(this.separator);
    if (result == "") {
      return "/";
    } else {
      result = appendSlashIfWindowsDriveLetter(result);
      return result;
    }
  }

  toJSON() {
    return this.toString();
  }
}

// .toString() needs to return a value starting with "class" for pheno.coerce
// to see this function as a class, and therefore coerce it into the type
// "instanceOf(Path)" when it appears in a function that accepts a type
// validator (ie. `is` or `assert.type`).
//
// Normally, `Path.toString()` would already start with "class", because we
// defined it using class syntax. But, as part of compiling yavascript, the
// source code is converted to QuickJS bytecode, and that bytecode
// representation does not preserve Function bodies, so `Path.toString()`
// changes. It instead returns "function Path() {\n    [native code]\n}".
//
// Explicitly overriding it like this ensures that it has the correct value
// even after bytecode conversion.
Object.defineProperty(Path, "toString", {
  value: () => "class Path {\n    [native code]\n}",
});

export { Path };
