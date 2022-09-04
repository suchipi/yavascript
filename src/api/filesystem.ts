import * as std from "std";
import * as os from "os";
import { basename, paths, pwd } from "./paths";

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

export function readlink(path: string): string {
  if (os.readlink == null) {
    throw new Error(`readlink is not yet supported in ${os.platform}`);
  } else {
    return os.readlink(path);
  }
}

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
  try {
    const stats = os.lstat(path);

    if (Boolean((os.S_IFMT & stats.mode) === os.S_IFLNK)) {
      return isDir(os.realpath(path));
    }

    return Boolean((os.S_IFMT & stats.mode) === os.S_IFDIR);
  } catch {
    return false;
  }
}

export function isLink(path: string): boolean {
  try {
    const stats = os.lstat(path);
    return Boolean((os.S_IFMT & stats.mode) === os.S_IFLNK);
  } catch {
    return false;
  }
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

function getPathInfo(path: string) {
  if (isLink(path)) {
    try {
      const linkedPath = os.realpath(path);
      if (!exists(linkedPath)) return "nonexistent";
      if (isDir(linkedPath)) return "dir";
      return "file";
    } catch {
      return "nonexistent";
    }
  }

  if (!exists(path)) return "nonexistent";
  if (isDir(path)) return "dir";
  return "file";
}

export function ensureDir(path: string) {
  const components = paths.split(path);

  for (let i = 0; i < components.length; i++) {
    const componentsSoFar = components.slice(0, i + 1);
    const pathSoFar = componentsSoFar.join(paths.OS_PATH_SEPARATOR);
    if (pathSoFar === ".") continue;

    const info = getPathInfo(pathSoFar);
    switch (info) {
      case "nonexistent": {
        os.mkdir(pathSoFar, 0o775);
        break;
      }
      case "dir": {
        break;
      }
      case "file": {
        throw new Error(
          `Wanted to ensure that the directory path ${path} existed, but ${pathSoFar} was a file, not a directory`
        );
      }
    }
  }
}

function copyRaw(from: string, to: string): void {
  const filesToCloseLater: Array<std.FILE> = [];

  try {
    const fromFile = std.open(from, "rb");
    filesToCloseLater.push(fromFile);

    const toFile = std.open(to, "w");
    filesToCloseLater.push(toFile);

    const chunkSize = 256 * 1024; // 256KB
    const buffer = new ArrayBuffer(chunkSize);

    let pos = 0;
    while (!fromFile.eof()) {
      const bytesRead = fromFile.read(buffer, pos, chunkSize);
      if (bytesRead === 0) break;
      toFile.write(buffer, pos, bytesRead);
      pos += bytesRead;
    }
  } finally {
    try {
      for (const file of filesToCloseLater) {
        file.close();
      }
    } catch (err) {
      // ignored
    }
  }
}

export type CopyOptions = {
  whenTargetExists?: "overwrite" | "skip" | "error";
  trace?: (...args: Array<any>) => void;
};

export function copy(
  from: string,
  to: string,
  options: CopyOptions = { whenTargetExists: "error" }
): void {
  if (!exists(from)) {
    throw new Error(`Source path does not exist: ${from}`);
  }

  const sourceInfo = getPathInfo(from);
  const targetInfo = getPathInfo(to);

  if (options.trace) {
    options.trace.call(null, "copying", { from, to });
  }

  switch (`${sourceInfo} -> ${targetInfo}`) {
    case "dir -> file": {
      // Invalid
      throw new Error(
        `Attempting to copy folder to path where file already exists: ${to}`
      );
    }
    case "file -> dir": {
      // Copy file into dir
      const filename = basename(from);
      const target = paths.join(to, filename);
      copyRaw(from, target);
      return;
    }
    case "file -> nonexistent": {
      // Copy to file at target path
      copyRaw(from, to);
      return;
    }
    case "file -> file": {
      // Either overwrite, error, or skip, depending on whenTargetExists
      if (options.whenTargetExists === "error") {
        throw new Error(
          `File already exists: ${JSON.stringify(
            to
          )}. To skip or overwrite existing files, pass 'whenTargetExists' as an option to 'copy', with a value of either "skip" or "overwrite".`
        );
      }

      if (options.whenTargetExists === "skip") {
        return;
      }

      copyRaw(from, to);
      return;
    }
    case "dir -> nonexistent": {
      // Create new dir at target path and copy contents into it recursively
      ensureDir(to);

      const children = ls(from);
      for (const child of children) {
        const filename = basename(child);
        const target = paths.join(to, filename);
        copy(child, target, options);
      }
      return;
    }
    case "dir -> dir": {
      // Create new dir within target path and copy contents into it recursively
      const dirname = basename(from);
      const targetDir = paths.join(to, dirname);
      ensureDir(targetDir);

      const children = ls(from);
      for (const child of children) {
        const filename = basename(child);
        const target = paths.join(targetDir, filename);
        copy(child, target, options);
      }
      return;
    }
    case "nonexistent -> nonexistent":
    case "nonexistent -> dir":
    case "nonexistent -> file": {
      const error: any = new Error(
        `Attempting to copy a nonexistent file (from = ${from}, to = ${to})`
      );
      error.from = from;
      error.to = to;
      throw error;
    }

    default: {
      throw new Error(
        `Unhandled situation in 'copy' function: ${JSON.stringify({
          sourceInfo,
          targetInfo,
          from,
          to,
        })}`
      );
    }
  }
}
