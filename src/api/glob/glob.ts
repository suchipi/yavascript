import * as os from "quickjs:os";
import minimatch from "minimatch";
import { exists } from "../filesystem";
import { pwd } from "../commands/pwd";
import { Path } from "../path";
import { makeErrorWithProperties } from "../../error-with-properties";
import { traceAll } from "../trace-all";
import { is } from "../is";
import { assert } from "../assert";
import { types } from "../types";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";

function compile(pattern: string, startingDir: string) {
  let prefix = "";
  if (pattern.startsWith("!")) {
    prefix = "!";
    pattern = pattern.slice(1);
  }

  const normalized =
    prefix +
    (Path.isAbsolute(pattern)
      ? pattern
      : Path.resolve(startingDir, "./" + pattern));

  const regexp = minimatch.makeRe(normalized);
  if (!regexp) {
    throw makeErrorWithProperties("Invalid glob pattern", { pattern });
  }

  return regexp;
}

export type GlobOptions = {
  dir?: string | Path;
  followSymlinks?: boolean;
  trace?: (...args: Array<any>) => void;
};

const HAS_GLOB_METACHARS_RE = /[*{}]|\+\(|^!/;

export function glob(
  patterns: string | Array<string>,
  options: GlobOptions = {}
): Array<Path> {
  assert.type(
    patterns,
    types.or(types.string, types.arrayOf(types.string)),
    "'patterns' argument must be either a string or an Array of strings"
  );

  assert.type(
    options,
    types.or(types.undefined, types.anyObject),
    "when present, 'options' argument must be an object"
  );

  assert.type(
    options.dir,
    types.or(types.string, types.Path, types.undefined),
    "when present, 'dir' option must be a string or Path"
  );

  assert.type(
    options.trace,
    types.or(types.undefined, types.anyFunction),
    "when present, 'trace' option must be a function"
  );

  let dir = options.dir ?? null;
  const trace = options.trace ?? traceAll.getDefaultTrace();
  const patternsArray = Array.isArray(patterns) ? patterns : [patterns];

  if (is(dir, types.Path)) {
    dir = dir.toString();
  }

  const absolutePatterns = patternsArray.filter((pattern) =>
    Path.isAbsolute(pattern)
  );

  if (dir == null && absolutePatterns.length > 0) {
    // If one or more patterns start with an absolute path, and the user didn't
    // request a specific dir, we should use the highest common parent path of
    // those patterns which start with an absolute path
    const dirsFromPatterns = absolutePatterns.map((absolutePattern) => {
      // The leading parts of the pattern which don't contain glob metachars
      const leadingParts: Array<string> = [];
      for (const part of Path.splitToSegments(absolutePattern)) {
        if (HAS_GLOB_METACHARS_RE.test(part)) {
          break;
        }
        leadingParts.push(part);
      }

      const result = Path.from(
        leadingParts,
        Path.detectSeparator(absolutePattern, "/")
      ).normalize();

      if (trace) {
        trace(
          `using absolute pattern to infer starting dir: ${JSON.stringify(
            absolutePattern
          )} -> ${JSON.stringify(result.toString())}`
        );
      }

      return result;
    });

    const commonParentDirParts: Array<string> = [];
    for (const patternDir of dirsFromPatterns) {
      if (commonParentDirParts.length === 0) {
        commonParentDirParts.push(...patternDir.segments);
      } else {
        for (let i = 0; i < patternDir.segments.length; i++) {
          const segment = patternDir.segments[i];
          if (commonParentDirParts[i] !== segment) {
            // truncate the array
            commonParentDirParts.length = i;
          }
        }
      }
    }

    if (commonParentDirParts.length === 0) {
      throw new Error(
        "No initial dir for the glob search was specified, and one or more patterns specify an absolute path, but the specified absolute paths have no common parent path. Not sure where to start the glob search. Please specify a starting path with option 'dir'."
      );
    } else {
      dir = Path.from(commonParentDirParts).normalize();

      if (trace) {
        trace(
          `inferred starting dir from absolute pattern(s): ${dir.toString()}`
        );

        if (dir.segments.length === 1) {
          trace("--- WARNING: inferred starting dir to root dir! ---");
        }
      }
    }
  }

  if (dir == null) {
    dir = pwd();
  }

  if (!exists(dir)) {
    throw new Error(`No such directory: ${dir} (from ${pwd()})`);
  }

  const startingDir = Path.resolve(dir);
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
    if (trace) {
      trace(`reading children of ${searchDir}`);
    }

    searchDir = appendSlashIfWindowsDriveLetter(searchDir);

    const children = os.readdir(searchDir);

    if (trace) {
      trace(`found ${children.length} children of ${searchDir}`);
    }

    for (const child of children) {
      if (child === ".") continue;
      if (child === "..") continue;

      const fullName = searchDir + "/" + child;

      if (trace) {
        trace(`checking ${fullName}`);
      }

      try {
        let stat: os.Stats;
        if (options.followSymlinks) {
          stat = os.stat(fullName);
        } else {
          if (os.platform === "win32") {
            // no lstat on windows
            stat = os.stat(fullName);
          } else {
            stat = os.lstat(fullName);
          }
        }

        if (
          allPatterns.every(({ pattern, negated, regexp }) => {
            let didMatch = regexp.test(fullName);

            if (trace) {
              trace(
                "match info:",
                JSON.stringify({
                  didMatch,
                  pattern,
                  negated,
                  fullName,
                })
              );
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
              if (trace) {
                trace(
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
          if (trace) {
            trace(message);
          }
          console.warn(message);
        } catch (err2) {
          // ignore
        }
      }
    }
  }

  find(startingDir);

  return matches.map((str) => new Path(str));
}
