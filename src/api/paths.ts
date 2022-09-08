import * as std from "std";
import * as os from "os";
import { makeErrorWithProperties } from "../error-with-properties";

export function cd(path: string): void {
  os.chdir(path);
}

export function pwd(): string {
  return os.getcwd();
}

export function realpath(path: string): string {
  return os.realpath(path);
}

export function dirname(path: string) {
  const separator = paths.detectSeparator(path);
  return paths.split(path).slice(0, -1).join(separator);
}

export function basename(path: string): string {
  const parts = paths.split(path);
  return parts[parts.length - 1];
}

export function extname(
  pathOrFilename: string,
  options: { full?: boolean } = {}
): string {
  const filename = basename(pathOrFilename);
  const parts = filename.split(".");

  if (parts.length === 1) {
    return "";
  }

  if (options.full) {
    return "." + parts.slice(1).join(".");
  } else {
    return "." + parts[parts.length - 1];
  }
}

export const paths = {
  OS_PATH_SEPARATOR: os.platform === "win32" ? "\\" : "/",

  split(inputParts: Array<string> | string): Array<string> {
    if (!Array.isArray(inputParts)) {
      inputParts = [inputParts];
    }

    return inputParts
      .map((part) => part.split(/(?:\/|\\)+/g))
      .flat(1)
      .filter((part, index) => {
        if (index === 0) return true;
        return Boolean(part);
      });
  },

  detectSeparator(input: Array<string> | string): string {
    let testStr = input;
    if (Array.isArray(input)) {
      testStr = input.join("|");
    }
    return testStr.includes("\\") ? "\\" : "/";
  },

  join(...parts: Array<string>) {
    const separator = paths.detectSeparator(parts);
    return paths.split(parts).join(separator);
  },

  resolve(path: string, from: string = pwd()): string {
    const parts = paths.split(path);

    const newParts: Array<string> = [];
    let currentPart: string | undefined;
    while (parts.length > 0) {
      currentPart = parts.shift();
      if (currentPart === "." || currentPart === "..") {
        if (newParts.length === 0) {
          const fromParts = paths.split(from);
          newParts.push(...fromParts);
        }

        if (currentPart === "..") {
          if (newParts.length > 0) {
            newParts.pop();
          } else {
            throw makeErrorWithProperties("Cannot resolve leading ..", {
              from,
              path,
            });
          }
        }
      } else if (currentPart != null) {
        newParts.push(currentPart);
      }
    }

    return newParts.join(paths.OS_PATH_SEPARATOR);
  },

  isAbsolute(path: string): boolean {
    const parts = paths.split(path);
    const firstPart = parts[0];

    // empty first component indicates that path starts with leading slash
    if (firstPart === "") return true;

    // windows drive
    if (/^[A-Za-z]:/.test(firstPart)) return true;

    // TODO: windows UNC paths (not supported very well by these path APIs at all, yet)

    return false;
  },
};

// Not public API; exported for __filename, which *is* a public API
export function get__filename(depth: number): string {
  return os.realpath(std.getFileNameFromStack(depth));
}

// Not public API; exported for __dirname, which *is* a public API
export function get__dirname(depth: number): string {
  const filename = os.realpath(std.getFileNameFromStack(depth));
  return dirname(filename);
}
