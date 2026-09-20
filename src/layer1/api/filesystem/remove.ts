import * as os from "quickjs:os";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";
import { isDir } from "./isDir";
import { isLink } from "./isLink";

export function remove(path: string | Path): void {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object",
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  path = appendSlashIfWindowsDriveLetter(path);

  // isDir follows symlinks, so without the isLink check a link to a directory
  // would get its target emptied instead of just being unlinked.
  if (!isLink(path) && isDir(path)) {
    const children = os
      .readdir(path)
      .filter((child) => child !== "." && child !== "..")
      .map((child) => path + "/" + child);

    for (const child of children) {
      remove(child);
    }
  }

  os.remove(path);
}
