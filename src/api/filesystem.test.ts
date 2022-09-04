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
    {
      cwd: symlinksFixturesDir,
    }
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
    `writeFile(${JSON.stringify(targetFile)}, "hiiii~!!! :D あ")`,
    { cwd: rootDir }
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
  const result = await evaluate(
    `isDir("./src/api/test_fixtures/glob/cabana")`,
    { cwd: rootDir }
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});

test("isDir - on file", async () => {
  const result = await evaluate(
    `isDir("./src/api/test_fixtures/glob/hi.txt")`,
    { cwd: rootDir }
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(false) + "\n",
  });
});

test("isDir - on link to folder", async () => {
  const result = await evaluate(
    `isDir("./src/api/test_fixtures/symlinks/link-to-folder")`,
    { cwd: rootDir }
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
    `isDir("./src/api/test_fixtures/symlinks/link-to-file")`,
    { cwd: rootDir }
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
    `isDir("./src/api/test_fixtures/symlinks/dead-link")`,
    { cwd: rootDir }
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
    `isLink("./src/api/test_fixtures/glob/cabana")`,
    { cwd: rootDir }
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
    `isLink("./src/api/test_fixtures/glob/hi.txt")`,
    { cwd: rootDir }
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
    `isLink("./src/api/test_fixtures/symlinks/link-to-folder")`,
    { cwd: rootDir }
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
    `isLink("./src/api/test_fixtures/symlinks/link-to-file")`,
    { cwd: rootDir }
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
    `isLink("./src/api/test_fixtures/symlinks/dead-link")`,
    { cwd: rootDir }
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(true) + "\n",
  });
});
