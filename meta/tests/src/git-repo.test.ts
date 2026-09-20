import { afterAll, beforeAll, expect, test } from "vitest";
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { evaluate, rootDir } from "./test-helpers";

const gitFixturesDir = rootDir.concat("meta/tests/fixtures/git-fixtures");
const repoADir = gitFixturesDir("repo-a");
const repoBDir = gitFixturesDir("repo-b");
const worktreeLikeDir = gitFixturesDir("worktree-like");

/** Keeps the fixture repos out of reach of the host's git config and of any
 * git environment variables the test runner was started with. */
const gitEnv = () => {
  const { GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, ...rest } = process.env;
  return {
    ...rest,
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_CONFIG_SYSTEM: "/dev/null",
  };
};

const git = (args: Array<string>) =>
  execFileSync("git", args, {
    env: gitEnv(),
    stdio: "pipe",
    encoding: "utf-8",
  });

const makeRepo = (dir: string, branchName: string, commitMessage: string) => {
  git(["init", "-q", dir]);
  git([
    "-C",
    dir,
    "-c",
    "user.email=test@example.com",
    "-c",
    "user.name=Test",
    "commit",
    "-q",
    "--allow-empty",
    "-m",
    commitMessage,
  ]);
  git(["-C", dir, "branch", "-M", branchName]);
};

const cleanGitFixtures = () => {
  for (const child of fs.readdirSync(gitFixturesDir())) {
    if (child === ".gitignore") continue;
    fs.rmSync(gitFixturesDir(child), { recursive: true, force: true });
  }
};

let repoAHead = "";

beforeAll(() => {
  cleanGitFixtures();

  makeRepo(repoADir, "repo-a-branch", "repo a");
  makeRepo(repoBDir, "repo-b-branch", "repo b");
  repoAHead = git(["-C", repoADir, "rev-parse", "HEAD"]).trim();

  fs.mkdirSync(path.join(worktreeLikeDir, "src"), { recursive: true });
  fs.writeFileSync(
    path.join(worktreeLikeDir, ".git"),
    `gitdir: ${path.join(repoADir, ".git")}\n`,
  );
});

afterAll(cleanGitFixtures);

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
    { cwd: __dirname },
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Error: Could not resolve "." into an absolute path
     at somewhere
   {
     fileName: "yavascript-internals/dist/bundles/layer1.js"
     lineNumber: <redacted>
     columnNumber: <redacted>
   }
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
    { cwd: __dirname },
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
   at somewhere
   ",
   }
  `);
});

test("attempting to construct a GitRepo to a folder which isn't a git repo throws an error", async () => {
  const result = await evaluate(`new GitRepo(__dirname)`, {
    cwd: __dirname,
  });
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Error: The 'repoPath' provided to the GitRepo constructor doesn't appear to refer to a git repository; namely, "<rootDir>/meta/tests/src/.git" doesn't exist. (repoDir = "<rootDir>/meta/tests/src", dotGitDir = Path { <rootDir>/meta/tests/src/.git })
     at somewhere
   {
     fileName: "yavascript-internals/dist/bundles/layer1.js"
     lineNumber: <redacted>
     columnNumber: <redacted>
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
    { cwd: __dirname },
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Error: Path passed to GitRepo.isIgnored is outside of the GitRepo object's repoDir. (path = "/tmp/something", resolvedPath = "/tmp/something", cwd = Path { <rootDir>/meta/tests/src }, repoDir = "<rootDir>")
     at somewhere
   {
     fileName: "yavascript-internals/dist/bundles/layer1.js"
     lineNumber: <redacted>
     columnNumber: <redacted>
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

test("GitRepo methods describe repoDir even when GIT_DIR points at another repo", async () => {
  const result = await evaluate(
    `
      logger.info = () => {};
      const repo = new GitRepo(${JSON.stringify(repoADir)});
      console.log("commitSHA", repo.commitSHA());
      console.log("branchName", repo.branchName());
    `,
    { env: { ...gitEnv(), GIT_DIR: path.join(repoBDir, ".git") } },
  );
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: `commitSHA ${repoAHead}\nbranchName repo-a-branch\n`,
  });
});

test("GitRepo.findRoot finds a checkout whose .git is a file", async () => {
  const result = await evaluate(`
    console.log(GitRepo.findRoot(${JSON.stringify(path.join(worktreeLikeDir, "src"))}).toString());
    console.log(GitRepo.findRoot(${JSON.stringify(worktreeLikeDir)}).toString());
  `);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "<rootDir>/meta/tests/fixtures/git-fixtures/worktree-like\n".repeat(
      2,
    ),
  });
});

test("passing path with newline to isIgnored throws error", async () => {
  const result = await evaluate(
    `
      const repo = new GitRepo(GitRepo.findRoot(__dirname));
      repo.isIgnored("a\\nb");
    `,
    { cwd: __dirname },
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Error: GitRepo.isIgnored does not support paths with line breaks in them. GitRepo.isIgnored cannot be used to check multiple paths. (path = "a\\nb", resolvedPath = "<rootDir>/a\\nb", cwd = Path { <rootDir>/meta/tests/src }, repoDir = "<rootDir>")
     at somewhere
   {
     fileName: "yavascript-internals/dist/bundles/layer1.js"
     lineNumber: <redacted>
     columnNumber: <redacted>
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
