/**
 * An object that points to a git repository on disk and provides utility
 * methods for getting information from that repo.
 *
 * To use it, construct a GitRepo object, passing in the path to the repo:
 *
 * ```ts
 * // The path here is just an example
 * const repo = new GitRepo("/home/suchipi/Code/yavascript");
 * ```
 *
 * Then, you can use methods/properties on the `repo` object:
 *
 * ```ts
 * console.log(repo.branchName() || repo.commitSHA());
 * ```
 */
declare class GitRepo {
  /**
   * Given a path to a file or folder on disk, searches upwards through the
   * directory ancestry to find a `.git` folder, then returns the Path that
   * contains that `.git` folder. If no `.git` folder is found, an error will be
   * thrown.
   *
   * For example, if you have a git repo at `/home/suchipi/Code/my-project`,
   * such that `/home/suchipi/Code/my-project/.git` exists, calling
   * `GitRepo.findRoot("/home/suchipi/Code/my-project/src/index.js")` will
   * return a `Path` object pointing to `/home/suchipi/Code/my-project`.
   *
   * This function can be useful in order to set the current working directory
   * of a script relative to the root of the git repo the script appears in. By
   * doing so, the script can be invoked from any directory.
   *
   * For instance, consider this theoretical filesystem layout:
   *
   * ```
   * my-project
   * - src
   *   - my-script.js
   * - README.md
   * ```
   *
   * If `my-script.js` contained the following content:
   *
   * ```ts
   * #!/usr/bin/env yavascript
   *
   * cat("README.md");
   * ```
   *
   * Then running `src/my-script.js` would print the contents of the README as
   * expected.
   *
   * However, suppose someone ran the script from a different folder:
   *
   * ```sh
   * $ cd src
   * $ ./my-script.js
   * ```
   *
   * Now an error occurs!
   *
   * To make the script resilient against this, you can use `cd` at the top of
   * the script:
   *
   * ```ts
   * #!/usr/bin/env yavascript
   *
   * // __dirname is a special variable that refers to the folder the current script is in.
   * cd(__dirname);
   * cd("..");
   *
   * cat("README.md");
   * ```
   *
   * However, if the location of `my-script.js` later changes, you will have to
   * remember to update the script. For instance, if `src/my-script.js` got
   * moved to `src/tools/my-script.js`, you would need to update the script like
   * so:
   *
   * ```ts
   * #!/usr/bin/env yavascript
   *
   * cd(__dirname);
   * cd("../.."); // Changed this line
   *
   * cat("README.md");
   * ```
   *
   * Since `README.md` will always be in the repository root, using
   * `GitRepo.findRoot` would make the `cd` resilient against file moves:
   *
   * ```ts
   * #!/usr/bin/env yavascript
   *
   * cd(GitRepo.findRoot(__dirname));
   *
   * cat("README.md");
   * ```
   *
   * Depending on how you anticipate your codebase changing over time, and how
   * you expect others to use your scripts, it might make sense to use
   * `cd(__dirname)`, `cd(GitRepo.findRoot())`, or no `cd` at all. Pick what
   * makes the most sense for your situation.
   *
   */
  static findRoot(fromPath: string | Path): Path;

  /**
   * Creates a new `GitRepo` object for the given repo on disk.
   */
  constructor(repoDir: string | Path);

  /**
   * The root folder of the git repo that this `GitRepo` object represents (the
   * folder that contains the '.git' folder).
   */
  repoDir: Path;

  /**
   * Returns the full SHA-1 hash string associated with the repo's current
   * commit.
   *
   * For example:
   *
   * ```ts
   * const repo = new GitRepo(".");
   * const sha = repo.commitSHA();
   * console.log(sha);
   * // "2a0a15f9872406faebcac694562efeae3447a4ba"
   * ```
   *
   * To obtain this information, the command `git rev-parse HEAD` gets run
   * within the repo's directory.
   *
   * > If the repo has unstaged or uncommitted changes, that state will NOT be
   * > reflected in the SHA-1 hash. As such, it may be desirable to use this
   * > method in conjunction with `GitRepo.prototype.isWorkingTreeDirty`.
   */
  commitSHA(): string;

  /**
   * If the commit SHA the git repo is currently pointed at is the tip of a
   * named branch, returns the branch name. Otherwise, returns `null`.
   *
   * This is done by running `git rev-parse --abbrev-ref HEAD` within the repo
   * directory.
   *
   * Example:
   *
   * ```ts
   * const repo = new GitRepo(".");
   * const branch = repo.branchName();
   * console.log(branch);
   * // "main"
   * ```
   *
   * > The most common situation where there is no current branch is when the
   * > repository is in "detached HEAD" state.
   */
  branchName(): string | null;

  /**
   * Returns a boolean indicating whether there are uncommited changes in the
   * git repo. `true` means there are changes, `false` means there are no
   * changes (ie. the repo is clean).
   *
   * This is done by running `git status --quiet` within the repo directory.
   */
  isWorkingTreeDirty(): boolean;

  /**
   * Returns a boolean indicating whether the provided path is ignored by one or
   * more `.gitignore` files in the repository.
   *
   * Example:
   *
   * ```ts
   * const repo = new GitRepo(".");
   * const ignoreStatus = repo.isIgnored("README.md");
   * console.log(ignoreStatus);
   * // false
   * ```
   *
   * To obtain this information, the command `git check-ignore <the-path>` gets
   * run within the repo's directory.
   *
   * An error will be thrown if the provided path is not within the repository's
   * directory tree. For instance, calling `gitRepo.isIgnored("/tmp")` on a
   * `gitRepo` pointed at `/home/suchipi/my-project` would throw an error,
   * because `/tmp` is not a child of `/home/suchipi/my-project`.
   *
   * > NOTE: When passing relative paths to `isIgnored`, they will be resolved
   * > relative to the repo root, NOT relative to `pwd()`. It's best practice to
   * > always pass around absolute paths in your program instead of relative
   * > ones so that this type of ambiguity is avoided.
   */
  isIgnored(path: string | Path): boolean;
}
