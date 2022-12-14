import { exec } from "./exec";
import { pwd } from "./commands/pwd";
import { dirname } from "./commands/dirname";
import { exists, isDir } from "./filesystem";

export function repoRoot(relativeTo: string = pwd()): string {
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

export function isGitignored(path: string): boolean {
  const result = exec(["git", "check-ignore", path], {
    failOnNonZeroStatus: false,
    captureOutput: true,
  });
  if (result.status !== 0 && result.status !== 1) {
    throw new Error("git check-ignore failed: " + result.stderr.trim());
  }
  return result.status === 0;
}
