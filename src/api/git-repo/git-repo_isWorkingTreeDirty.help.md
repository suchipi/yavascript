# `GitRepo.prototype.isWorkingTreeDirty` - Check for uncommitted changes

Returns a boolean indicating whether there are uncommited changes in the git repo. `true` means there are changes, `false` means there are no changes (ie. the repo is clean).

To obtain this information, the command `git status --quiet` gets run within the repo's directory.

```ts
// Defined in yavascript/src/api/git-repo
declare class GitRepo {
  isWorkingTreeDirty(): boolean;

  // ... other methods/properties omitted. see help(GitRepo) for more info. ...
}
```
