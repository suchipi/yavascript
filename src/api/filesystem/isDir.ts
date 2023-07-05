import * as os from "quickjs:os";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { setHelpText } from "../help";
import isDirHelpText from "./isDir.help.md";

export function isDir(path: string | Path): boolean {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  try {
    const stats = os.lstat(path);

    if (Boolean((os.S_IFMT & stats.mode) === os.S_IFLNK)) {
      return isDir(os.realpath(path));
    }

    return Boolean((os.S_IFMT & stats.mode) === os.S_IFDIR);
  } catch {
    return false;
  }
}

setHelpText(isDir, isDirHelpText);
