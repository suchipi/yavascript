import { exec } from "./exec";
import { pwd } from "./commands/pwd";
import { dirname } from "./commands/dirname";
import { exists, isDir } from "./filesystem";
import { is } from "./is";
import { types } from "./types";
import type { Path } from "./path";
import { assert } from "./assert";
import { makeErrorWithProperties } from "../error-with-properties";

export const Git = {
  repoRoot,
  isIgnored,
};

function repoRoot(relativeTo: string | Path = pwd()): string {
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

  const result = exec(["git", "rev-parse", "--show-toplevel"], {
    failOnNonZeroStatus: false,
    captureOutput: true,
    cwd: relativeTo,
  });
  if (result.status !== 0) {
    throw makeErrorWithProperties("'git rev-parse --show-toplevel' failed", {
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
      cwd: relativeTo,
      signal: result.signal,
    });
  }

  return result.stdout.trim();
}

function isIgnored(path: string | Path): boolean {
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
    throw makeErrorWithProperties(`'git check-ignore ${path}' failed`, {
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
      path,
      signal: result.signal,
    });
  }
  return result.status === 0;
}
