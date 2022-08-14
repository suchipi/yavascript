import * as std from "std";
import * as os from "os";
import { makePath, pwd } from "./paths";

export function readFile(path: string): string {
  return std.loadFile(path);
}

export function writeFile(path: string, data: string | ArrayBuffer): void {
  const file = std.open(path, "w");
  try {
    if (typeof data === "string") {
      file.puts(data);
    } else {
      file.write(data, 0, data.byteLength);
    }
  } finally {
    file.close();
  }
}

export function isDir(path: string): boolean {
  const stats = os.stat(path);
  return Boolean(os.S_IFDIR & stats.mode);
}

export function remove(path: string): void {
  if (isDir(path)) {
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

export function exists(path: string): boolean {
  try {
    os.access(path, os.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

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
    children = children.map((child) => makePath(parent, child));
  }

  return children;
}

export function readlink(path: string): string {
  if (os.readlink == null) {
    throw new Error(`readlink is not yet supported in ${os.platform}`);
  } else {
    return os.readlink(path);
  }
}
