import * as os from "quickjs:os";
import { Path as NicePath } from "nice-path";
import { assert } from "../assert";
import { types } from "../types";
import { env } from "../env";
import { extname } from "../commands/extname";
import { PHENO_COERCE_OVERRIDE } from "pheno/coerce";

// Default value of env.PATHEXT on Windows Vista and up.
// XP is the same but without ".MSC".
const windowsDefaultPathExt =
  ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC";

class Path extends NicePath {
  static OS_SEGMENT_SEPARATOR = os.platform === "win32" ? "\\" : "/";
  static OS_ENV_VAR_SEPARATOR = os.platform === "win32" ? ";" : ":";
  static OS_PROGRAM_EXTENSIONS = new Set(
    os.platform === "win32"
      ? (env.PATHEXT || windowsDefaultPathExt).split(";")
      : [],
  );

  toString(): string {
    // nice-path renders a path with no segments as "/", but nothing joined to
    // nothing is the current directory, not the root.
    if (this.segments.length === 0) return ".";
    return super.toString();
  }

  relativeTo(dir: any, options: { noLeadingDot?: boolean } = {}): any {
    const dirPath = Path.isPath(dir) ? dir : new Path(dir);
    const ownSegments = [...this.segments];
    const dirSegments = [...dirPath.segments];

    // Guarding on length as well: once both run out, comparing undefined to
    // undefined is true forever.
    while (
      ownSegments.length > 0 &&
      dirSegments.length > 0 &&
      ownSegments[0] === dirSegments[0]
    ) {
      ownSegments.shift();
      dirSegments.shift();
    }

    const prefix = dirSegments.map(() => "..");
    const segments = [...prefix, ...ownSegments];

    if (prefix.length === 0 && !options.noLeadingDot) {
      segments.unshift(".");
    }

    return Path.from(segments, this.separator) as Path;
  }

  replaceAll(value: any, replacement: any): any {
    const target = (Path.isPath(value) ? value : new Path(value)).segments;
    const replacementSegments = Array.isArray(replacement)
      ? replacement.flatMap((part: any) =>
          Path.isPath(part) ? part.segments : Path.splitToSegments(part),
        )
      : (Path.isPath(replacement) ? replacement : new Path(replacement))
          .segments;

    const own = this.segments;
    const out: Array<string> = [];

    // Walking once, so a replacement is never rescanned and a shorter one
    // can't leave the scan position where it started.
    let index = 0;
    while (index < own.length) {
      const matches =
        target.length > 0 &&
        index + target.length <= own.length &&
        target.every((segment, offset) => own[index + offset] === segment);

      if (matches) {
        out.push(...replacementSegments);
        index += target.length;
      } else {
        out.push(own[index]);
        index++;
      }
    }

    return Path.from(out, this.separator) as Path;
  }

  static splitToSegments(inputParts: Array<string> | string): Array<string> {
    assert.type(
      inputParts,
      types.or(types.string, types.arrayOf(types.string)),
    );
    return super.splitToSegments(inputParts);
  }

