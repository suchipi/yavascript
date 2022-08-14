import * as os from "os";
import minimatch from "minimatch";
import { exists } from "./filesystem";
import { pwd } from "./paths";

export function glob(
  dir: string,
  patterns: Array<string>,
  { followSymlinks = false } = {}
): Array<string> {
  if (!exists(dir)) {
    throw new Error(`No such directory: ${dir} (from ${pwd()})`);
  }

  const matches: Array<string> = [];

  function find(searchDir: string) {
    const children = os.readdir(dir);
    for (const child of children) {
      if (child === ".") continue;
      if (child === "..") continue;

      const fullName = searchDir === "." ? child : searchDir + "/" + child;

      if (patterns.every((pattern) => minimatch(fullName, pattern))) {
        matches.push(fullName);

        try {
          let stat: os.Stats;
          if (followSymlinks) {
            stat = os.stat(fullName);
          } else {
            stat = os.lstat(fullName);
          }
          if (os.S_IFDIR & stat.mode) {
            find(fullName);
          }
        } catch (err) {
          // ignore I/O and access errors when searching
        }
      }
    }
  }

  find(dir);

  return matches;
}
