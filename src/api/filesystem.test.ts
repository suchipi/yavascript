///<reference types="@test-it/core/globals" />
import fs from "fs";
import path from "path";
import { evaluate, inspect, cleanResult } from "../test-helpers";

const rootDir = path.resolve(__dirname, "..", "..");
const globFixturesDir = path.join(rootDir, "src/api/test_fixtures/glob");
const symlinksFixturesDir = path.join(
  rootDir,
  "src/api/test_fixtures/symlinks"
);
const fileContentFixturesDir = path.join(
  rootDir,
  "src/api/test_fixtures/file_content"
);

test("ls - no args", async () => {
  const result = await evaluate(`ls()`, { cwd: globFixturesDir });
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect([
        "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
        "<rootDir>/src/api/test_fixtures/glob/potato",
        "<rootDir>/src/api/test_fixtures/glob/hi.js",
        "<rootDir>/src/api/test_fixtures/glob/hi.txt",
        "<rootDir>/src/api/test_fixtures/glob/cabana",
        "<rootDir>/src/api/test_fixtures/glob/hi",
      ]) + "\n",
  });
});

test("ls - no args (different process cwd)", async () => {
  const result = await evaluate(`ls()`, { cwd: symlinksFixturesDir });
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect([
        "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
        "<rootDir>/src/api/test_fixtures/symlinks/link-to-file",
        "<rootDir>/src/api/test_fixtures/symlinks/link-to-folder",
        "<rootDir>/src/api/test_fixtures/symlinks/dead-link",
        "<rootDir>/src/api/test_fixtures/symlinks/some-file",
      ]) + "\n",
  });
});

test("ls - relative paths", async () => {
  const result = await evaluate(`ls(".", { relativePaths: true })`, {
    cwd: globFixturesDir,
  });
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect([
        "hi.something.js",
        "potato",
        "hi.js",
        "hi.txt",
        "cabana",
        "hi",
      ]) + "\n",
  });
});

test("ls - specifying dir", async () => {
  const result = await evaluate(`ls("./potato")`, { cwd: globFixturesDir });
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect([
        "<rootDir>/src/api/test_fixtures/glob/potato/banana",
        "<rootDir>/src/api/test_fixtures/glob/potato/eggplant",
      ]) + "\n",
  });
});

test("ls - specifying dir with relative paths", async () => {
  const result = await evaluate(`ls("./potato", { relativePaths: true })`, {
    cwd: globFixturesDir,
  });
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(["banana", "eggplant"]) + "\n",
  });
});

test("readlink", async () => {
  const result = await evaluate(
    `[readlink("dead-link"), readlink("link-to-file"), readlink("link-to-folder")]`,
    { cwd: symlinksFixturesDir }
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(["./nowhere-real", "./some-file", "./some-folder"]) + "\n",
  });
});

