/**
 * Returns the absolute path to the root folder of the git/hg repo.
 *
 * This is done by running `git rev-parse --show-toplevel` and `hg root`.
 *
 * If `relativeTo` is provided, the git and hg commands will be executed in
 * that folder instead of in `pwd()`.
 */
declare function repoRoot(relativeTo?: string): string;

/**
 * Returns whether the provided path is ignored by git.
 */
declare function isGitignored(path: string): boolean;
