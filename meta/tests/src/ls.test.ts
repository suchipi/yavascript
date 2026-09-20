import { afterAll, beforeEach, expect, test } from "vitest";
import fs from "fs";
import { evaluate, rootDir } from "./test-helpers";

const globFixturesDir = rootDir("meta/tests/fixtures/glob");
const symlinksFixturesDir = rootDir("meta/tests/fixtures/symlinks");

const scratchDir = rootDir.concat("meta/tests/fixtures/ls-scratch");

const cleanScratch = () => {
  for (const child of fs.readdirSync(scratchDir())) {
    if (child.startsWith(".")) continue;
    const target = scratchDir(child);
    // chmod back anything a test made unreadable, so rm can descend into it
    try {
      if (fs.lstatSync(target).isDirectory()) fs.chmodSync(target, 0o755);
    } catch {}
    fs.rmSync(target, { recursive: true, force: true });
  }
};

beforeEach(cleanScratch);
afterAll(cleanScratch);

test("ls - no args", async () => {
  const result = await evaluate(`JSON.stringify(ls())`, {
    cwd: globFixturesDir,
  });
  expect(result).toMatchObject({
    code: 0,
    error: null,
    stderr: "",
  });

  expect(JSON.parse(result.stdout).sort()).toEqual(
    [
      "<rootDir>/meta/tests/fixtures/glob/hi.something.js",
      "<rootDir>/meta/tests/fixtures/glob/potato",
      "<rootDir>/meta/tests/fixtures/glob/hi.js",
      "<rootDir>/meta/tests/fixtures/glob/hi.txt",
      "<rootDir>/meta/tests/fixtures/glob/cabana",
      "<rootDir>/meta/tests/fixtures/glob/hi",
    ].sort(),
  );
});

test("ls - no args (different process cwd)", async () => {
  const result = await evaluate(`JSON.stringify(ls())`, {
    cwd: symlinksFixturesDir,
  });
  expect(result).toMatchObject({
    code: 0,
    error: null,
    stderr: "",
  });

  expect(JSON.parse(result.stdout).sort()).toEqual(
    [
      "<rootDir>/meta/tests/fixtures/symlinks/some-folder",
      "<rootDir>/meta/tests/fixtures/symlinks/link-to-file",
      "<rootDir>/meta/tests/fixtures/symlinks/link-to-folder",
      "<rootDir>/meta/tests/fixtures/symlinks/dead-link",
      "<rootDir>/meta/tests/fixtures/symlinks/some-file",
    ].sort(),
  );
});

test("ls - specifying dir", async () => {
  const result = await evaluate(`JSON.stringify(ls("./potato"))`, {
    cwd: globFixturesDir,
  });
  expect(result).toMatchObject({
    code: 0,
    error: null,
    stderr: "",
  });

  expect(JSON.parse(result.stdout).sort()).toEqual(
    [
      //
      "<rootDir>/meta/tests/fixtures/glob/potato/banana",
      "<rootDir>/meta/tests/fixtures/glob/potato/eggplant",
    ].sort(),
  );
});

test("ls - a caught permission error doesn't abort the process at exit", async () => {
  const locked = scratchDir("locked");
  fs.mkdirSync(locked);
  fs.chmodSync(locked, 0o000);

  const result = await evaluate(
    `try { ls(${JSON.stringify(locked)}) } catch (err) { echo("caught") } echo("done")`,
  );
  expect(result).toMatchObject({
    code: 0,
    stderr: "",
    stdout: "caught\ndone\n",
  });
});

test("os.readdir - a caught error doesn't abort the process at exit", async () => {
  const missing = scratchDir("definitely-not-here");
  expect(fs.existsSync(missing)).toBe(false);

  const result = await evaluate(
    `try { os.readdir(${JSON.stringify(missing)}) } catch (err) { echo("caught") } echo("done")`,
  );
  expect(result).toMatchObject({
    code: 0,
    stderr: "",
    stdout: "caught\ndone\n",
  });
});