  static detectSeparator<Fallback extends string | null = string>(
    input: Array<string> | string,
    // @ts-ignore might be instantiated with a different subtype
    fallback: Fallback = Path.OS_SEGMENT_SEPARATOR,
  ): string | Fallback {
    assert.type(input, types.or(types.string, types.arrayOf(types.string)));
    assert.type(fallback, types.or(types.string, types.null));

    return super.detectSeparator(input, fallback);
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
          types.arrayOf(types.or(types.string, types.Path)),
        ),
      ),
    );

    const path = new Path(...inputs);
    const segments = path.segments;
    const isAbsolute = segments[0] === "";
    const bodyStart = isAbsolute ? 1 : 0;
    const out: Array<string> = isAbsolute ? [""] : [];

    for (let i = bodyStart; i < segments.length; i++) {
      const segment = segments[i];
      if (segment === "") continue;

      if (segment === ".") {
        if (out.length === bodyStart) out.push(".");
        continue;
      }

      if (segment === "..") {
        const last = out.length > bodyStart ? out[out.length - 1] : undefined;
        if (last === ".") {
          out.pop();
          out.push("..");
        } else if (last != null && last !== "..") {
          out.pop();
        } else if (!isAbsolute) {
          // ".." above the root is still the root, but a relative path keeps it
          out.push("..");
        }
        continue;
      }

      out.push(segment);
    }

    if (!isAbsolute && out.length === 0) out.push(".");

    return Path.from(out, path.separator) as Path;
  }

  static isAbsolute(path: string | Path): boolean {
    assert.type(path, types.or(types.string, types.Path));

    return super.isAbsolute(path);
  }

  constructor(...inputs: Array<string | Path | Array<string | Path>>) {
    assert.type(
      inputs,
      types.arrayOf(
        types.or(
          types.string,
          types.Path,
          types.arrayOf(types.or(types.string, types.Path)),
        ),
      ),
    );

    // An empty input contributes a root segment, which would make
    // `new Path("", "etc")` absolute.
    super(...inputs.filter((input) => input !== ""));
  }

  static fromRaw(
    segments: Array<string>,
    separator: string = Path.OS_SEGMENT_SEPARATOR,
  ) {
    assert.type(segments, types.arrayOf(types.string));
    assert.type(separator, types.string);

    return super.fromRaw(segments, separator) as Path;
  }

  concat(...others: Array<string | Path | Array<string | Path>>): this {
    assert.type(
      others,
      types.arrayOf(
        types.or(
          types.string,
          types.Path,
          types.arrayOf(types.or(types.string, types.Path)),
        ),
      ),
    );

    return super.concat(...others);
  }

  toJSON(): string {
    return this.toString();
  }

  extname(options?: { full?: boolean }): string {
    return extname(this, options);
  }

  [inspect.custom](inputs: InspectCustomInputs) {
    if (
      typeof this.segments === "undefined" ||
      typeof this.separator === "undefined"
    ) {
      // inspecting Path.prototype, or a Path someone messed up
      return;
    }

    const { colours } = inputs;

    // remove prop lines for segments and separator as we'll print those
    // in our special way
    {
      const segmentsIndex = inputs.propLines.findIndex((line) =>
        line.startsWith(colours.keys + "segments" + colours.off),
      );
      const separatorIndex = inputs.propLines.findIndex((line) =>
        line.startsWith(colours.keys + "separator" + colours.off),
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

// All static methods need to be bound for backwards compatibility (they didn't
// use `this` in the past but now they do). Some of these don't strictly
// speaking need to be bound but it's easier to reason about if they're just all
// bound
Path.detectSeparator = Path.detectSeparator.bind(Path);
Path.from = Path.from.bind(Path);
Path.fromRaw = Path.fromRaw.bind(Path);
Path.isAbsolute = Path.isAbsolute.bind(Path);
Path.isPath = Path.isPath.bind(Path);
Path.normalize = Path.normalize.bind(Path);
Path.splitToSegments = Path.splitToSegments.bind(Path);

// pheno.coerce relies on a function's .toString() returning a value starting
// with "class" to see that function as a class, and therefore coerce it into
// the type "instanceOf(<thing>)" when it appears in a function that accepts a type
// validator (ie. `is` or `assert.type`).
//
// Normally, `Path.toString()` would already start with "class", because we
// defined it using class syntax. But, as part of compiling yavascript, the
// source code is converted to QuickJS bytecode, and that bytecode
// representation does not preserve Function bodies, so `Path.toString()`
// changes. It instead returns "function Path() {\n    [native code]\n}".
//
// Therefore, we add an explicit pheno coerce override.
Object.defineProperty(Path, PHENO_COERCE_OVERRIDE, {
  configurable: true,
  enumerable: false,
  value: function isPath(value: unknown) {
    return Path.isPath(value);
  },
});

export { Path };
