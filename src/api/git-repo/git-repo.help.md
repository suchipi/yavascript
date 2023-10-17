# `GitRepo` - Utility for working with git repositories

The `GitRepo` class can be used to get information about a git repository on disk.

To use it, construct a GitRepo object, passing in the path to the repo:

```ts
// The path here is just an example
const repo = new GitRepo("/home/suchipi/Code/yavascript");
```

Then, you can use methods/properties on the `repo` object:

```ts
console.log(repo.branchName() || repo.commitSHA());
```

The `GitRepo` class has the following methods. Pass any of these values to the `help` function for more info.

- `GitRepo.findRoot`: Locate the root of a repo from a path within the repo.
- `GitRepo.prototype.commitSHA`: Get the commit SHA the git repo is currently pointed at.
- `GitRepo.prototype.branchName`: Get the current branch name, if present.
- `GitRepo.prototype.isWorkingTreeDirty`: Get whether there are uncommitted changes
- `GitRepo.isIgnored`: Check if a file is gitignored

```ts
// Defined in yavascript/src/api/git-repo
declare class GitRepo {
  static findRoot(fromPath: string | Path): Path;

  constructor(repoDir: string | Path);

  repoDir: Path;
  commitSHA(): string;
  branchName(): string | null;
  isWorkingTreeDirty(): boolean;
  isIgnored(path: string | Path): boolean;
}
```
