import { exec } from "./exec";
import { pwd } from "./commands/pwd";
import { dirname } from "./commands/dirname";
import { exists, isDir } from "./filesystem";
import { is } from "./is";
import { types } from "./types";
import { Path } from "./path";
import { assert } from "./assert";
import { makeErrorWithProperties } from "../error-with-properties";

export class GitRepo {
  repoDir: Path;

  static findRoot(fromPath: string | Path): Path {
    if (is(fromPath, types.Path)) {
      fromPath = fromPath.toString();
    }

    assert.type(
      fromPath,
      types.string,
      "when present, 'fromPath' argument must be either a string or a Path object"
    );

    if (exists(fromPath) && !isDir(fromPath)) {
      fromPath = dirname(fromPath);
    }

    const result = exec(["git", "rev-parse", "--show-toplevel"], {
      failOnNonZeroStatus: false,
      captureOutput: true,
      cwd: fromPath,
    });
    if (result.status !== 0) {
      throw makeErrorWithProperties("'git rev-parse --show-toplevel' failed", {
        status: result.status,
        stderr: result.stderr,
        stdout: result.stdout,
        cwd: fromPath,
        signal: result.signal,
      });
    }

    return new Path(result.stdout.trim());
  }

  constructor(repoDir: string | Path) {
    assert.type(
      repoDir,
      types.or(types.Path, types.string),
      "'repoDir' argument must be either a string or a Path object"
    );

    if (typeof repoDir === "string") {
      this.repoDir = new Path(repoDir);
    } else {
      this.repoDir = repoDir.clone();
    }

    const dotGitDir = Path.join(this.repoDir, ".git");
    if (!exists(dotGitDir)) {
      throw makeErrorWithProperties(
        `The 'repoPath' provided to the Git constructor doesn't appear to refer to a git repository; namely, ${JSON.stringify(
          dotGitDir
        )} doesn't exist.`,
        {
          repoDir: this.repoDir.toString(),
          dotGitDir,
        }
      );
    }
  }

  commitSHA(): string {
    const repoDir = this.repoDir.toString();

    const result = exec(["git", "rev-parse", "HEAD"], {
      failOnNonZeroStatus: false,
      captureOutput: true,
      cwd: repoDir,
    });
    if (result.status !== 0) {
      throw makeErrorWithProperties("'git rev-parse HEAD' failed", {
        status: result.status,
        stderr: result.stderr,
        stdout: result.stdout,
        cwd: repoDir,
        signal: result.signal,
      });
    }

    return result.stdout.trim();
  }

  branchName(): string | null {
    const repoDir = this.repoDir.toString();

    const result = exec(["git", "rev-parse", "--abbrev-ref", "HEAD"], {
      failOnNonZeroStatus: false,
      captureOutput: true,
      cwd: repoDir,
    });
    if (result.status !== 0) {
      throw makeErrorWithProperties(
        "'git rev-parse --abbrev-ref HEAD' failed",
        {
          status: result.status,
          stderr: result.stderr,
          stdout: result.stdout,
          cwd: repoDir,
          signal: result.signal,
        }
      );
    }

    const name = result.stdout.trim();
    if (name === "HEAD") {
      return null;
    } else {
      return name;
    }
  }

  isWorkingTreeDirty(): boolean {
    const repoDir = this.repoDir.toString();

    const result = exec(["git", "diff", "--quiet"], {
      failOnNonZeroStatus: false,
      captureOutput: true,
      cwd: repoDir,
    });
    if (result.status !== 0 && result.status !== 1) {
      throw makeErrorWithProperties("'git diff --quiet' failed", {
        status: result.status,
        stderr: result.stderr,
        stdout: result.stdout,
        cwd: repoDir,
        signal: result.signal,
      });
    }

    return result.status === 1;
  }

  isIgnored(path: string | Path): boolean {
    assert.type(
      path,
      types.or(types.string, types.Path),
      "'path' argument must be either a string or a Path object"
    );

    const resolvedPath = Path.resolve(pwd(), path);
    const repoDir = this.repoDir.toString();

    if (!resolvedPath.startsWith(repoDir)) {
      throw makeErrorWithProperties(
        "Path passed to GitRepo.isIgnored is outside of the Git object's repoDir. When passing a relative path, it will be resolved relative to the current `pwd()`.",
        {
          path: path.toString(),
          resolvedPath,
          pwd: pwd(),
          repoDir,
        }
      );
    }

    const result = exec(["git", "check-ignore", resolvedPath], {
      failOnNonZeroStatus: false,
      captureOutput: true,
    });
    if (result.status !== 0 && result.status !== 1) {
      throw makeErrorWithProperties(
        `'git check-ignore '${resolvedPath}' failed`,
        {
          status: result.status,
          stderr: result.stderr,
          stdout: result.stdout,
          path: resolvedPath,
          signal: result.signal,
        }
      );
    }
    return result.status === 0;
  }
}
