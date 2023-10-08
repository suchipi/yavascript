import { env } from "../../env";
import { Path } from "../../path";
import { exists, isExecutable } from "../../filesystem";
import { setHelpText } from "../../help";
import whichHelpText from "./which.help.md";
import { assert } from "../../assert";
import { types } from "../../types";
import { quote } from "../../strings";

function optionDefaults() {
  return {
    searchPaths: env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR) || [],
    suffixes: Array.from(Path.OS_PROGRAM_EXTENSIONS),
    trace: traceAll.getDefaultTrace(),
  };
}

export function which(
  binaryName: string,
  options?: {
    searchPaths?: Array<Path | string>;
    suffixes?: Array<string>;
    trace?: (...args: Array<any>) => void;
  }
): Path | null {
  assert.type(binaryName, types.string, "'binaryName' must be a string");
  assert.type(
    options,
    types.or(types.undefined, types.object),
    "when present, 'options' must be an object"
  );

  if (options != null) {
    assert.type(
      options.searchPaths,
      types.or(
        types.undefined,
        types.arrayOf(types.or(types.Path, types.string))
      ),
      "when present, 'options.searchPaths' must be an Array of strings and/or Paths"
    );
    assert.type(
      options.suffixes,
      types.or(types.undefined, types.arrayOf(types.string)),
      "when present, 'options.suffixes' must be an Array of strings"
    );
    assert.type(
      options.trace,
      types.or(types.undefined, types.Function),
      "when present, 'options.trace' must be a Function"
    );
  }

  const defaults = optionDefaults();
  const {
    searchPaths = defaults.searchPaths,
    suffixes = defaults.suffixes,
    trace = defaults.trace,
  } = options ?? defaults;

  for (const lookupPath of searchPaths) {
    if (trace) {
      trace(
        `which: Searching for ${quote(binaryName)} in ${quote(lookupPath)}`
      );
    }

    const potentialPaths = new Set([new Path(lookupPath, binaryName)]);
    for (const suffix of suffixes) {
      potentialPaths.add(new Path(lookupPath, binaryName + suffix));
    }

    for (const potentialPath of potentialPaths) {
      if (trace) {
        trace(`which: Checking for ${quote(potentialPath)}`);
      }

      if (exists(potentialPath) && isExecutable(potentialPath)) {
        if (trace) {
          trace(
            `which: Found ${quote(binaryName)} at ${quote(potentialPath)}!`
          );
        }
        return potentialPath;
      }
    }
  }

  if (trace) {
    trace(`which: Failed to find ${quote(binaryName)}...`);
  }
  return null;
}

setHelpText(which, whichHelpText);
