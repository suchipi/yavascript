import * as os from "quickjs:os";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { setHelpText } from "../help";
import isLinkHelpText from "./isLink.help.md";

export function isLink(path: string | Path): boolean {
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
    return Boolean((os.S_IFMT & stats.mode) === os.S_IFLNK);
  } catch {
    return false;
  }
}

setHelpText(isLink, isLinkHelpText);
