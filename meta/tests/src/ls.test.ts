import { evaluate, cleanResult, rootDir } from "./test-helpers";

const globFixturesDir = rootDir("meta/tests/fixtures/glob");
const symlinksFixturesDir = rootDir("meta/tests/fixtures/symlinks");

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
      "<rootDir>/meta/tests/fixtures/glob/hi.something.js",
      "<rootDir>/meta/tests/fixtures/glob/potato",
      "<rootDir>/meta/tests/fixtures/glob/hi.js",
      "<rootDir>/meta/tests/fixtures/glob/hi.txt",
      "<rootDir>/meta/tests/fixtures/glob/cabana",
      "<rootDir>/meta/tests/fixtures/glob/hi",
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
      "<rootDir>/meta/tests/fixtures/symlinks/some-folder",
      "<rootDir>/meta/tests/fixtures/symlinks/link-to-file",
      "<rootDir>/meta/tests/fixtures/symlinks/link-to-folder",
      "<rootDir>/meta/tests/fixtures/symlinks/dead-link",
      "<rootDir>/meta/tests/fixtures/symlinks/some-file",
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
      "<rootDir>/meta/tests/fixtures/glob/potato/banana",
      "<rootDir>/meta/tests/fixtures/glob/potato/eggplant",
    ].sort()
  );
});
