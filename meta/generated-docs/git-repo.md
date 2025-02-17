# GitRepo (class)

An object that points to a git repository on disk and provides utility
methods for getting information from that repo.

```ts
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

## GitRepo.findRoot (static method)

Given a path to a file or folder on disk, searches upwards through the
directory ancestry to find a `.git` folder, then returns the Path that
contains that `.git` folder. If no `.git` folder is found, an error will be
thrown.

```ts
static findRoot(fromPath: string | Path): Path;
```

## GitRepo (constructor)

Creates a new `GitRepo` object for the given repo on disk.

```ts
constructor(repoDir: string | Path);
```

## GitRepo.prototype.repoDir (Path property)

The root folder of the git repo that this `GitRepo` object represents (the
folder that contains the '.git' folder).

```ts
repoDir: Path;
```

## GitRepo.prototype.commitSHA (method)

Returns the commit SHA the git repo is currently pointed at.

This is done by running `git rev-parse HEAD`.

```ts
commitSHA(): string;
```

## GitRepo.prototype.branchName (method)

If the commit SHA the git repo is currently pointed at is the tip of a
named branch, returns the branch name. Otherwise, returns `null`.

This is done by running `git rev-parse --abbrev-ref HEAD`.

```ts
branchName(): string | null;
```

## GitRepo.prototype.isWorkingTreeDirty (method)

Returns a boolean indicating whether there are uncommited changes in the
git repo. `true` means there are changes, `false` means there are no
changes (ie. the repo is clean).

This is done by running `git status --quiet`.

```ts
isWorkingTreeDirty(): boolean;
```

## GitRepo.prototype.isIgnored (method)

Returns whether the provided path is ignored by git.

If `path` is an absolute path, it must be a child directory of this GitRepo
object's `repoDir`, or else an error will be thrown.

```ts
isIgnored(path: string | Path): boolean;
```
