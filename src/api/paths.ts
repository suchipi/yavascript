import * as std from "std";
import * as os from "os";

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

    return newParts.join(paths.OS_PATH_SEPARATOR);
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
