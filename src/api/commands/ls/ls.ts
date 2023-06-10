import * as os from "quickjs:os";
import { pwd } from "../pwd/pwd";
import { Path } from "../../path";
import { isDir } from "../../filesystem";
import { is } from "../../is";
import { assert } from "../../assert";
import { setHelpText } from "../../help";
import lsHelpText from "./ls.help.md";

export function ls(
  dir: string | Path = pwd(),
  options: { relativePaths?: boolean } = { relativePaths: false }
): Array<string> {
  if (is(dir, types.Path)) {
    dir = dir.toString();
  }

  assert.type(
    dir,
    String,
    "'dir' argument must be either a string or a Path object"
  );

  assert.type(
    options,
    Object,
    "'options' argument must be either an object or undefined"
  );

  if (!isDir(dir)) {
    throw new Error(`Not a directory: ${dir}`);
  }
  let children = os
    .readdir(dir)
    .filter((child) => child !== "." && child !== "..");
  if (!options.relativePaths) {
    const parent = os.realpath(dir);
    children = children.map((child) => Path.join(parent, child));
  }

  return children;
}

setHelpText(ls, lsHelpText);
