import * as os from "quickjs:os";
import minimatch from "minimatch";
import { exists, isDir } from "../filesystem";
import { pwd } from "../commands/pwd";
import { Path } from "../path";
import { makeErrorWithProperties } from "../../error-with-properties";
import { logger } from "../logger";
import { is } from "../is";
import { assert } from "../assert";
import { types } from "../types";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";
import { quote } from "../strings";

// "!(" opens an extglob group, so only a bare leading "!" negates.
function isNegated(pattern: string): boolean {
  return pattern.startsWith("!") && !pattern.startsWith("!(");
}

// Minimatch reads these as syntax, so a real directory name containing one has
// to be escaped before it becomes part of a pattern.
function escapeGlobMetachars(text: string): string {
  return text.replace(/[*?[\]{}()!+@\\]/g, "\\$&");
}

function compile(pattern: string, startingDir: string) {
  const negated = isNegated(pattern);
  let body = negated ? pattern.slice(1) : pattern;

  const dirOnly = body.endsWith("/");
  if (dirOnly) {
    body = body.slice(0, -1);
  }

  let base = startingDir;
  let text: string;

  if (Path.isAbsolute(body)) {
    text = body;
  } else {
    // Only the leading segments without wildcards get resolved against the
    // starting dir. Everything from the first wildcard on is left exactly as
    // written, so escapes and separators keep their meaning.
    const segments = body.split("/");
    let splitAt = 0;
    while (
      splitAt < segments.length &&
      !HAS_GLOB_METACHARS_RE.test(segments[splitAt])
    ) {
      splitAt++;
    }

    const literal = segments.slice(0, splitAt);
    const rest = segments.slice(splitAt);

    base = Path.normalize([startingDir, ...literal].join("/")).toString();
    text = escapeGlobMetachars(base);
    if (rest.length > 0) {
      text += "/" + rest.join("/");
    }
  }

  const matcher = new minimatch.Minimatch((negated ? "!" : "") + text);
  if (!matcher.makeRe()) {
    throw makeErrorWithProperties("Invalid glob pattern", { pattern });
  }

  return { matcher, dirOnly, base };
}

export type GlobOptions = {
  dir?: string | Path;
  followSymlinks?: boolean;
  logging?: {
    trace?: (...args: Array<any>) => void;
    info?: (...args: Array<any>) => void;
  };
};

