import * as os from "quickjs:os";

export function realpath(path: string): string {
  return os.realpath(path);
}
