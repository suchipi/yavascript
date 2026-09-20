import { afterAll, beforeEach, expect, test } from "vitest";
import fs from "fs";
import { pathMarker } from "path-less-traveled";
import { evaluate, rootDir } from "./test-helpers";

const fixturesDir = pathMarker(rootDir("meta/tests/fixtures/which"));

const scratchDir = rootDir.concat("meta/tests/fixtures/which-scratch");

const cleanScratch = () => {
  for (const child of fs.readdirSync(scratchDir())) {
    if (child.startsWith(".")) continue;
    fs.rmSync(scratchDir(child), { recursive: true, force: true });
  }
};

beforeEach(cleanScratch);
afterAll(cleanScratch);

test("which", async () => {
  const env = {
    PATH: [
      fixturesDir("bin1"),
      fixturesDir("bin2"),
      fixturesDir("usr/bin3"),
    ].join(":"),
  };

  const script = `
    echo([
      which("program"),
      which("program2"),
      which("program3"),
      which("program4657438"), // doesn't exist

      which("program", {
        // override PATH
        searchPaths: ${JSON.stringify([fixturesDir("bin2")])}
      }),

      which("something"),
      which("something", {
        suffixes: [".exe", ".bat"],
      }),

      which("sample", {
        suffixes: [".one", ".two"],
        logging: {
          trace: console.error,
        },
      }),
      which("program2", {
        logging: {
          trace: console.error,
        },
      }),
    ]);
  `;

  const result = await evaluate(script, { env });
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "which: Searching for "sample" in "<rootDir>/meta/tests/fixtures/which/bin1"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/bin1/sample"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/bin1/sample.one"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/bin1/sample.two"
   which: Searching for "sample" in "<rootDir>/meta/tests/fixtures/which/bin2"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/bin2/sample"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/bin2/sample.one"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/bin2/sample.two"
   which: Searching for "sample" in "<rootDir>/meta/tests/fixtures/which/usr/bin3"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/usr/bin3/sample"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/usr/bin3/sample.one"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/usr/bin3/sample.two"
   which: Failed to find "sample"...
   which: Searching for "program2" in "<rootDir>/meta/tests/fixtures/which/bin1"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/bin1/program2"
   which: Searching for "program2" in "<rootDir>/meta/tests/fixtures/which/bin2"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/bin2/program2"
   which: Searching for "program2" in "<rootDir>/meta/tests/fixtures/which/usr/bin3"
   which: Checking for "<rootDir>/meta/tests/fixtures/which/usr/bin3/program2"
   which: Found "program2" at "<rootDir>/meta/tests/fixtures/which/usr/bin3/program2"!
   ",
     "stdout": "[
     Path { <rootDir>/meta/tests/fixtures/which/bin1/program }
     Path { <rootDir>/meta/tests/fixtures/which/usr/bin3/program2 }
     Path { <rootDir>/meta/tests/fixtures/which/bin2/program3 }
     null
     Path { <rootDir>/meta/tests/fixtures/which/bin2/program }
     null
     Path { <rootDir>/meta/tests/fixtures/which/bin1/something.bat }
     null
     Path { <rootDir>/meta/tests/fixtures/which/usr/bin3/program2 }
   ]
   ",
   }
  `);
});

test("which - a directory on the search path is not a match", async () => {
  const binDir = scratchDir("bin");
  fs.mkdirSync(scratchDir("bin", "tool"), { recursive: true });

  const searchPaths = JSON.stringify([binDir]);
  const result = await evaluate(
    `JSON.stringify([
      which("tool", { searchPaths: ${searchPaths} }),
      which(".", { searchPaths: ${searchPaths} }),
      which("..", { searchPaths: ${searchPaths} }),
    ])`,
  );
  expect(result).toMatchObject({
    code: 0,
    stderr: "",
    stdout: "[null,null,null]\n",
  });
});

test("which - an empty binary name has no match", async () => {
  const result = await evaluate(
    `JSON.stringify(which("", { searchPaths: ${JSON.stringify([fixturesDir("bin1")])} }))`,
  );
  expect(result).toMatchObject({
    code: 0,
    stderr: "",
    stdout: "null\n",
  });
});

test("which - an empty search path entry means the current directory", async () => {
  const dir = scratchDir("local");
  fs.mkdirSync(dir, { recursive: true });
  const program = scratchDir("local", "localprog");
  fs.writeFileSync(program, "");
  fs.chmodSync(program, 0o755);

  const result = await evaluate(
    `const found = which("localprog", { searchPaths: [""] });
     const resolved =
       found == null ? null : exists(found) ? realpath(found).toString() : String(found);
     JSON.stringify([resolved, realpath("./localprog").toString()])`,
    { cwd: dir },
  );
  expect(result).toMatchObject({ code: 0, stderr: "" });

  // POSIX reads an empty PATH entry as the current directory.
  const [found, expected] = JSON.parse(result.stdout);
  expect(found).toBe(expected);
});
