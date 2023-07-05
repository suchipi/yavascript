import * as os from "quickjs:os";
import { exists } from "./exists";
import { isLink } from "./isLink";
import { isDir } from "./isDir";

/** internal use only */
export function _getPathInfo(path: string) {
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
