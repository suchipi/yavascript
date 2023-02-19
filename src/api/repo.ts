import { exec } from "./exec";
import { pwd } from "./commands/pwd";
import { dirname } from "./commands/dirname";
import { exists, isDir } from "./filesystem";
import { is } from "./is";
import { types } from "./types";
import type { Path } from "./path";
import { assert } from "./assert";

export function repoRoot(relativeTo: string | Path = pwd()): string {
  if (is(relativeTo, types.Path)) {
    relativeTo = relativeTo.toString();
  }

  assert.type(
    relativeTo,
    types.string,
    "when present, 'relativeTo' argument must be either a string or a Path object"
  );

  if (exists(relativeTo) && !isDir(relativeTo)) {
    relativeTo = dirname(relativeTo);
  }

  try {
    const gitRootRun = exec(["git", "rev-parse", "--show-toplevel"], {
      captureOutput: true,
      failOnNonZeroStatus: false,
      cwd: relativeTo,
    });
    if (gitRootRun.status === 0) {
      return gitRootRun.stdout.trim();
    }
  } catch (err) {}

  try {
    const hgRootRun = exec(["hg", "root"], {
      captureOutput: true,
      failOnNonZeroStatus: false,
      cwd: relativeTo,
    });
    if (hgRootRun.status === 0) {
      return hgRootRun.stdout.trim();
    }
  } catch (err) {}

  throw new Error(
    `Fatal: ${relativeTo} is not within a git or hg repo, or git/hg were not found in PATH`
  );
}

export function isGitignored(path: string | Path): boolean {
  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    types.string,
    "'path' argument must be either a string or a Path object"
  );

  const result = exec(["git", "check-ignore", path], {
    failOnNonZeroStatus: false,
    captureOutput: true,
  });
  if (result.status !== 0 && result.status !== 1) {
    throw new Error("git check-ignore failed: " + result.stderr.trim());
  }
  return result.status === 0;
}
