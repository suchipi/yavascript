import * as os from "quickjs:os";
import { assert } from "../assert";
import { types } from "../types";
import { setHelpText } from "../help";
import isWritableHelpText from "./isWritable.help.md";

export function isWritable(path: Path | string) {
  assert.type(
    path,
    types.or(types.Path, types.string),
    "'path' argument must be either a string or a Path object"
  );

  path = path.toString();

  try {
    os.access(path, os.W_OK);
  } catch (err) {
    return false;
  }

  return true;
}

setHelpText(isWritable, isWritableHelpText);
