# `GitRepo.prototype.isIgnored` - Check whether a file is gitignored

The `isIgnored` method returns a boolean indicating whether the provided path is ignored by one or more `.gitignore` files in the repository.

```ts
const repo = new GitRepo(".");
const ignoreStatus = repo.isIgnored("README.md");
console.log(ignoreStatus);
// false
```

To obtain this information, the command `git check-ignore <the-path>` gets run within the repo's directory.

An error will be thrown if the provided path is not within the repository's directory tree. For instance, calling `gitRepo.isIgnored("/tmp")` on a `gitRepo` pointed at `/home/suchipi/my-project` would throw an error, because `/tmp` is not a child of `/home/suchipi/my-project`.

> NOTE: When passing relative paths to `isIgnored`, they will be resolved relative to the repo root, NOT relative to `pwd()`. It's best practice to always pass around absolute paths in your program instead of relative ones so that this type of ambiguity is avoided.

```ts
// Defined in yavascript/src/api/git-repo
declare class GitRepo {
  isIgnored(path: string | Path): boolean;

  // ... other methods/properties omitted. see help(GitRepo) for more info. ...
}
```
