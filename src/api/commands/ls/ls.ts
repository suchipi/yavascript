import * as os from "quickjs:os";
import { pwd } from "../pwd/pwd";
import { Path } from "../../path";
import { isDir } from "../../filesystem";
import { is } from "../../is";
import { assert } from "../../assert";
import { appendSlashIfWindowsDriveLetter } from "../../path/_win32Helpers";
import { types } from "../../types";

export function ls(dir: string | Path = pwd()): Array<Path> {
  if (is(dir, types.Path)) {
    dir = dir.toString();
  }

  assert.type(
    dir,
    String,
    "'dir' argument must be either a string or a Path object"
  );

  dir = appendSlashIfWindowsDriveLetter(dir);

  if (!isDir(dir)) {
    throw new Error(`Not a directory: ${dir}`);
  }

  const parent = os.realpath(dir);

  let children = os
    .readdir(dir)
    .filter((child) => child !== "." && child !== "..")
    .map((child) => {
      return new Path(parent, child);
    });

  return children;
}
