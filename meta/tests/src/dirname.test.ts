import { expect, test } from "vitest";
import { evaluate, rootDir } from "./test-helpers";

const globFixturesDir = rootDir("meta/tests/fixtures/glob");

test("dirname", async () => {
  const result = await evaluate(`dirname("/hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "Path { /hi/there }
   ",
   }
  `);
});

test("dirname (folder in root dir)", async () => {
  const result = await evaluate(`dirname("/hi")`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "Path { / }
   ",
   }
  `);
});

test("dirname (windows-style path)", async () => {
  const result = await evaluate(`dirname("C:\\\\Users\\\\Suchipi")`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "Path { C:\\Users }
   ",
   }
  `);
});

test("dirname - a path with no directory part is the current directory", async () => {
  const result = await evaluate(
    `JSON.stringify([
      dirname("a.txt"),
      dirname("."),
      dirname(".."),
      dirname(""),
      dirname(new Path("a.txt")),
    ].map(String))`,
  );
  // coreutils `dirname` prints "." for all of these.
  expect(result).toMatchObject({
    code: 0,
    stderr: "",
    stdout: `[".",".",".",".","."]\n`,
  });
});

test("dirname - ls of a bare filename's dirname lists the current directory", async () => {
  const result = await evaluate(
    `JSON.stringify(ls(dirname("hi.txt")).map((p) => p.basename()).sort())`,
    { cwd: globFixturesDir },
  );
  expect(result).toMatchObject({ code: 0, stderr: "" });

  expect(JSON.parse(result.stdout)).toEqual([
    "cabana",
    "hi",
    "hi.js",
    "hi.something.js",
    "hi.txt",
    "potato",
  ]);
});
