import { evaluate, cleanResult, rootDir } from "./test-helpers";

test("very basic usage", async () => {
  const result = await evaluate(
    `
      console.log("__dirname", __dirname);
      console.log("GitRepo.findRoot(__dirname)", GitRepo.findRoot(__dirname));
      const repo = new GitRepo(GitRepo.findRoot(__dirname));
      console.log("repo.repoDir", repo.repoDir);
      console.log('repo.isIgnored("README.md")', repo.isIgnored("README.md"));
      console.log('repo.isIgnored(repo.repoDir.concat("node_modules"))', repo.isIgnored(repo.repoDir.concat("node_modules")));

      // We use typeof for these cause I don't want to try to scaffold the repo
      // into a known state prior to running these
      console.log("typeof repo.branchName()", typeof repo.branchName());
      console.log("typeof repo.commitSHA()", typeof repo.commitSHA());
      console.log("repo.commitSHA().length", repo.commitSHA().length);

      // Silence exec logging because the exit value of the upcoming command
      // varies depending on if the working tree is dirty, so we need to omit
      // that from the snapshot
      logger.info = () => {};
      console.log("typeof repo.isWorkingTreeDirty()", typeof repo.isWorkingTreeDirty());
    `,
    { cwd: __dirname }
  );
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: git check-ignore "<rootDir>/README.md"
      exec -> {"status":1}
    exec: git check-ignore <rootDir>/node_modules
    exec: git rev-parse --abbrev-ref HEAD
    exec: git rev-parse HEAD
    exec: git rev-parse HEAD
    ",
      "stdout": "__dirname <rootDir>/meta/tests/src
    GitRepo.findRoot(__dirname) Path { <rootDir> }
    repo.repoDir Path { <rootDir> }
    repo.isIgnored("README.md") false
    repo.isIgnored(repo.repoDir.concat("node_modules")) true
    typeof repo.branchName() string
    typeof repo.commitSHA() string
    repo.commitSHA().length 40
    typeof repo.isWorkingTreeDirty() boolean
    ",
    }
  `);
});

test("attempting to call findRoot with relative path throws an error", async () => {
  const result = await evaluate(`GitRepo.findRoot(".")`, { cwd: __dirname });
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Could not resolve "." into an absolute path
      at somewhere
    ",
      "stdout": "",
    }
  `);
});

test("passing relative path to isIgnored resolves relative to repo root rather than pwd", async () => {
  const result = await evaluate(
    `
      const repo = new GitRepo(GitRepo.findRoot(__dirname));
      const fixturesPath = new Path(repo.repoDir.concat("meta/tests/fixtures/gitignoring"));
      
      const unignoredHiTxt = fixturesPath.concat("hi.txt");
      const ignoredHiTxt = fixturesPath.concat("subdir/hi.txt");

      assert(repo.isIgnored(unignoredHiTxt) === false);
      assert(repo.isIgnored(ignoredHiTxt) === true);

      cd(repo.repoDir);
      cd("meta/tests/fixtures/gitignoring");
      console.log("at", pwd(), 'repo.isIgnored("hi.txt") is:', repo.isIgnored("hi.txt"));
      cd("subdir");
      console.log("at", pwd(), 'repo.isIgnored("hi.txt") is:', repo.isIgnored("hi.txt"));
      console.log("at", pwd(), 'repo.isIgnored(pwd().concat("hi.txt")) is:', repo.isIgnored(pwd().concat("hi.txt")));
    `,
    { cwd: __dirname }
  );
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: git check-ignore "<rootDir>/meta/tests/fixtures/gitignoring/hi.txt"
      exec -> {"status":1}
    exec: git check-ignore "<rootDir>/meta/tests/fixtures/gitignoring/subdir/hi.txt"
    exec: git check-ignore "<rootDir>/hi.txt"
      exec -> {"status":1}
    exec: git check-ignore "<rootDir>/hi.txt"
      exec -> {"status":1}
    exec: git check-ignore "<rootDir>/meta/tests/fixtures/gitignoring/subdir/hi.txt"
    ",
      "stdout": "at Path { <rootDir>/meta/tests/fixtures/gitignoring } repo.isIgnored("hi.txt") is: false
    at Path { <rootDir>/meta/tests/fixtures/gitignoring/subdir } repo.isIgnored("hi.txt") is: false
    at Path { <rootDir>/meta/tests/fixtures/gitignoring/subdir } repo.isIgnored(pwd().concat("hi.txt")) is: true
    ",
    }
  `);
});

test("attempting to construct a GitRepo to a folder which isn't a git repo throws an error", async () => {
  const result = await evaluate(`new GitRepo(__dirname)`, {
    cwd: __dirname,
  });
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: The 'repoPath' provided to the GitRepo constructor doesn't appear to refer to a git repository; namely, "<rootDir>/meta/tests/src/.git" doesn't exist. (repoDir = "<rootDir>/meta/tests/src", dotGitDir = Path { <rootDir>/meta/tests/src/.git })
      at somewhere
    {
      repoDir: "<rootDir>/meta/tests/src"
      dotGitDir: Path { <rootDir>/meta/tests/src/.git }
    }
    ",
      "stdout": "",
    }
  `);
});

test("passing absolute path outside repo root to isIgnored throws an error", async () => {
  const result = await evaluate(
    `
      const repo = new GitRepo(GitRepo.findRoot(__dirname));
      repo.isIgnored("/tmp/something");
    `,
    { cwd: __dirname }
  );
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Path passed to GitRepo.isIgnored is outside of the GitRepo object's repoDir. (path = "/tmp/something", resolvedPath = "/tmp/something", cwd = Path { <rootDir>/meta/tests/src }, repoDir = "<rootDir>")
      at somewhere
    {
      path: "/tmp/something"
      resolvedPath: "/tmp/something"
      cwd: Path { <rootDir>/meta/tests/src }
      repoDir: "<rootDir>"
    }
    ",
      "stdout": "",
    }
  `);
});

test("passing path with newline to isIgnored throws error", async () => {
  const result = await evaluate(
    `
      const repo = new GitRepo(GitRepo.findRoot(__dirname));
      repo.isIgnored("a\\nb");
    `,
    { cwd: __dirname }
  );
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: GitRepo.isIgnored does not support paths with line breaks in them. GitRepo.isIgnored cannot be used to check multiple paths. (path = "a\\nb", resolvedPath = "<rootDir>/a\\nb", cwd = Path { <rootDir>/meta/tests/src }, repoDir = "<rootDir>")
      at somewhere
    {
      path: "a\\nb"
      resolvedPath: "<rootDir>/a\\nb"
      cwd: Path { <rootDir>/meta/tests/src }
      repoDir: "<rootDir>"
    }
    ",
      "stdout": "",
    }
  `);
});
