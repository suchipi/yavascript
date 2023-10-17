# `GitRepo.prototype.commitSHA` - Get the commit SHA the git repo is currently pointed at

The `commitSHA` method returns a string containing the full SHA-1 hash associated with the current commit the repository is pointed towards. For example:

```ts
const repo = new GitRepo(".");
const sha = repo.commitSHA();
console.log(sha);
// "2a0a15f9872406faebcac694562efeae3447a4ba"
```

To obtain this information, the command `git rev-parse HEAD` gets run within the repo's directory.

> If the repo has unstaged or uncommitted changes, that state will NOT be reflected in the SHA-1 hash. As such, it may be desirable to use this method in conjunction with `GitRepo.prototype.isWorkingTreeDirty`.

```ts
// Defined in yavascript/src/api/git-repo
declare class GitRepo {
  commitSHA(): string;

  // ... other methods/properties omitted. see help(GitRepo) for more info. ...
}
```
