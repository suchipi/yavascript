import * as os from "os";
import minimatch from "minimatch";
import { exists } from "./filesystem";
import { pwd, paths } from "./paths";

export function glob(
  dir: string,
  patterns: Array<string>,
  { followSymlinks = false } = {}
): Array<string> {
  if (!exists(dir)) {
    throw new Error(`No such directory: ${dir} (from ${pwd()})`);
  }

  const startingDir = paths.resolve(dir);
  const allPatterns = patterns.map((pattern) => {
    if (pattern.startsWith("!")) {
      return {
        negated: true,
        pattern: paths.resolve("./" + pattern.slice(1), startingDir),
      };
    } else {
      return {
        negated: false,
        pattern: paths.resolve("./" + pattern, startingDir),
      };
    }
  });

  const negatedPatterns = allPatterns
    .filter(({ negated }) => negated)
    .map(({ pattern }) => pattern);

  const matches: Array<string> = [];

  function find(searchDir: string) {
    const children = os.readdir(searchDir);
    for (const child of children) {
      if (child === ".") continue;
      if (child === "..") continue;

      const fullName = searchDir + "/" + child;

      try {
        let stat: os.Stats;
        if (followSymlinks) {
          stat = os.stat(fullName);
        } else {
          stat = os.lstat(fullName);
        }

        if (
          allPatterns.every(({ pattern, negated }) => {
            let didMatch = minimatch(fullName, pattern);
            if (negated) didMatch = !didMatch;
            return didMatch;
          })
        ) {
          matches.push(fullName);
        }

        if (os.S_IFDIR & stat.mode) {
          // Only traverse deeper dirs if this one doesn't match a negated
          // pattern.
          //
          // TODO: it'd be better if it also avoided traversing deeper when
          // it'd be impossible for deeper dirs to ever match the patterns.
          //
          // Honestly, it'd be great to just have a c globstar library that
          // took care of all of this for us... because you end up needing
          // to be aware of the glob pattern parsing and syntax in order to
          // know the optimal traversal path.
          if (
            !negatedPatterns.some((pattern) => minimatch(fullName, pattern))
          ) {
            find(fullName);
          }
        }
      } catch (err: any) {
        try {
          console.warn(`glob encountered error: ${err.message}`);
        } catch (err2) {
          // ignore
        }
      }
    }
  }

  find(startingDir);

  return matches;
}
