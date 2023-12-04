import fs from "fs";
import path from "path";
import { evaluate, cleanResult, rootDir } from "../../../test-helpers";

const workDir = rootDir.concat("src/test_fixtures/mkdir");

const clean = () => {
  const children = fs.readdirSync(workDir());
  for (const child of children) {
    if (child.startsWith(".")) continue;
    fs.rmSync(workDir(child), { recursive: true, force: true });
  }
};

beforeEach(clean);
afterAll(clean);

describe("non-recursive", () => {
  test("mkdir - relative path", async () => {
    const target = rootDir.relative(workDir("relative"));

    expect(fs.existsSync(target)).toBe(false);

    const result = await evaluate(`mkdir(${JSON.stringify(target)})`, {
      cwd: rootDir(),
    });
    expect(cleanResult(result)).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "",
      }
    `);

    expect(fs.existsSync(target)).toBe(true);
  });

  test("mkdir - absolute path", async () => {
    const target = workDir("relative");

    expect(fs.existsSync(target)).toBe(false);

    const result = await evaluate(`mkdir(${JSON.stringify(target)})`);
    expect(cleanResult(result)).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "",
      }
    `);

    expect(fs.existsSync(target)).toBe(true);
  });

  test("mkdir - file collision errors", async () => {
    const outerTarget = workDir("collision");
    const target = path.join(outerTarget, "file");

    expect(fs.existsSync(outerTarget)).toBe(false);

    fs.mkdirSync(outerTarget);
    fs.writeFileSync(target, "hi");

    const result = await evaluate(`mkdir(${JSON.stringify(target)})`);
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": false,
        "stderr": "Error: Cannot use mkdir to create directory '<rootDir>/src/test_fixtures/mkdir/collision/file' because there is an existing file with that name.
        at somewhere
      {
        path: Path { <rootDir>/src/test_fixtures/mkdir/collision/file }
      }
      ",
        "stdout": "",
      }
    `);
  });

  test("mkdir - parent file collision errors", async () => {
    const outerTarget = workDir("parent_collision");
    const target = path.join(outerTarget, "file");

    expect(fs.existsSync(outerTarget)).toBe(false);
    fs.mkdirSync(path.dirname(outerTarget), { recursive: true });
    fs.writeFileSync(outerTarget, "hi");

    const result = await evaluate(`mkdir(${JSON.stringify(target)})`);
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": false,
        "stderr": "Error: Cannot use mkdir to create directory '<rootDir>/src/test_fixtures/mkdir/parent_collision/file' because its parent '<rootDir>/src/test_fixtures/mkdir/parent_collision' exists but is not a directory.
        at somewhere
      {
        path: Path { <rootDir>/src/test_fixtures/mkdir/parent_collision/file }
        parentPath: Path { <rootDir>/src/test_fixtures/mkdir/parent_collision }
      }
      ",
        "stdout": "",
      }
    `);
  });
});

describe("recursive", () => {
  const recursiveWorkDir = workDir.concat("recursive");

  test("mkdir recursive - relative path", async () => {
    const outerTarget = rootDir.relative(recursiveWorkDir("relative"));
    const target = path.join(outerTarget, "some/very/deep/path");

    expect(fs.existsSync(outerTarget)).toBe(false);

    const result = await evaluate(
      `mkdir(${JSON.stringify(target)}, { recursive: true })`,
      { cwd: rootDir() }
    );
    expect(cleanResult(result)).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "",
      }
    `);

    expect(fs.existsSync(outerTarget)).toBe(true);
    expect(fs.existsSync(target)).toBe(true);
  });

  test("mkdir recursive - absolute path", async () => {
    const outerTarget = recursiveWorkDir("relative");
    const target = path.join(outerTarget, "very/deep/path");

    expect(fs.existsSync(outerTarget)).toBe(false);

    const result = await evaluate(
      `mkdir(${JSON.stringify(target)}, { recursive: true })`
    );
    expect(cleanResult(result)).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "",
      }
    `);

    expect(fs.existsSync(outerTarget)).toBe(true);
    expect(fs.existsSync(target)).toBe(true);
  });

  test("mkdir recursive - file collision errors", async () => {
    const outerTarget = recursiveWorkDir("collision");
    const target = path.join(outerTarget, "file");

    expect(fs.existsSync(outerTarget)).toBe(false);

    fs.mkdirSync(outerTarget, { recursive: true });
    fs.writeFileSync(target, "hi");

    const result = await evaluate(
      `mkdir(${JSON.stringify(target)}, { recursive: true })`
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": false,
        "stderr": "Error: Cannot use mkdir to create directory '<rootDir>/src/test_fixtures/mkdir/recursive/collision/file' because '<rootDir>/src/test_fixtures/mkdir/recursive/collision/file' is a file, not a directory.
        at somewhere
      {
        path: Path { <rootDir>/src/test_fixtures/mkdir/recursive/collision/file }
        pathSoFar: Path { <rootDir>/src/test_fixtures/mkdir/recursive/collision/file }
      }
      ",
        "stdout": "",
      }
    `);
  });

  test("mkdir recursive - parent file collision errors", async () => {
    const outerTarget = recursiveWorkDir("parent_collision");
    const target = path.join(outerTarget, "file");

    expect(fs.existsSync(outerTarget)).toBe(false);
    fs.mkdirSync(path.dirname(outerTarget), { recursive: true });
    fs.writeFileSync(outerTarget, "hi");

    const result = await evaluate(
      `mkdir(${JSON.stringify(target)}, { recursive: true })`
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": false,
        "stderr": "Error: Cannot use mkdir to create directory '<rootDir>/src/test_fixtures/mkdir/recursive/parent_collision/file' because '<rootDir>/src/test_fixtures/mkdir/recursive/parent_collision' is a file, not a directory.
        at somewhere
      {
        path: Path { <rootDir>/src/test_fixtures/mkdir/recursive/parent_collision/file }
        pathSoFar: Path { <rootDir>/src/test_fixtures/mkdir/recursive/parent_collision }
      }
      ",
        "stdout": "",
      }
    `);
  });
});

// TODO: test 'mode' option
