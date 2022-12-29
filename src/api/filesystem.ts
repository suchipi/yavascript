import * as std from "std";
import * as os from "os";
import { basename } from "./commands/basename";
import { Path } from "./path";
import { makeErrorWithProperties } from "../error-with-properties";
import traceAll from "./traceAll";
import { ls } from "./commands/ls";
import { pipe } from "./pipe";

type ReadFile = {
  (path: string): string;
  (path: string, options: {}): string;
  (path: string, options: { binary: false }): string;
  (path: string, options: { binary: true }): ArrayBuffer;
};

export const readFile: ReadFile = function readFile(
  path: string,
  options: { binary?: boolean } = {}
): string | ArrayBuffer {
  if (options.binary) {
    return pipe({ path }, ArrayBuffer).target;
  } else {
    return std.loadFile(path);
  }
} as any;

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
  const components = Path.splitToSegments(path);

  for (let i = 0; i < components.length; i++) {
    const componentsSoFar = components.slice(0, i + 1);
    const pathSoFar = componentsSoFar.join(Path.OS_SEGMENT_SEPARATOR);
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

function copyRaw(
  from: string,
  to: string,
  trace:
    | undefined
    | ((...args: Array<any>) => void) = traceAll.getDefaultTrace()
): void {
  let filesToCloseLater: Record<string, FILE> = {};

  try {
    if (trace) {
      trace("opening", from, "(mode: rb)");
    }
    const fromFile = std.open(from, "rb");
    filesToCloseLater[from] = fromFile;

    if (trace) {
      trace("opening", to, "(mode: w)");
    }
    const toFile = std.open(to, "w");
    filesToCloseLater[to] = toFile;

    const chunkSize = 256 * 1024; // 256KB
    const buffer = new ArrayBuffer(chunkSize);

    const fromSize = os.stat(from).size;

    if (trace) {
      trace("copying data", { from, to, chunkSize });
    }
    while (!fromFile.eof()) {
      const amountRemaining = fromSize - fromFile.tell();
      if (trace) {
        trace(`${amountRemaining} bytes remaining`);
      }
      if (amountRemaining === 0) break;
      const amountToRead = Math.min(amountRemaining, chunkSize);

      const bytesRead = fromFile.read(buffer, 0, amountToRead);
      if (trace) {
        trace(`read ${bytesRead} bytes into buffer`);
      }
      if (bytesRead === 0) break;
      if (trace) {
        trace(`writing ${bytesRead} bytes from buffer into file`);
      }
      toFile.write(buffer, 0, bytesRead);
    }
    if (trace) {
      trace("reached eof");
    }
  } catch (err) {
    if (trace) {
      trace("copyRaw failed:", { from, to, err });
    }
    throw err;
  } finally {
    try {
      for (const [fileName, file] of Object.entries(filesToCloseLater)) {
        if (trace) {
          trace("closing", fileName);
        }
        file.close();
      }
      filesToCloseLater = {};
    } catch (err) {
      if (trace) {
        trace("copyRaw failed to close a file:", { from, to, err });
      }
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
  { whenTargetExists = "error", trace }: CopyOptions = {}
): void {
  if (!exists(from)) {
    throw new Error(`Source path does not exist: ${from}`);
  }

  const sourceInfo = getPathInfo(from);
  const targetInfo = getPathInfo(to);

  if (trace) {
    trace("copy requested", { from, to });
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
      const target = Path.join(to, filename);
      copyRaw(from, target, trace);
      return;
    }
    case "file -> nonexistent": {
      // Copy to file at target path
      copyRaw(from, to, trace);
      return;
    }
    case "file -> file": {
      // Either overwrite, error, or skip, depending on whenTargetExists
      if (whenTargetExists === "error") {
        throw new Error(
          `File already exists: ${JSON.stringify(
            to
          )}. To skip or overwrite existing files, pass 'whenTargetExists' as an option to 'copy', with a value of either "skip" or "overwrite".`
        );
      } else if (whenTargetExists === "skip") {
        return;
      } else if (whenTargetExists === "overwrite") {
        copyRaw(from, to, trace);
      } else {
        throw new Error(`Invalid whenTargetExists value: ${whenTargetExists}`);
      }
      return;
    }
    case "dir -> nonexistent": {
      // Create new dir at target path and copy contents into it recursively
      if (trace) {
        trace("ensuring dir", to);
      }
      ensureDir(to);

      const children = ls(from);
      for (const child of children) {
        const filename = basename(child);
        const target = Path.join(to, filename);
        copy(child, target, { whenTargetExists, trace });
      }
      return;
    }
    case "dir -> dir": {
      // Create new dir within target path and copy contents into it recursively
      const dirname = basename(from);
      const targetDir = Path.join(to, dirname);
      if (trace) {
        trace("ensuring dir", targetDir);
      }
      ensureDir(targetDir);

      const children = ls(from);
      for (const child of children) {
        const filename = basename(child);
        const target = Path.join(targetDir, filename);
        copy(child, target, { whenTargetExists, trace });
      }
      return;
    }
    case "nonexistent -> nonexistent":
    case "nonexistent -> dir":
    case "nonexistent -> file": {
      throw makeErrorWithProperties("Attempting to copy a nonexistent file", {
        from,
        to,
      });
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