test("readFile", async () => {
  const result = await evaluate(
    `readFile("${fileContentFixturesDir}/hello.txt")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "hello, world!!! :D\nあ" + "\n", // extra newline from console.log
  });
});

test("writeFile", async () => {
  const targetFile = path.join(fileContentFixturesDir, "written.txt");
  if (fs.existsSync(targetFile)) {
    fs.unlinkSync(targetFile);
    expect(fs.existsSync(targetFile)).toBe(false);
  }

  const result = await evaluate(
    `writeFile(${JSON.stringify(targetFile)}, "hiiii~!!! :D あ")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  const content = fs.readFileSync(targetFile, "utf-8");
  expect(content).toBe("hiiii~!!! :D あ");

  fs.unlinkSync(targetFile);
});

test("isDir - on dir", async () => {
  const result = await evaluate(`isDir("./src/api/test_fixtures/glob/cabana")`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("isDir - on file", async () => {
  const result = await evaluate(`isDir("./src/api/test_fixtures/glob/hi.txt")`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(false) + "\n",
  });
});

test("isDir - on link to folder", async () => {
  const result = await evaluate(
    `isDir("./src/api/test_fixtures/symlinks/link-to-folder")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("isDir - on link to file", async () => {
  const result = await evaluate(
    `isDir("./src/api/test_fixtures/symlinks/link-to-file")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(false) + "\n",
  });
});

test("isDir - on dead link", async () => {
  const result = await evaluate(
    `isDir("./src/api/test_fixtures/symlinks/dead-link")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(false) + "\n",
  });
});

test("isLink - on dir", async () => {
  const result = await evaluate(
    `isLink("./src/api/test_fixtures/glob/cabana")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(false) + "\n",
  });
});

test("isLink - on file", async () => {
  const result = await evaluate(
    `isLink("./src/api/test_fixtures/glob/hi.txt")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(false) + "\n",
  });
});

test("isLink - on link to folder", async () => {
  const result = await evaluate(
    `isLink("./src/api/test_fixtures/symlinks/link-to-folder")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("isLink - on link to file", async () => {
  const result = await evaluate(
    `isLink("./src/api/test_fixtures/symlinks/link-to-file")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("isLink - on dead link", async () => {
  const result = await evaluate(
    `isLink("./src/api/test_fixtures/symlinks/dead-link")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("remove - on file", async () => {
  const target = "./src/api/test_fixtures/remove/hi.txt";

  fs.writeFileSync(target, "hello there");

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`remove(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  expect(fs.existsSync(target)).toBe(false);
});

test("remove - on empty dir", async () => {
  const targetDir = "./src/api/test_fixtures/remove/empty-dir";

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir);

  expect(fs.existsSync(targetDir)).toBe(true);

  const result = await evaluate(`remove(${JSON.stringify(targetDir)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  expect(fs.existsSync(targetDir)).toBe(false);
});

test("remove - on dir with content", async () => {
  const targetDir = "./src/api/test_fixtures/remove/dir-with-content";

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir);

  fs.mkdirSync(path.join(targetDir, "empty-dir"));
  fs.mkdirSync(path.join(targetDir, "another-dir-with-content"));
  fs.writeFileSync(
    path.join(targetDir, "another-dir-with-content", "hi.txt"),
    "hello there"
  );
  fs.writeFileSync(
    path.join(targetDir, "another-dir-with-content", "hi2.txt"),
    "hello again!!"
  );
  fs.mkdirSync(
    path.join(targetDir, "another-dir-with-content", "another-empty-dir")
  );
  fs.writeFileSync(path.join(targetDir, "something.js"), "console.log(2 + 2);");

  const result = await evaluate(`remove(${JSON.stringify(targetDir)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  expect(fs.existsSync(targetDir)).toBe(false);
});

test("exists - existent target file", async () => {
  const target = "./src/api/test_fixtures/glob/hi.something.js";

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("exists - existent target dir", async () => {
  const target = "./src/api/test_fixtures/glob";

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("exists - nonexistent target", async () => {
  const target = "./src/api/test_fixtures/glob/nope_this_aint_there";

  expect(fs.existsSync(target)).toBe(false);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(false) + "\n",
  });
});

test("exists - link to file", async () => {
  const target = "./src/api/test_fixtures/symlinks/link-to-file";

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("exists - link to dir", async () => {
  const target = "./src/api/test_fixtures/symlinks/link-to-folder";

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

// weird that this says it doesn't exist, but that's consistent with os.access
// and node behavior, so I guess it's fine
test("exists - dead link", async () => {
  const target = "./src/api/test_fixtures/symlinks/dead-link";

  expect(fs.existsSync(target)).toBe(false);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(false) + "\n",
  });
});

test("ensureDir", async () => {
  const outerTarget = "./src/api/test_fixtures/ensure_dir/some";
  const target = path.join(outerTarget, "very/deep/path");

  if (fs.existsSync(outerTarget)) {
    fs.rmSync(outerTarget, { recursive: true, force: true });
  }

  expect(fs.existsSync(outerTarget)).toBe(false);

  const result = await evaluate(`ensureDir(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  expect(fs.existsSync(outerTarget)).toBe(true);
  expect(fs.existsSync(target)).toBe(true);

  fs.rmSync(outerTarget, { recursive: true, force: true });
});

test("ensureDir - file collision errors", async () => {
  const outerTarget = "./src/api/test_fixtures/ensure_dir/collision";
  const target = path.join(outerTarget, "file");

  if (fs.existsSync(outerTarget)) {
    fs.rmSync(outerTarget, { recursive: true, force: true });
  }

  expect(fs.existsSync(outerTarget)).toBe(false);

  fs.mkdirSync(outerTarget);
  fs.writeFileSync(target, "hi");

  const result = await evaluate(`ensureDir(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 1,
    error: false,
    stderr: [
      "Error: Wanted to ensure that the directory path src/api/test_fixtures/ensure_dir/collision/file existed, but src/api/test_fixtures/ensure_dir/collision/file was a file, not a directory",
      "  at ensureDir (yavascript-internal.js)",
      "  at <eval> (<evalScript>)",
      "",
    ].join("\n"),
    stdout: "",
  });

  fs.rmSync(outerTarget, { recursive: true, force: true });
});

test("copy", async () => {
  const source = "./src/api/test_fixtures/copy/blah";
  const target = "./src/api/test_fixtures/copy/blah_copy";

  // wanna have an empty folder in this test, but empty folders
  // can't be in git
  if (!fs.existsSync(path.join(source, "/blah3"))) {
    fs.mkdirSync(path.join(source, "/blah3"));
  }

  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }

  const result = await evaluate(
    `copy(${JSON.stringify(source)}, ${JSON.stringify(target)})`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  const blah2 = path.join(target, "blah2");
  const blah3 = path.join(target, "blah3");
  const blah2_hiTxt = path.join(target, "blah2", "hi.txt");

  expect(fs.existsSync(target)).toBe(true);
  expect(fs.statSync(target).isDirectory()).toBe(true);
  expect(fs.existsSync(blah2)).toBe(true);
  expect(fs.statSync(blah2).isDirectory()).toBe(true);
  expect(fs.existsSync(blah3)).toBe(true);
  expect(fs.statSync(blah3).isDirectory()).toBe(true);
  expect(fs.readFileSync(blah2_hiTxt, "utf-8")).toBe("yeah hi there\n");

  fs.rmSync(target, { recursive: true, force: true });
});