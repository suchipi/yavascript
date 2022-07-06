import * as std from "std";
import * as os from "os";

export const echo = console.log;

export function exec(command: string): void {
  os.exec(["sh", "-c", command], {
    stderr: std.err.fileno(),
    stdin: std.in.fileno(),
    stdout: std.out.fileno(),
  });
}

export function readFile(path: string): string {
  return std.loadFile(path)!;
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

export const quote = JSON.stringify.bind(JSON);

export function removeFile(path: string): void {
  os.remove(path);
}

export function removeDir(path: string): void {
  const children = os.readdir(path).map((child) => path + "/" + child);
  for (const child of children) {
    const stats = os.lstat(child);
    if (os.S_IFDIR & stats.mode) {
      removeDir(child);
    } else {
      removeFile(child);
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

export function cd(path: string): void {
  os.chdir(path);
}

export function pwd(): string {
  return os.getcwd();
}

export function glob(...inputs: Array<string>): Array<string> {
  throw new Error("not yet implemented");
}