const HAS_GLOB_METACHARS_RE = /[*?{}\[\]]|[+@!?]\(|^!/;

export function glob(
  patterns: string | Array<string>,
  options: GlobOptions = {},
): Array<Path> {
  assert.type(
    patterns,
    types.or(types.string, types.arrayOf(types.string)),
    "'patterns' argument must be either a string or an Array of strings",
  );

  assert.type(
    options,
    types.or(types.undefined, types.anyObject),
    "when present, 'options' argument must be an object",
  );

  assert.type(
    options.dir,
    types.or(types.string, types.Path, types.undefined),
    "when present, 'dir' option must be a string or Path",
  );

  assert.type(
    options.logging,
    types.or(types.undefined, types.object),
    "when present, 'logging' option must be an object",
  );

  let dir = options.dir ?? null;
  const trace = options.logging?.trace ?? logger.trace;
  const info = options.logging?.info ?? logger.info;

  assert.type(
    trace,
    types.or(types.undefined, types.anyFunction),
    "when present, 'logging.trace' option must be a function",
  );
  assert.type(
    info,
    types.or(types.undefined, types.anyFunction),
    "when present, 'logging.info' option must be a function",
  );

  const patternsArray = Array.isArray(patterns) ? patterns : [patterns];
  info(`glob: expanding ${JSON.stringify(patternsArray)}`);

  // Patterns are ANDed together, and every() is vacuously true for an empty
  // list, which would otherwise match the entire tree.
  if (patternsArray.length === 0) {
    return [];
  }

  if (is(dir, types.Path)) {
    dir = dir.toString();
  }

  const absolutePatterns = patternsArray.filter((pattern) =>
    Path.isAbsolute(pattern),
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

      const result = Path.fromRaw(
        leadingParts,
        Path.detectSeparator(absolutePattern, "/"),
      ).normalize();

      trace(
        `using absolute pattern to infer starting dir: ${JSON.stringify(
          absolutePattern,
        )} -> ${JSON.stringify(result.toString())}`,
      );

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
        "No initial dir for the glob search was specified, and one or more patterns specify an absolute path, but the specified absolute paths have no common parent path. Not sure where to start the glob search. Please specify a starting path with option 'dir'.",
      );
    } else {
      dir = Path.fromRaw(commonParentDirParts).normalize();

      // The literal part of a pattern can name a file rather than a directory,
      // eg. an absolute path with no wildcards in it at all.
      if (exists(dir) && !isDir(dir)) {
        dir = dir.dirname();
      }

      trace(
        `inferred starting dir from absolute pattern(s): ${dir.toString()}`,
      );

      if (dir.segments.length === 1) {
        trace("--- WARNING: inferred starting dir to root dir! ---");
      }
    }
  }

  if (dir == null) {
    dir = pwd();
  }

  if (!exists(dir)) {
    throw new Error(`No such directory: ${dir} (from ${pwd()})`);
  }

  const normDir = Path.normalize(dir);
  if (!normDir.isAbsolute()) {
    throw new Error(
      `'dir' option must be an absolute path, but received: ${quote(dir)}`,
    );
  }

  const startingDir = normDir.toString();
  const allPatterns = patternsArray.map((pattern) => {
    return {
      negated: isNegated(pattern),
      pattern,
      ...compile(pattern, startingDir),
    };
  });

  // A pattern that climbs out of the starting dir with ".." has to be searched
  // from wherever it lands, not from the starting dir.
  let traversalRoot = new Path(startingDir);
  for (const { base } of allPatterns) {
    const basePath = new Path(base);
    if (traversalRoot.startsWith(basePath)) {
      traversalRoot = basePath;
    }
  }

  const negatedPatterns = allPatterns.filter(({ negated }) => negated);
  const nonNegatedPatterns = allPatterns.filter(({ negated }) => !negated);

  const matches: Array<string> = [];
  // Following symlinks can lead back into a directory already being walked,
  // so each one is only descended into once.
  const visitedDirs = new Set<string>();

  function find(searchDir: string) {
    trace(`reading children of ${searchDir}`);

    searchDir = appendSlashIfWindowsDriveLetter(searchDir);

    const children = os.readdir(searchDir);

    trace(`found ${children.length} children of ${searchDir}`);

    for (const child of children) {
      if (child === ".") continue;
      if (child === "..") continue;

      const fullName = searchDir + "/" + child;

      trace(`checking ${fullName}`);

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
          allPatterns.every(({ pattern, negated, matcher, dirOnly }) => {
            let didMatch = matcher.match(fullName);
            if (didMatch && dirOnly && !(os.S_IFDIR & stat.mode)) {
              didMatch = false;
            }

            trace(
              "match info:",
              JSON.stringify({
                didMatch,
                pattern,
                negated,
                fullName,
              }),
            );

            return didMatch;
          })
        ) {
          matches.push(fullName);
        }

        if (os.S_IFDIR & stat.mode) {
          // Only traverse deeper dirs if this one doesn't match a negated
          // pattern.
          let shouldGoDeeper = true;
          for (const { matcher, pattern } of negatedPatterns) {
            const matchesNegated = !matcher.match(fullName);
            if (matchesNegated) {
              trace(
                `not traversing deeper into dir as it matches a negated pattern: ${JSON.stringify(
                  { dir: fullName, pattern },
                )}`,
              );

              shouldGoDeeper = false;
              break;
            }
          }

          if (shouldGoDeeper) {
            for (const { matcher, pattern } of nonNegatedPatterns) {
              // A partial match means some path at or below this dir could
              // still match; if there's none, nothing below here ever can.
              if (!matcher.match(fullName, true)) {
                trace(
                  `not traversing deeper into dir as nothing within it could match a pattern: ${JSON.stringify(
                    { dir: fullName, pattern },
                  )}`,
                );

                shouldGoDeeper = false;
                break;
              }
            }
          }

          if (shouldGoDeeper && options.followSymlinks) {
            const realDir = os.realpath(fullName);
            if (visitedDirs.has(realDir)) {
              trace(`not traversing deeper into an already-visited dir: ${realDir}`);
              shouldGoDeeper = false;
            } else {
              visitedDirs.add(realDir);
            }
          }

          if (shouldGoDeeper) {
            find(fullName);
          }
        }
      } catch (err: any) {
        try {
          const message = `glob encountered error: ${err.message}`;
          trace(message);
          console.warn(message);
        } catch (err2) {
          // ignore
        }
      }
    }
  }

  if (options.followSymlinks) {
    visitedDirs.add(os.realpath(traversalRoot.toString()));
  }
  find(traversalRoot.toString());

  return matches.map((str) => new Path(str));
}
