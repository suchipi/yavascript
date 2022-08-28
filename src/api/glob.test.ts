///<reference types="@test-it/core/globals" />
import path from "path";
import { evaluate, inspect } from "../test-helpers";

const globDir = path.join(__dirname, "test_fixtures/glob");
const symlinksDir = path.join(__dirname, "test_fixtures/symlinks");

function testGlob(
  name: string,
  dir: string,
  patterns: Array<string>,
  expected: Array<string>,
  options?: { followSymlinks?: boolean },
  testFn?: (descr: string, body: () => any) => any
) {
  // So you can do test.only, etc
  if (!testFn) testFn = test;

  testFn(name, async () => {
    const args: Array<any> = [dir, patterns];

    if (options) {
      args.push(options);
    }

    const result = await evaluate(
      `glob(${args.map((arg) => JSON.stringify(arg)).join(", ")})`
    );

    expect(result).toEqual({
      code: 0,
      error: false,
      stderr: "",
      stdout:
        inspect(expected.map((filename) => path.join(dir, filename))) + "\n",
    });
  });
}

testGlob(
  "simple glob",
  globDir,
  ["*"],
  ["hi.something.js", "potato", "hi.js", "hi.txt", "cabana", "hi"]
);

testGlob(
  "simple starglob",
  globDir,
  ["**/*"],
  [
    "hi.something.js",
    "potato",
    "potato/banana",
    "potato/banana/yo.txt",
    "potato/banana/yo.js",
    "potato/eggplant",
    "hi.js",
    "hi.txt",
    "cabana",
    "hi",
    "hi/there.txt",
  ]
);

testGlob(
  "glob targeting specific filetypes",
  globDir,
  ["**/*.txt"],
  ["potato/banana/yo.txt", "hi.txt", "hi/there.txt"]
);

testGlob(
  "glob targeting specific filetypes 2",
  globDir,
  ["**/*.js"],
  ["hi.something.js", "potato/banana/yo.js", "hi.js"]
);

testGlob(
  "glob targeting multiple filetypes using brace expansion",
  globDir,
  ["**/*.{js,txt}"],
  [
    "hi.something.js",
    "potato/banana/yo.txt",
    "potato/banana/yo.js",
    "hi.js",
    "hi.txt",
    "hi/there.txt",
  ]
);

testGlob(
  "starglob with ignore",
  globDir,
  ["**/*", "!**/*.js"],
  [
    "potato",
    "potato/banana",
    "potato/banana/yo.txt",
    "potato/eggplant",
    "hi.txt",
    "cabana",
    "hi",
    "hi/there.txt",
  ]
);

testGlob(
  "two patterns (behaves like AND)",
  globDir,
  ["**/*.js", "**/hi*"],
  [
    "hi.something.js",
    "hi.js",
    // Note that hi.txt is not present even though it matches the second pattern
  ]
);

testGlob(
  "brace expansion with ignore",
  globDir,
  ["**/{hi,yo}*", "!**/*.js"],
  [
    "potato/banana/yo.txt",
    "hi.txt",
    // should "hi" be here? I guess so
    "hi",
  ]
);

test("error reading dead link does not stop search", async () => {
  const result = await evaluate(
    `glob(${JSON.stringify(symlinksDir)}, ["**/*"], { followSymlinks: true })`
  );

  const expected = [
    "some-folder",
    "link-to-file",
    "link-to-folder",
    "some-file",
  ];

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: `glob encountered error: No such file or directory (errno = 2, path = ${
      symlinksDir + "/dead-link"
    })\n`,
    stdout:
      inspect(expected.map((filename) => path.join(symlinksDir, filename))) +
      "\n",
  });
});

testGlob(
  "doesn't read symlinks if you don't pass followSymlinks: true",
  symlinksDir,
  ["**/*"],
  ["some-folder", "link-to-file", "link-to-folder", "dead-link", "some-file"]
);

testGlob(
  "you have to specify leading dot to get stuff starting with a dot",
  symlinksDir,
  ["**/.*"],
  ["some-folder/.gitkeep"]
);

testGlob(
  "using brace expansion to get both stuff with and without a leading dot",
  symlinksDir,
  ["**/{.,}*"],
  [
    "some-folder",
    "some-folder/.gitkeep",
    "link-to-file",
    "link-to-folder",
    "dead-link",
    "some-file",
  ]
);
