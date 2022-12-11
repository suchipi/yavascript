import * as std from "std";
import * as os from "os";
import { dirname } from "./commands/dirname";

// Not public API; exported for __filename, which *is* a public API
export function get__filename(depth: number): string {
  return os.realpath(std.getFileNameFromStack(depth));
}

// Not public API; exported for __dirname, which *is* a public API
export function get__dirname(depth: number): string {
  const filename = os.realpath(std.getFileNameFromStack(depth));
  return dirname(filename);
}
