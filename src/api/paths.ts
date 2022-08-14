import * as std from "std";
import * as os from "os";

export function cd(path: string): void {
  os.chdir(path);
}

export function pwd(): string {
  return os.getcwd();
}

export const OS_PATH_SEPARATOR = os.platform === "win32" ? "\\" : "/";

export function makePath(...parts: Array<string | { separator: string }>) {
  const lastPart = parts[parts.length - 1];
  let options: { separator: string } | null = null;
  if (typeof lastPart === "object") {
    options = lastPart as any;
  }

  let separator = OS_PATH_SEPARATOR;
  if (options != null && options.separator) {
    separator = options.separator;
  }

  let stringParts = (
    parts.filter((part) => typeof part === "string") as any as Array<string>
  )
    .map((part) => part.split(separator))
    .filter(Boolean)
    .flat(1)
    .filter(Boolean);

  const wrongSeparator = separator === "\\" ? "/" : "\\";

  let resultingString = stringParts
    .map((part) => {
      return part.replace(
        new RegExp("\\" + wrongSeparator + "+", "g"),
        separator
      );
    })
    .join(separator);

  if (typeof parts[0] === "string" && parts[0].startsWith(separator)) {
    resultingString = separator + resultingString;
  }

  return resultingString;
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

export function splitPath(path: string): Array<string> {
  return path.split(/\/|\\/g);
}

export function basename(path: string): string {
  const parts = splitPath(path);
  return parts[parts.length - 1];
}
