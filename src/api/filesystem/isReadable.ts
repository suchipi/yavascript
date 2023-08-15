import * as os from "quickjs:os";
import { assert } from "../assert";
import { types } from "../types";
import { setHelpText } from "../help";
import isReadableHelpText from "./isReadable.help.md";

export function isReadable(path: Path | string) {
  assert.type(
    path,
    types.or(types.Path, types.string),
    "'path' argument must be either a string or a Path object"
  );

  path = path.toString();

  // Throws error if doesn't exist
  os.access(path, os.F_OK);

  try {
    os.access(path, os.R_OK);
  } catch (err) {
    return false;
  }

  return true;
}

setHelpText(isReadable, isReadableHelpText);
