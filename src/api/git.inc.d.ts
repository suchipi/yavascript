/**
 * Utility functions for working with git repositories.
 */
declare var Git: {
  /**
   * Returns the commit SHA the git repo is currently pointed at.
   *
   * This is done by running `git rev-parse HEAD`.
   *
   * If `relativeTo` is provided, the git command will be executed in that
   * folder instead of in `pwd()`.
   */
  commitSHA(relativeTo?: string | Path): string;

  /**
   * If the commit SHA the git repo is currently pointed at is the tip of a
   * named branch, returns the branch name. Otherwise, returns `null`.
   *
   * This is done by running `git rev-parse --abbrev-ref HEAD`.
   *
   * If `relativeTo` is provided, the git command will be executed in that
   * folder instead of in `pwd()`.
   */
  branchName(relativeTo?: string | Path): string | null;

  /**
   * Returns a boolean indicating whether there are uncommited changes in the
   * git repo. `true` means there are changes, `false` means there are no
   * changes (ie. the repo is clean).
   *
   * This is done by running `git status --quiet`.
   *
   * If `relativeTo` is provided, the git command will be executed in that
   * folder instead of in `pwd()`.
   */
  isWorkingTreeDirty(relativeTo?: string | Path): boolean;

  /**
   * Returns the absolute path to the root folder of the git repo.
   *
   * This is done by running `git rev-parse --show-toplevel`.
   *
   * If `relativeTo` is provided, the git command will be executed in that
   * folder instead of in `pwd()`.
   */
  repoRoot(relativeTo?: string | Path): string;

  /**
   * Returns whether the provided path is ignored by git.
   */
  isIgnored(path: string | Path): boolean;
};
