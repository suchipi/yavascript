import path from "path";
import { evaluate, cleanResult } from "../../test-helpers";

const rootDir = path.resolve(__dirname, "..", "..", "..");
const globFixturesDir = path.join(rootDir, "src/api/test_fixtures/glob");
const symlinksFixturesDir = path.join(
  rootDir,
  "src/api/test_fixtures/symlinks"
);

test("ls - no args", async () => {
  const result = await evaluate(`JSON.stringify(ls())`, {
    cwd: globFixturesDir,
  });
  const cleaned = cleanResult(result);
  expect(cleaned).toMatchObject({
    code: 0,
    error: false,
    stderr: "",
  });

  expect(JSON.parse(cleaned.stdout).sort()).toEqual(
    [
      "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
      "<rootDir>/src/api/test_fixtures/glob/potato",
      "<rootDir>/src/api/test_fixtures/glob/hi.js",
      "<rootDir>/src/api/test_fixtures/glob/hi.txt",
      "<rootDir>/src/api/test_fixtures/glob/cabana",
      "<rootDir>/src/api/test_fixtures/glob/hi",
    ].sort()
  );
});

test("ls - no args (different process cwd)", async () => {
  const result = await evaluate(`JSON.stringify(ls())`, {
    cwd: symlinksFixturesDir,
  });
  const cleaned = cleanResult(result);
  expect(cleaned).toMatchObject({
    code: 0,
    error: false,
    stderr: "",
  });

  expect(JSON.parse(cleaned.stdout).sort()).toEqual(
    [
      "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
      "<rootDir>/src/api/test_fixtures/symlinks/link-to-file",
      "<rootDir>/src/api/test_fixtures/symlinks/link-to-folder",
      "<rootDir>/src/api/test_fixtures/symlinks/dead-link",
      "<rootDir>/src/api/test_fixtures/symlinks/some-file",
    ].sort()
  );
});

test("ls - relative paths", async () => {
  const result = await evaluate(
    `JSON.stringify(ls(".", { relativePaths: true }))`,
    { cwd: globFixturesDir }
  );
  const cleaned = cleanResult(result);
  expect(cleaned).toMatchObject({
    code: 0,
    error: false,
    stderr: "",
  });

  expect(JSON.parse(cleaned.stdout).sort()).toEqual(
    [
      //
      "hi.something.js",
      "potato",
      "hi.js",
      "hi.txt",
      "cabana",
      "hi",
    ].sort()
  );
});

test("ls - specifying dir", async () => {
  const result = await evaluate(`JSON.stringify(ls("./potato"))`, {
    cwd: globFixturesDir,
  });
  const cleaned = cleanResult(result);
  expect(cleaned).toMatchObject({
    code: 0,
    error: false,
    stderr: "",
  });

  expect(JSON.parse(cleaned.stdout).sort()).toEqual(
    [
      //
      "<rootDir>/src/api/test_fixtures/glob/potato/banana",
      "<rootDir>/src/api/test_fixtures/glob/potato/eggplant",
    ].sort()
  );
});

test("ls - specifying dir with relative paths", async () => {
  const result = await evaluate(
    `JSON.stringify(ls("./potato", { relativePaths: true }))`,
    { cwd: globFixturesDir }
  );
  const cleaned = cleanResult(result);
  expect(cleaned).toMatchObject({
    code: 0,
    error: false,
    stderr: "",
  });

  expect(JSON.parse(cleaned.stdout).sort()).toEqual(
    [
      //
      "banana",
      "eggplant",
    ].sort()
  );
});
