import * as os from "os";
import minimatch from "minimatch";
import { exists } from "./filesystem";
import { pwd, paths } from "./paths";
import { makeErrorWithProperties } from "../error-with-properties";

export type GlobOptions = {
  dir?: string;
  followSymlinks?: boolean;
  trace?: (...args: Array<any>) => void;
};

function compile(pattern: string, startingDir: string) {
  let prefix = "";
  if (pattern.startsWith("!")) {
    prefix = "!";
    pattern = pattern.slice(1);
  }

  const normalized =
    prefix +
    (paths.isAbsolute(pattern)
      ? pattern
      : paths.resolve("./" + pattern, startingDir));

  const regexp = minimatch.makeRe(normalized);
  if (!regexp) {
    throw makeErrorWithProperties("Invalid glob pattern", { pattern });
  }

  return regexp;
}

export function glob(
  patterns: string | Array<string>,
  options: GlobOptions = {}
): Array<string> {
  const dir = options.dir ?? pwd();
  const patternsArray = Array.isArray(patterns) ? patterns : [patterns];

  if (!exists(dir)) {
    throw new Error(`No such directory: ${dir} (from ${pwd()})`);
  }

  const startingDir = paths.resolve(dir);
  const allPatterns = patternsArray.map((pattern) => {
    return {
      negated: pattern.startsWith("!"),
      pattern,
      regexp: compile(pattern, startingDir),
    };
  });

  const negatedPatterns = allPatterns.filter(({ negated }) => negated);

  const matches: Array<string> = [];

  function find(searchDir: string) {
    if (options.trace) {
      options.trace.call(null, `reading children of ${searchDir}`);
    }
    const children = os.readdir(searchDir);

    if (options.trace) {
      options.trace.call(
        null,
        `found ${children.length} children of ${searchDir}`
      );
    }

    for (const child of children) {
      if (child === ".") continue;
      if (child === "..") continue;

      const fullName = searchDir + "/" + child;

      if (options.trace) {
        options.trace.call(null, `checking ${fullName}`);
      }

      try {
        let stat: os.Stats;
        if (options.followSymlinks) {
          stat = os.stat(fullName);
        } else {
          stat = os.lstat(fullName);
        }

        if (
          allPatterns.every(({ pattern, negated, regexp }) => {
            let didMatch = regexp.test(fullName);

            if (options.trace) {
              const info = JSON.stringify({
                didMatch,
                pattern,
                negated,
                fullName,
              });
              options.trace.call(null, `match info: ${info}`);
            }

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
          let shouldGoDeeper = true;
          for (const { regexp, pattern } of negatedPatterns) {
            const matchesNegated = !regexp.test(fullName);
            if (matchesNegated) {
              if (options.trace) {
                options.trace.call(
                  null,
                  `not traversing deeper into dir as it matches a negated pattern: ${JSON.stringify(
                    { dir: fullName, pattern }
                  )}`
                );
              }

              shouldGoDeeper = false;
              break;
            }
          }

          if (shouldGoDeeper) {
            find(fullName);
          }
        }
      } catch (err: any) {
        try {
          const message = `glob encountered error: ${err.message}`;
          if (options.trace) {
            options.trace.call(null, message);
          }
          console.warn(message);
        } catch (err2) {
          // ignore
        }
      }
    }
  }

  find(startingDir);

  return matches;
}
