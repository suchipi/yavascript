import * as os from "quickjs:os";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";

export function exists(path: string | Path): boolean {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  path = appendSlashIfWindowsDriveLetter(path);

  try {
    os.access(path, os.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
