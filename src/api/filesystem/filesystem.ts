import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { basename } from "../commands/basename";
import { Path } from "../path";
import { makeErrorWithProperties } from "../../error-with-properties";
import { traceAll } from "../trace-all";
import { ls } from "../commands/ls";
import { pipe } from "../pipe";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { setHelpText } from "../help";
import readFileHelpText from "./readFile.help.md";
import writeFileHelpText from "./writeFile.help.md";
import isDirHelpText from "./isDir.help.md";
import isLinkHelpText from "./isLink.help.md";
import removeHelpText from "./remove.help.md";

type ReadFile = {
  (path: string | Path): string;
  (path: string | Path, options: {}): string;
  (path: string | Path, options: { binary: false }): string;
  (path: string | Path, options: { binary: true }): ArrayBuffer;
};

export const readFile: ReadFile = function readFile(
  path: string | Path,
  options: { binary?: boolean } = {}
): string | ArrayBuffer {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  assert.type(
    options,
    types.or(types.undefined, types.anyObject),
    "when present, 'options' argument must be an object"
  );

  assert.type(
    options.binary,
    types.or(types.undefined, types.boolean),
    "when present, 'binary' options must be a boolean"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  if (options.binary) {
    return pipe({ path }, ArrayBuffer).target;
  } else {
    return std.loadFile(path);
  }
} as any;

setHelpText(readFile, readFileHelpText);

export function writeFile(
  path: string | Path,
  data: string | ArrayBuffer
): void {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  assert.type(
    data,
    types.or(types.string, types.ArrayBuffer),
    "'data' argument must be either a string or an ArrayBuffer"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

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

setHelpText(writeFile, writeFileHelpText);

export function isDir(path: string | Path): boolean {
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

    if (Boolean((os.S_IFMT & stats.mode) === os.S_IFLNK)) {
      return isDir(os.realpath(path));
    }

    return Boolean((os.S_IFMT & stats.mode) === os.S_IFDIR);
  } catch {
    return false;
  }
}

setHelpText(isDir, isDirHelpText);

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

export function remove(path: string | Path): void {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

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

setHelpText(remove, removeHelpText);

export function exists(path: string | Path): boolean {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  try {
    os.access(path, os.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

// TODO: isReadable, isWritable, isExecutable

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

export function ensureDir(path: string | Path) {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  const components = Path.splitToSegments(path);

  for (let i = 0; i < components.length; i++) {
    const componentsSoFar = components.slice(0, i + 1);
    const pathSoFar = componentsSoFar.join(Path.OS_SEGMENT_SEPARATOR);
    if (pathSoFar === ".") continue;
    if (pathSoFar === "") continue;

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
  let fdsToCloseLater: Record<string, number> = {};

  let fromStats: os.Stats | null = null;

  try {
    if (trace) {
      trace("opening", from, "(mode: rb)");
    }
    const fromFile = std.open(from, "rb");
    filesToCloseLater[from] = fromFile;

    fromStats = os.stat(from);
    const fromPerms = fromStats.mode & (os.S_IRWXU | os.S_IRWXG | os.S_IRWXO);

    if (trace) {
      trace(
        "opening",
        to,
        `(flags: O_WRONLY | O_CREAT, mode: 0o${fromPerms.toString(8)})`
      );
    }
    const toFd = os.open(to, os.O_WRONLY | os.O_CREAT, fromPerms);
    fdsToCloseLater[to] = toFd;
    const toFile = std.fdopen(toFd, "w");
    filesToCloseLater[to] = toFile;

    const chunkSize = 16 * 1024 * 1024; // 16MB
    const buffer = new ArrayBuffer(chunkSize);

    if (trace) {
      trace("copying data", { from, to, chunkSize });
    }
    while (!fromFile.eof()) {
      const amountRemaining = fromStats.size - fromFile.tell();
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

    try {
      for (const [fileName, fd] of Object.entries(fdsToCloseLater)) {
        if (trace) {
          trace("closing fd", fd, `(${fileName})`);
        }
        os.close(fd);
      }
      fdsToCloseLater = {};
    } catch (err) {
      if (trace) {
        trace("copyRaw failed to close an fd:", { from, to, err });
      }
      // ignored
    }

    if (fromStats != null) {
      try {
        // TODO: birth time, too. need crtime bindings from quickjs to do that
        os.utimes(to, fromStats.atime, fromStats.mtime);
      } catch (err) {
        if (trace) {
          trace("copyRaw failed to set access and modification times:", {
            from,
            to,
            err,
          });
        }
        throw err;
      }
    }
  }
}

export type CopyOptions = {
  whenTargetExists?: "overwrite" | "skip" | "error";
  trace?: (...args: Array<any>) => void;
};

// TODO: mv (move file without copy)

export function copy(
  from: string | Path,
  to: string | Path,
  options: CopyOptions = {}
): void {
  assert.type(
    from,
    types.or(types.string, types.Path),
    "'from' argument must be either a string or a Path object"
  );

  assert.type(
    to,
    types.or(types.string, types.Path),
    "'to' argument must be either a string or a Path object"
  );

  assert.type(
    options,
    types.or(types.undefined, types.anyObject),
    "when present, 'options' argument must be an object"
  );

  const { whenTargetExists = "error", trace } = options;

  assert.type(
    whenTargetExists,
    types.or(
      types.exactString("overwrite"),
      types.exactString("skip"),
      types.exactString("error")
    ),
    'when present, \'whenTargetExists\' option must be either "overwrite", "skip", or "error".'
  );

  assert.type(
    trace,
    types.or(types.undefined, types.anyFunction),
    "when present, 'trace' option must be a function."
  );

  if (is(to, types.Path)) {
    to = to.toString();
  }

  if (is(from, types.Path)) {
    from = from.toString();
  }

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
