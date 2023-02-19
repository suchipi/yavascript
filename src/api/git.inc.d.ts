/**
 * Utility functions for working with git repositories.
 */
declare var Git: {
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
