import * as os from "os";

export function realpath(path: string): string {
  return os.realpath(path);
}
