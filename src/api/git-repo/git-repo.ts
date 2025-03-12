import { exec } from "../exec";
import { pwd } from "../commands/pwd";
import { exists, isDir } from "../filesystem";
import { types } from "../types";
import { Path } from "../path";
import { assert } from "../assert";
import { makeErrorWithProperties } from "../../error-with-properties";
import { setHelpText } from "../help";
import gitRepoHelpText from "./git-repo.help.md";
import findRootHelpText from "./git-repo_findRoot.help.md";
import commitSHAHelpText from "./git-repo_commitSHA.help.md";
import branchNameHelpText from "./git-repo_branchName.help.md";
import isIgnoredHelpText from "./git-repo_isIgnored.help.md";
import isWorkingTreeDirtyHelpText from "./git-repo_isWorkingTreeDirty.help.md";
import { quote } from "../strings";

export class GitRepo {
  repoDir: Path;

  static findRoot(fromPath: string | Path): Path {
    assert.type(
      fromPath,
      types.or(types.Path, types.string),
      "'fromPath' argument must be either a string or a Path object"
    );

    const absFromPath = Path.normalize(fromPath);
    if (!absFromPath.isAbsolute()) {
      throw new Error(
        `Could not resolve ${quote(fromPath)} into an absolute path`
      );
    }
    const currentPath = absFromPath.clone();

    if (exists(currentPath) && !isDir(currentPath)) {
      currentPath.segments.pop();
    }

    while (currentPath.segments.length > 0) {
      const potentialPath = currentPath.concat(".git");
      if (exists(potentialPath) && isDir(potentialPath)) {
        return currentPath;
      }

      currentPath.segments.pop();
    }

    throw makeErrorWithProperties(
      `Could not find git repo root (inputPath = ${fromPath}, resolvedPath = ${absFromPath})`,
      { inputPath: fromPath, resolvedPath: absFromPath }
    );
  }

  constructor(repoDir: string | Path) {
    assert.type(
      repoDir,
      types.or(types.Path, types.string),
      "'repoDir' argument must be either a string or a Path object"
    );

    if (typeof repoDir === "string") {
      this.repoDir = new Path(repoDir).normalize();
    } else {
      this.repoDir = repoDir.normalize();
    }

    if (!this.repoDir.isAbsolute()) {
      throw makeErrorWithProperties(
        "Couldn't resolve absolute path to repo dir.",
        { repoDir, cwd: pwd() }
      );
    }

    const dotGitDir = new Path(this.repoDir, ".git");
    if (!exists(dotGitDir)) {
      throw makeErrorWithProperties(
        `The 'repoPath' provided to the GitRepo constructor doesn't appear to refer to a git repository; namely, ${JSON.stringify(
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

    let pathObj = new Path(path);
    if (!pathObj.isAbsolute()) {
      pathObj = this.repoDir.concat(pathObj);
    }

    const resolvedPath = pathObj.toString();
    const repoDir = this.repoDir.toString();

    if (!resolvedPath.startsWith(repoDir)) {
      throw makeErrorWithProperties(
        "Path passed to GitRepo.isIgnored is outside of the GitRepo object's repoDir.",
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
      cwd: this.repoDir.toString(),
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

setHelpText(GitRepo, gitRepoHelpText);
setHelpText(GitRepo.findRoot, findRootHelpText);
setHelpText(GitRepo.prototype.commitSHA, commitSHAHelpText);
setHelpText(GitRepo.prototype.branchName, branchNameHelpText);
setHelpText(GitRepo.prototype.isIgnored, isIgnoredHelpText);
setHelpText(GitRepo.prototype.isWorkingTreeDirty, isWorkingTreeDirtyHelpText);
