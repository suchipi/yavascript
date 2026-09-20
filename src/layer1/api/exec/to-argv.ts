import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { makeErrorWithProperties } from "../../error-with-properties";

export function toArgv(
  args: string | Path | Array<string | number | Path>,
): Array<string> {
  let stringInput: string;

  if (is(args, types.string)) {
    stringInput = args;
  } else if (is(args, types.Path)) {
    // A Path is one program path, not a command line to be split on spaces.
    return [args.toString()];
  } else if (
    is(args, types.arrayOf(types.or(types.string, types.number, types.Path)))
  ) {
    return args.map((item) => String(item));
  } else {
    throw makeErrorWithProperties(
      "'args' argument must be either a string, a Path, or an array of strings/Paths/numbers",
      { received: args },
    );
  }

  const result: Array<string> = [];

  let mode: "DEFAULT" | "IN_DOUBLE_STRING" | "IN_SINGLE_STRING" = "DEFAULT";
  let argBeingBuilt = "";
  // Tracked separately from argBeingBuilt so that "" stays an empty argument
  // rather than disappearing.
  let argStarted = false;

  const chars = stringInput.split("");
  for (let i = 0; i < chars.length; i++) {
    const char: string = chars[i];
    const nextChar: string | null = chars[i + 1] ?? null;

    switch (`${char} during ${mode}`) {
      case `" during DEFAULT`: {
        mode = "IN_DOUBLE_STRING";
        argStarted = true;
        break;
      }
      case `' during DEFAULT`: {
        mode = "IN_SINGLE_STRING";
        argStarted = true;
        break;
      }
      case `${" "} during DEFAULT`:
      case `\t during DEFAULT`:
      case `\v during DEFAULT`:
      case `\n during DEFAULT`:
      case `\r during DEFAULT`: {
        if (argStarted) {
          result.push(argBeingBuilt);
          argBeingBuilt = "";
          argStarted = false;
        }
        break;
      }
      case `\\ during DEFAULT`: {
        if (nextChar === "\n" || nextChar === "\r") {
          // They are trying to escape the next newline like in bash.
          // They don't need to, but support this case in the way
          // they'd expect.
          break;
        } else {
          argBeingBuilt += "\\";
          argStarted = true;
          break;
        }
      }
      case `" during IN_DOUBLE_STRING`:
      case `' during IN_SINGLE_STRING`: {
        mode = "DEFAULT";
        break;
      }
      case `\\ during IN_DOUBLE_STRING`:
      case `\\ during IN_SINGLE_STRING`: {
        const escapedChars = {
          n: "\n",
          r: "\r",
          t: "\t",
          v: "\v",
          "0": String.fromCharCode(0),
          "\\": "\\",
          '"': '"',
          "'": "'",
        };

        if (escapedChars[nextChar]) {
          argBeingBuilt += escapedChars[nextChar];
          argStarted = true;
          i++; // skip next char
        } else {
          // They used backslash to escape something but it wasn't an escape sequence.
          // Ignore this `\` and let the escaped char get picked up via normal means.
        }

        break;
      }
      default: {
        argBeingBuilt += char;
        argStarted = true;
      }
    }
  }

  if (mode === "DEFAULT" && argStarted) {
    result.push(argBeingBuilt);
  } else if (mode === "IN_DOUBLE_STRING") {
    throw new Error(
      `Invalid command-line string: unterminated double-quote: ${stringInput}`,
    );
  } else if (mode === "IN_SINGLE_STRING") {
    throw new Error(
      `Invalid command-line string: unterminated single-quote: ${stringInput}`,
    );
  }

  return result;
}
