import * as os from "os";
import { pwd } from "./pwd";
import { paths } from "../paths";
import { isDir } from "../filesystem";

export function ls(
  dir: string = pwd(),
  options: { relativePaths?: boolean } = { relativePaths: false }
): Array<string> {
  if (!isDir(dir)) {
    throw new Error(`Not a directory: ${dir}`);
  }
  let children = os
    .readdir(dir)
    .filter((child) => child !== "." && child !== "..");
  if (!options.relativePaths) {
    const parent = os.realpath(dir);
    children = children.map((child) => paths.join(parent, child));
  }

  return children;
}
