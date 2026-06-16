import * as os from "quickjs:os";
import { assert } from "../assert";
import { types } from "../types";
import type { Path } from "../path";

export function isWritable(path: Path | string) {
  assert.type(
    path,
    types.or(types.Path, types.string),
    "'path' argument must be either a string or a Path object",
  );

  path = path.toString();

  try {
    os.access(path, os.W_OK);
  } catch (err) {
    return false;
  }

  return true;
}
