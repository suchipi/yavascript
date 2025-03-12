# `GitRepo.findRoot` - Locate the root of a repo from a path within the repo.

Given a path to a file or folder on disk, the `GitRepo.findRoot` function searches upwards through the directory ancestry to find a `.git` folder, then returns the `Path` that contains that `.git` folder. If no `.git` folder is found, an error will be thrown.

For example, if you have a git repo at `/home/suchipi/Code/my-project`, such that `/home/suchipi/Code/my-project/.git` exists, calling `GitRepo.findRoot("/home/suchipi/Code/my-project/src/index.js")` will return a `Path` object pointing to `/home/suchipi/Code/my-project`.

This function can be useful in order to set the current working directory of a script relative to the root of the git repo the script appears in. By doing so, the script can be invoked from any directory.

For instance, consider this theoretical filesystem layout:

```
my-project
- src
  - my-script.js
- README.md
```

If `my-script.js` contained the following content:

```ts
#!/usr/bin/env yavascript

cat("README.md");
```

Then running `src/my-script.js` would print the contents of the README as expected.

However, suppose someone ran the script from a different folder:

```sh
$ cd src
$ ./my-script.js
```

Now an error occurs!

To make the script resilient against this, you can use `cd` at the top of the script:

```ts
#!/usr/bin/env yavascript

// __dirname is a special variable that refers to the folder the current script is in.
cd(__dirname);
cd("..");

cat("README.md");
```

However, if the location of `my-script.js` later changes, you will have to remember to update the script. For instance, if `src/my-script.js` got moved to `src/tools/my-script.js`, you would need to update the script like so:

```ts
#!/usr/bin/env yavascript

cd(__dirname);
cd("../.."); // Changed this line

cat("README.md");
```

Since `README.md` will always be in the repository root, using `GitRepo.findRoot` would make the `cd` resilient against file moves:

```ts
#!/usr/bin/env yavascript

cd(GitRepo.findRoot(__dirname));

cat("README.md");
```

Depending on how you anticipate your codebase changing over time, and how you expect others to use your scripts, it might make sense to use `cd(__dirname)`, `cd(GitRepo.findRoot(__dirname))`, or no `cd` at all. Pick what makes the most sense for your situation.

---

```ts
// Defined in yavascript/src/api/git-repo
declare class GitRepo {
  static findRoot(fromPath: string | Path): Path;

  // ... other methods/properties omitted. see help(GitRepo) for more info. ...
}
```
