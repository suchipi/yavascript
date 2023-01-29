import * as os from "quickjs:os";
import { pwd } from "./pwd";
import { Path } from "../path";
import { isDir } from "../filesystem";
import { is } from "../is";
import { assert } from "../assert";

export function ls(
  dir: string | Path = pwd(),
  options: { relativePaths?: boolean } = { relativePaths: false }
): Array<string> {
  if (is.Path(dir)) {
    dir = dir.toString();
  }

  assert.string(dir, "'dir' argument must be either a string or a Path object");

  assert.object(
    options,
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
