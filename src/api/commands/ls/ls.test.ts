import path from "path";
import { evaluate, cleanResult, rootDir } from "../../../test-helpers";

const globFixturesDir = path.join(rootDir(), "src/test_fixtures/glob");
const symlinksFixturesDir = path.join(rootDir(), "src/test_fixtures/symlinks");

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
      "<rootDir>/src/test_fixtures/glob/hi.something.js",
      "<rootDir>/src/test_fixtures/glob/potato",
      "<rootDir>/src/test_fixtures/glob/hi.js",
      "<rootDir>/src/test_fixtures/glob/hi.txt",
      "<rootDir>/src/test_fixtures/glob/cabana",
      "<rootDir>/src/test_fixtures/glob/hi",
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
      "<rootDir>/src/test_fixtures/symlinks/some-folder",
      "<rootDir>/src/test_fixtures/symlinks/link-to-file",
      "<rootDir>/src/test_fixtures/symlinks/link-to-folder",
      "<rootDir>/src/test_fixtures/symlinks/dead-link",
      "<rootDir>/src/test_fixtures/symlinks/some-file",
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
      "<rootDir>/src/test_fixtures/glob/potato/banana",
      "<rootDir>/src/test_fixtures/glob/potato/eggplant",
    ].sort()
  );
});
