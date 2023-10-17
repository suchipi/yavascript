# `GitRepo.prototype.branchName` - Get the current branch name, if present

The `branchName` method returns the name of the current git branch as a string, or null if there is no branch associated with the current HEAD of the repo.

```ts
const repo = new GitRepo(".");
const branch = repo.branchName();
console.log(branch);
// "main"
```

To obtain this information, the command `git rev-parse --abbrev-ref HEAD` gets run within the repo's directory.

> The most common situation where there is no current branch is when the repository is in "detached HEAD" state.

```ts
// Defined in yavascript/src/api/git-repo
declare class GitRepo {
  branchName(): string | null;

  // ... other methods/properties omitted. see help(GitRepo) for more info. ...
}
```
