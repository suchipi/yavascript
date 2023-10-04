import * as os from "quickjs:os";
import { pwd } from "../pwd/pwd";
import { Path } from "../../path";
import { isDir } from "../../filesystem";
import { is } from "../../is";
import { assert } from "../../assert";
import { setHelpText } from "../../help";
import lsHelpText from "./ls.help.md";
import { appendSlashIfWindowsDriveLetter } from "../../path/_win32Helpers";

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
      return Path.join(parent, child);
    });

  return children;
}

setHelpText(ls, lsHelpText);
