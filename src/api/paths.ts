import * as std from "std";
import * as os from "os";

export function cd(path: string): void {
  os.chdir(path);
}

export function pwd(): string {
  return os.getcwd();
}

export const OS_PATH_SEPARATOR = os.platform === "win32" ? "\\" : "/";

function getPathComponents(inputParts: Array<string> | string) {
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

export function makePath(...parts: Array<string | { separator: string }>) {
  const lastPart = parts[parts.length - 1];
  let separator = OS_PATH_SEPARATOR;
  if (typeof lastPart === "object") {
    separator = lastPart.separator;
  }

  const stringParts: Array<string> = parts.filter(
    (part) => typeof part === "string"
  ) as any;

  const components = getPathComponents(stringParts);

  return components.join(separator);
}

export function dirname(path: string) {
  const separator = path.includes("\\") ? "\\" : "/";
  const cleanPath = makePath(path, { separator });
  return cleanPath.split(separator).slice(0, -1).join(separator);
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
  const parts = getPathComponents(path);

  const newParts: Array<string> = [];
  let currentPart: string | undefined;
  while ((currentPart = parts.shift())) {
    if (currentPart === "." || currentPart === "..") {
      if (newParts.length === 0) {
        const pwdComponents = getPathComponents([from]);
        newParts.push(...pwdComponents.parts);
      }

      if (currentPart === "..") {
        newParts.pop();
      }
    } else {
      newParts.push(currentPart);
    }
  }

  return newParts.join(separator);
}

export function splitPath(path: string): Array<string> {
  return path.split(/\/|\\/g);
}

export function basename(path: string): string {
  const parts = splitPath(path);
  return parts[parts.length - 1];
}
