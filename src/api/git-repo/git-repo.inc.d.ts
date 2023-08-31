/**
 * An object that points to a git repository on disk and provides utility
 * methods for getting information from that repo.
 */
declare class GitRepo {
  /**
   * Given a path to a file or folder on disk, searches upwards through the
   * directory ancestry to find a `.git` folder, then returns the Path that
   * contains that `.git` folder. If no `.git` folder is found, an error will be
   * thrown.
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
   * Returns the commit SHA the git repo is currently pointed at.
   *
   * This is done by running `git rev-parse HEAD`.
   */
  commitSHA(): string;

  /**
   * If the commit SHA the git repo is currently pointed at is the tip of a
   * named branch, returns the branch name. Otherwise, returns `null`.
   *
   * This is done by running `git rev-parse --abbrev-ref HEAD`.
   */
  branchName(): string | null;

  /**
   * Returns a boolean indicating whether there are uncommited changes in the
   * git repo. `true` means there are changes, `false` means there are no
   * changes (ie. the repo is clean).
   *
   * This is done by running `git status --quiet`.
   */
  isWorkingTreeDirty(): boolean;

  /**
   * Returns whether the provided path is ignored by git.
   *
   * If `path` is an absolute path, it must be a child directory of this GitRepo
   * object's `repoDir`, or else an error will be thrown.
   */
  isIgnored(path: string | Path): boolean;
}
