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

    return super.normalize(...inputs) as Path;
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

    super(...inputs);
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

    const isEmpty = this.segments.length === 0;
    if (isEmpty) {
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
