import * as clefParse from "clef-parse";
import { Path } from "../path";
import { pwd } from "../commands/pwd";
import { assert } from "../assert";
import { types } from "../types";
import { makeErrorWithProperties } from "../../error-with-properties";

type Hint = typeof String | typeof Boolean | typeof Number | typeof Path;

export default function parseScriptArgs(
  hints: { [key: string]: Hint } = {},
  args: Array<string> = scriptArgs.slice(2)
): {
  flags: { [key: string]: any };
  args: Array<string>;
} {
  assert.type(
    hints,
    types.anyObject,
    "when present, 'hints' argument must be an object"
  );

  const hintsForClef: { [key: string]: clefParse.Hint } = {};
  for (const [key, value] of Object.entries(hints)) {
    if (typeof key !== "string") {
      throw makeErrorWithProperties(
        "all properties of 'hints' argument must be strings, but it was something else.",
        { actual: key },
        TypeError
      );
    }

    switch (value) {
      case String:
      case Boolean:
      case Number: {
        hintsForClef[key] = value;
        break;
      }

      case Path: {
        hintsForClef[key] = clefParse.Path;
        break;
      }

      default: {
        throw makeErrorWithProperties(
          `property '${key}' of 'hints' argument should be String, Boolean, Number, or Path, but it was something else.`,
          { actual: value },
          TypeError
        );
      }
    }
  }

  assert.type(
    args,
    types.arrayOf(types.string),
    "when present, 'args' argument must be an array of strings"
  );

  // clef-parse calls `shift` on this
  const argsClone = args.slice();

  const { options, positionalArgs } = clefParse.parseArgv(
    argsClone,
    hintsForClef,
    {
      isAbsolute: Path.isAbsolute,
      resolvePath: Path.resolve,
      getCwd: pwd,
    }
  );
  return {
    flags: options,
    args: positionalArgs,
  };
}
