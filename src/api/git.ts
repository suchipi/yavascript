import { exec } from "./exec";
import { pwd } from "./commands/pwd";
import { dirname } from "./commands/dirname";
import { exists, isDir } from "./filesystem";
import { is } from "./is";
import { types } from "./types";
import type { Path } from "./path";
import { assert } from "./assert";
import { makeErrorWithProperties } from "../error-with-properties";

export const Git = Object.assign(Object.create(null), {
  commitSHA,
  branchName,
  isWorkingTreeDirty,
  repoRoot,
  isIgnored,
});

function _resolveRelativeTo(input: string | Path): string {
  if (is(input, types.Path)) {
    input = input.toString();
  }

  assert.type(
    input,
    types.string,
    "when present, 'input' argument must be either a string or a Path object"
  );

  if (exists(input) && !isDir(input)) {
    input = dirname(input);
  }

  return input;
}

function commitSHA(relativeTo: string | Path = pwd()): string {
  relativeTo = _resolveRelativeTo(relativeTo);

  const result = exec(["git", "rev-parse", "HEAD"], {
    failOnNonZeroStatus: false,
    captureOutput: true,
    cwd: relativeTo,
  });
  if (result.status !== 0) {
    throw makeErrorWithProperties("'git rev-parse HEAD' failed", {
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
      cwd: relativeTo,
      signal: result.signal,
    });
  }

  return result.stdout.trim();
}

function branchName(relativeTo: string | Path = pwd()): string | null {
  relativeTo = _resolveRelativeTo(relativeTo);

  const result = exec(["git", "rev-parse", "--abbrev-ref", "HEAD"], {
    failOnNonZeroStatus: false,
    captureOutput: true,
    cwd: relativeTo,
  });
  if (result.status !== 0) {
    throw makeErrorWithProperties("'git rev-parse --abbrev-ref HEAD' failed", {
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
      cwd: relativeTo,
      signal: result.signal,
    });
  }

  const name = result.stdout.trim();
  if (name === "HEAD") {
    return null;
  } else {
    return name;
  }
}

function isWorkingTreeDirty(relativeTo: string | Path = pwd()): boolean {
  relativeTo = _resolveRelativeTo(relativeTo);

  const result = exec(["git", "diff", "--quiet"], {
    failOnNonZeroStatus: false,
    captureOutput: true,
    cwd: relativeTo,
  });
  if (result.status !== 0 && result.status !== 1) {
    throw makeErrorWithProperties("'git diff --quiet' failed", {
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
      cwd: relativeTo,
      signal: result.signal,
    });
  }

  return result.status === 1;
}

function repoRoot(relativeTo: string | Path = pwd()): string {
  relativeTo = _resolveRelativeTo(relativeTo);

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
