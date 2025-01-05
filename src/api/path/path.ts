import * as os from "quickjs:os";
import { assert } from "../assert";
import { types } from "../types";
import { is } from "../is";
import { env } from "../env";
import { appendSlashIfWindowsDriveLetter } from "./_win32Helpers";
import { extname } from "../commands/extname";

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

// Default value of env.PATHEXT on Windows Vista and up.
// XP is the same but without ".MSC".
const windowsDefaultPathExt =
  ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC";

class Path {
  static OS_SEGMENT_SEPARATOR = os.platform === "win32" ? "\\" : "/";
  static OS_ENV_VAR_SEPARATOR = os.platform === "win32" ? ";" : ":";
  static OS_PROGRAM_EXTENSIONS = new Set(
    os.platform === "win32"
      ? (env.PATHEXT || windowsDefaultPathExt).split(";")
      : []
  );

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

  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): Path {
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

    return new Path(...inputs).normalize();
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

  static fromRaw(
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

  normalize(): Path {
    // we clone this cause we're gonna mutate it
    const segments = [...this.segments];

    const newSegments: Array<string> = [];
    function isNewSegmentsEmptyExcludingDots() {
      return (
        newSegments.filter((segment) => segment !== "." && segment !== "..")
          .length === 0
      );
    }

    let currentSegment: string | undefined;
    while (segments.length > 0) {
      currentSegment = segments.shift();

      switch (currentSegment) {
        case ".": {
          if (isNewSegmentsEmptyExcludingDots()) {
            newSegments.push(currentSegment);
          }
          break;
        }
        case "..": {
          if (isNewSegmentsEmptyExcludingDots()) {
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

    return Path.fromRaw(newSegments, this.separator);
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
    return Path.fromRaw(this.segments.concat(otherSegments), this.separator);
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

  clone(): this {
    // @ts-ignore could be instantiated with different subtype
    return (this.constructor as typeof Path).fromRaw(
      [...this.segments],
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
        return Path.fromRaw(ownSegments, this.separator);
      } else {
        return Path.fromRaw([".", ...ownSegments], this.separator);
      }
    } else {
      const dotDots = dirSegments.map((_) => "..");
      return Path.fromRaw([...dotDots, ...ownSegments]);
    }
  }

  toString(): string {
    let result = this.segments.join(this.separator);
    if (result == "") {
      return "/";
    } else {
      result = appendSlashIfWindowsDriveLetter(result);
      return result;
    }
  }

  toJSON(): string {
    return this.toString();
  }

  basename(): string {
    return this.segments.at(-1) || "";
  }

  extname(options: { full?: boolean } = {}): string {
    return extname(this, options);
  }

  dirname(): Path {
    return this.replaceLast([]);
  }

  startsWith(value: string | Path | Array<string | Path>): boolean {
    value = new Path(value);

    return value.segments.every(
      (segment, index) => this.segments[index] === segment
    );
  }

  endsWith(value: string | Path | Array<string | Path>): boolean {
    value = new Path(value);

    const valueSegmentsReversed = [...value.segments].reverse();
    const ownSegmentsReversed = [...this.segments].reverse();

    return valueSegmentsReversed.every(
      (segment, index) => ownSegmentsReversed[index] === segment
    );
  }

  indexOf(
    value: string | Path | Array<string | Path>,
    fromIndex: number = 0
  ): number {
    value = new Path(value);

    const ownSegmentsLength = this.segments.length;
    for (let i = fromIndex; i < ownSegmentsLength; i++) {
      if (
        value.segments.every((valueSegment, valueIndex) => {
          return this.segments[i + valueIndex] === valueSegment;
        })
      ) {
        return i;
      }
    }

    return -1;
  }

  includes(
    value: string | Path | Array<string | Path>,
    fromIndex: number = 0
  ): boolean {
    return this.indexOf(value, fromIndex) !== -1;
  }

  replace(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>
  ): Path {
    value = new Path(value);
    replacement = new Path(replacement);

    const matchIndex = this.indexOf(value);

    if (matchIndex === -1) {
      return this.clone();
    } else {
      const newSegments = [
        ...this.segments.slice(0, matchIndex),
        ...replacement.segments,
        ...this.segments.slice(matchIndex + value.segments.length),
      ];
      return Path.fromRaw(newSegments, this.separator);
    }
  }

  replaceAll(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>
  ): Path {
    replacement = new Path(replacement);

    let searchIndex = 0;

    let currentPath: Path = this;

    const ownLength = this.segments.length;
    while (searchIndex < ownLength) {
      const matchingIndex = this.indexOf(value, searchIndex);
      if (matchingIndex === -1) {
        break;
      } else {
        currentPath = currentPath.replace(value, replacement);
        searchIndex = matchingIndex + replacement.segments.length;
      }
    }

    return currentPath;
  }

  replaceLast(replacement: string | Path | Array<string | Path>): Path {
    replacement = new Path(replacement);

    const segments = [...this.segments];
    segments.pop();
    segments.push(...replacement.segments);

    return Path.fromRaw(segments, this.separator);
  }

  [inspect.custom](inputs: InspectCustomInputs) {
    if (
      typeof this.segments === "undefined" ||
      typeof this.separator === "undefined"
    ) {
      // inspecting Path.prototype, or a Path someone messed up
      return;
    }

    const isEmpty = this.segments.length === 0;
    if (isEmpty) {
      return;
    }

    const { colours } = inputs;

    // remove prop lines for segments and separator as we'll print those
    // in our special way
    {
      const segmentsIndex = inputs.propLines.findIndex((line) =>
        line.startsWith(colours.keys + "segments" + colours.off)
      );
      const separatorIndex = inputs.propLines.findIndex((line) =>
        line.startsWith(colours.keys + "separator" + colours.off)
      );

      if (segmentsIndex !== -1) {
        inputs.propLines[segmentsIndex] = "";
      }
      if (separatorIndex !== -1) {
        inputs.propLines[separatorIndex] = "";
      }

      inputs.propLines = inputs.propLines.filter(Boolean);
    }

    const hasExtraProps = inputs.propLines.length > 0;

    const printedSelfLine = colours.string + this.toString() + colours.off;
    inputs.linesBefore.push(printedSelfLine);

    if (
      !hasExtraProps &&
      inputs.linesBefore.length === 1 &&
      inputs.linesBefore[0] === printedSelfLine
    ) {
      inputs.oneLine = true;
      inputs.linesBefore = [
        colours.typeColour +
          inputs.type +
          colours.off +
          " " +
          colours.punct +
          inputs.brackets[0] +
          colours.off +
          " " +
          printedSelfLine +
          " " +
          colours.punct +
          inputs.brackets[1] +
          colours.off,
      ];
    }
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
