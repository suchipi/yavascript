import * as clefParse from "clef-parse";
import { Path } from "../path";
import { pwd } from "../commands/pwd";
import { assert } from "../assert";
import { types, TypeValidator } from "../types";
import { makeErrorWithProperties } from "../../error-with-properties";

type Hint =
  | typeof String
  | typeof Boolean
  | typeof Number
  | typeof Path
  | TypeValidator<Array<string | boolean | number | Path>>;

let defaultArgs: Array<string> | null = null;

/** internal use only; called by the CLI once it knows which args are the user's */
export function _setDefaultArgs(args: Array<string>) {
  defaultArgs = args;
}

// clef-parse splits on an ASCII-only word boundary and drops any part with no
// ASCII alphanumerics in it, so "--hello" survives but "--héllo" comes back as
// "hLlo".
function toCamelCase(input: string): string {
  const parts = input
    .replace(/^-{1,2}/, "")
    .replace(/([\p{Ll}\p{N}])([\p{Lu}])/gu, "$1_$2")
    .replace(/([\p{Lu}]+)([\p{Lu}][\p{Ll}])/gu, "$1_$2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((part) => part.toLowerCase());

  const [first, ...rest] = parts;
  if (first == null) return "";
  return [
    first,
    ...rest.map((part) => part[0].toUpperCase() + part.slice(1)),
  ].join("");
}

// clef-parse reads anything starting with "-" as another flag rather than a
// value, so a lone "-" becomes a flag named "" and "-3" a flag named "3".
// These are hidden behind a marker for the parse and restored afterwards.
const MARKER = "\u0000clef\u0000";

function hideDashes(args: Array<string>): Array<string> {
  return args.map((arg) => {
    if (arg === "-" || /^-(\d+(\.\d+)?|\.\d+)$/.test(arg)) {
      return MARKER + arg;
    }

    if (arg.startsWith("-")) {
      const equalsOffset = arg.indexOf("=");
      if (equalsOffset !== -1 && arg[equalsOffset + 1] === "-") {
        return (
          arg.slice(0, equalsOffset + 1) + MARKER + arg.slice(equalsOffset + 1)
        );
      }
    }

    return arg;
  });
}

function showDashes(value: any): any {
  if (typeof value === "string" && value.startsWith(MARKER)) {
    return value.slice(MARKER.length);
  }
  if (Array.isArray(value)) {
    return value.map(showDashes);
  }
  return value;
}

export function parseScriptArgs(
  hints: { [key: string]: Hint } = {},
  args: Array<string> = defaultArgs ?? scriptArgs.slice(2),
): {
  flags: { [key: string]: any };
  args: Array<string>;
  metadata: {
    keys: {
      [key: string]: string | undefined;
    };
    hints: {
      [key: string]: string | undefined;
    };
    guesses: {
      [key: string]: string | undefined;
    };
  };
} {
  assert.type(
    hints,
    types.anyObject,
    "when present, 'hints' argument must be an object",
  );

  const hintsForClef: { [key: string]: clefParse.Hint } = {};
  const pathKeys: Set<string> = new Set();
  const arrayOfPathKeys: Set<string> = new Set();
  for (const [key, value] of Object.entries(hints)) {
    if (typeof key !== "string") {
      throw makeErrorWithProperties(
        "all properties of 'hints' argument must be strings, but it was something else.",
        { actual: key },
        TypeError,
      );
    }

    outerSwitch: switch (value) {
      case String:
      case Boolean:
      case Number: {
        hintsForClef[key] = value;
        break;
      }

      case Path: {
        hintsForClef[key] = clefParse.Path;
        pathKeys.add(key);
        break;
      }

      default: {
        if (typeof value === "function") {
          switch (value.name) {
            case "arrayOf(string)": {
              hintsForClef[key] = clefParse.arrayOfStrings;
              break outerSwitch;
            }
            case "arrayOf(number)": {
              hintsForClef[key] = clefParse.arrayOfNumbers;
              break outerSwitch;
            }
            case "arrayOf(boolean)": {
              hintsForClef[key] = clefParse.arrayOfBooleans;
              break outerSwitch;
            }
            case "arrayOf(Path)":
            case "arrayOf(isPath)": {
              hintsForClef[key] = clefParse.arrayOfPaths;
              arrayOfPathKeys.add(key);
              break outerSwitch;
            }
          }
        }

        throw makeErrorWithProperties(
          `property '${key}' of 'hints' argument should be String, Boolean, Number, Path, or types.arrayOf(<one of those>), but it was something else.`,
          { actual: value },
          TypeError,
        );
      }
    }
  }

  assert.type(
    args,
    types.arrayOf(types.string),
    "when present, 'args' argument must be an array of strings",
  );

  // clef-parse calls `shift` on this
  const argsClone = hideDashes(args);

  const { options, positionalArgs, metadata } = clefParse.parseArgv(
    argsClone,
    hintsForClef,
    {
      isAbsolute: Path.isAbsolute,
      resolvePath: (...args) =>
        Path.fromRaw(args, Path.OS_SEGMENT_SEPARATOR).normalize().toString(),
      getCwd: () => pwd().toString(),
    },
  );

  const optionsClone = { ...options };
  for (const key of pathKeys) {
    if (Object.hasOwn(optionsClone, key)) {
      optionsClone[key] = new Path(optionsClone[key].toString());
    }
  }
  for (const key of arrayOfPathKeys) {
    if (Object.hasOwn(optionsClone, key)) {
      optionsClone[key] = optionsClone[key].map(
        (value: any) => new Path(value.toString()),
      );
    }
  }

  const flags: { [key: string]: any } = {};
  const renamedKeys: { [key: string]: string } = {};
  for (const [originalKey, clefKey] of Object.entries(metadata.keys)) {
    renamedKeys[clefKey as string] = toCamelCase(originalKey);
  }

  for (const [key, value] of Object.entries(optionsClone)) {
    flags[renamedKeys[key] ?? key] = showDashes(value);
  }

  const renameOf = (record: { [key: string]: any }) => {
    const result: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(record)) {
      result[renamedKeys[key] ?? key] = value;
    }
    return result;
  };

  return {
    flags,
    args: positionalArgs.map(showDashes),
    metadata: {
      keys: Object.fromEntries(
        Object.entries(metadata.keys).map(([originalKey]) => [
          originalKey,
          toCamelCase(originalKey),
        ]),
      ),
      hints: renameOf(metadata.hints),
      guesses: renameOf(metadata.guesses),
    },
  };
}
