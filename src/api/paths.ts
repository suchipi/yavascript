import * as std from "std";
import * as os from "os";

export function cd(path: string): void {
  os.chdir(path);
}

export function pwd(): string {
  return os.getcwd();
}

export const OS_PATH_SEPARATOR = os.platform === "win32" ? "\\" : "/";

export function splitPath(inputParts: Array<string> | string): Array<string> {
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
}

export function detectPathSeparator(input: Array<string> | string): string {
  let testStr = input;
  if (Array.isArray(input)) {
    testStr = input.join("|");
  }
  return testStr.includes("\\") ? "\\" : "/";
}

export function makePath(...parts: Array<string>) {
  const separator = detectPathSeparator(parts);
  return splitPath(parts).join(separator);
}

export function dirname(path: string) {
  const separator = detectPathSeparator(path);
  return splitPath(path).slice(0, -1).join(separator);
}

export function get__filename(): string {
  return os.realpath(std.getFileNameFromStack(2));
}

export function get__dirname(): string {
  const filename = os.realpath(std.getFileNameFromStack(2));
  return dirname(filename);
}

export function realpath(path: string): string {
  return os.realpath(path);
}

export function resolvePath(path: string, from: string = pwd()): string {
  const parts = splitPath(path);

  const newParts: Array<string> = [];
  let currentPart: string | undefined;
  while (parts.length > 0) {
    currentPart = parts.shift();
    if (currentPart === "." || currentPart === "..") {
      if (newParts.length === 0) {
        const fromParts = splitPath(from);
        newParts.push(...fromParts);
      }

      if (currentPart === "..") {
        if (newParts.length > 0) {
          newParts.pop();
        } else {
          const err = new Error(
            `Cannot resolve leading .. from path ${JSON.stringify(
              from
            )} (path = ${path})`
          );
          Object.assign(err, {
            from,
            path,
          });
          throw err;
        }
      }
    } else if (currentPart != null) {
      newParts.push(currentPart);
    }
  }

  return newParts.join(OS_PATH_SEPARATOR);
}

export function basename(path: string): string {
  const parts = splitPath(path);
  return parts[parts.length - 1];
}
