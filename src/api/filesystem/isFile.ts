import * as os from "quickjs:os";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { setHelpText } from "../help";
import isFileHelpText from "./isFile.help.md";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";

export function isFile(path: string | Path) {
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
    const stats = os.stat(path);
    return (stats.mode & os.S_IFMT) == os.S_IFREG;
  } catch (err) {
    return false;
  }
}

setHelpText(isFile, isFileHelpText);
