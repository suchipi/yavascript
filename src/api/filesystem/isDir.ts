import * as os from "quickjs:os";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";

export function isDir(path: string | Path): boolean {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object",
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  path = appendSlashIfWindowsDriveLetter(path);

  try {
    let stats: os.Stats;
    if (os.platform === "win32") {
      // no lstat on windows
      stats = os.stat(path);
    } else {
      stats = os.lstat(path);
    }

    if (Boolean((os.S_IFMT & stats.mode) === os.S_IFLNK)) {
      return isDir(os.realpath(path));
    }

    return Boolean((os.S_IFMT & stats.mode) === os.S_IFDIR);
  } catch {
    return false;
  }
}
