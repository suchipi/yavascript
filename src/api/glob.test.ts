///<reference types="@test-it/core/globals" />
import { evaluate, inspect, cleanResult, rootDir } from "../test-helpers";

const globDir = rootDir("src/api/test_fixtures/glob");
const symlinksDir = rootDir("src/api/test_fixtures/symlinks");

function testGlob(
  name: string,
  dir: string,
  patterns: Array<string>,
  expected: Array<string>,
  testFn?: (descr: string, body: () => any) => any
) {
  // So you can do test.only, etc
  if (!testFn) testFn = test;

  testFn(name, async () => {
    const args: Array<any> = [dir, patterns];

    const result = await evaluate(
      `glob(${args.map((arg) => JSON.stringify(arg)).join(", ")})`
    );

    expect(cleanResult(result)).toEqual({
      code: 0,
      error: false,
      stderr: "",
      stdout: inspect(expected) + "\n",
    });
  });
}

testGlob(
  "simple glob",
  globDir,
  ["*"],
  [
    "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/api/test_fixtures/glob/potato",
    "<rootDir>/src/api/test_fixtures/glob/hi.js",
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/cabana",
    "<rootDir>/src/api/test_fixtures/glob/hi",
  ]
);

testGlob(
  "simple starglob",
  globDir,
  ["**/*"],
  [
    "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/api/test_fixtures/glob/potato",
    "<rootDir>/src/api/test_fixtures/glob/potato/banana",
    "<rootDir>/src/api/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/api/test_fixtures/glob/potato/banana/yo.js",
    "<rootDir>/src/api/test_fixtures/glob/potato/eggplant",
    "<rootDir>/src/api/test_fixtures/glob/hi.js",
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/cabana",
    "<rootDir>/src/api/test_fixtures/glob/hi",
    "<rootDir>/src/api/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "glob targeting specific filetypes",
  globDir,
  ["**/*.txt"],
  [
    "<rootDir>/src/api/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "glob targeting specific filetypes 2",
  globDir,
  ["**/*.js"],
  [
    "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/api/test_fixtures/glob/potato/banana/yo.js",
    "<rootDir>/src/api/test_fixtures/glob/hi.js",
  ]
);

testGlob(
  "glob targeting multiple filetypes using brace expansion",
  globDir,
  ["**/*.{js,txt}"],
  [
    "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/api/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/api/test_fixtures/glob/potato/banana/yo.js",
    "<rootDir>/src/api/test_fixtures/glob/hi.js",
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "starglob with ignore",
  globDir,
  ["**/*", "!**/*.js"],
  [
    "<rootDir>/src/api/test_fixtures/glob/potato",
    "<rootDir>/src/api/test_fixtures/glob/potato/banana",
    "<rootDir>/src/api/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/api/test_fixtures/glob/potato/eggplant",
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/cabana",
    "<rootDir>/src/api/test_fixtures/glob/hi",
    "<rootDir>/src/api/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "two patterns (behaves like AND)",
  globDir,
  ["**/*.js", "**/hi*"],
  [
    "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/api/test_fixtures/glob/hi.js",
    // Note that hi.txt is not present even though it matches the second pattern
  ]
);

testGlob(
  "brace expansion with ignore",
  globDir,
  ["**/{hi,yo}*", "!**/*.js"],
  [
    "<rootDir>/src/api/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/hi",
  ]
);

test("error reading dead link does not stop search", async () => {
  const result = await evaluate(
    `glob(${JSON.stringify(symlinksDir)}, ["**/*"], { followSymlinks: true })`
  );

  const expected = [
    "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
    "<rootDir>/src/api/test_fixtures/symlinks/link-to-file",
    "<rootDir>/src/api/test_fixtures/symlinks/link-to-folder",
    "<rootDir>/src/api/test_fixtures/symlinks/some-file",
  ];

  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: `glob encountered error: No such file or directory (errno = 2, path = <rootDir>/src/api/test_fixtures/symlinks/dead-link, linkpath = ./nowhere-real)\n`,
    stdout: inspect(expected) + "\n",
  });
});

testGlob(
  "doesn't read symlinks if you don't pass followSymlinks: true",
  symlinksDir,
  ["**/*"],
  [
    "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
    "<rootDir>/src/api/test_fixtures/symlinks/link-to-file",
    "<rootDir>/src/api/test_fixtures/symlinks/link-to-folder",
    "<rootDir>/src/api/test_fixtures/symlinks/dead-link",
    "<rootDir>/src/api/test_fixtures/symlinks/some-file",
  ]
);

testGlob(
  "you have to specify leading dot to get stuff starting with a dot",
  symlinksDir,
  ["**/.*"],
  ["<rootDir>/src/api/test_fixtures/symlinks/some-folder/.gitkeep"]
);

testGlob(
  "using brace expansion to get both stuff with and without a leading dot",
  symlinksDir,
  ["**/{.,}*"],
  [
    "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
    "<rootDir>/src/api/test_fixtures/symlinks/some-folder/.gitkeep",
    "<rootDir>/src/api/test_fixtures/symlinks/link-to-file",
    "<rootDir>/src/api/test_fixtures/symlinks/link-to-folder",
    "<rootDir>/src/api/test_fixtures/symlinks/dead-link",
    "<rootDir>/src/api/test_fixtures/symlinks/some-file",
  ]
);

test("using trace", async () => {
  const result = await evaluate(
    `glob(${JSON.stringify(
      globDir
    )}, ["**/*.txt", "!**/potato/**"], { trace: console.error })`
  );

  const expectedTraceMessages = [
    `reading children of <rootDir>/src/api/test_fixtures/glob`,
    `found 8 children of <rootDir>/src/api/test_fixtures/glob`,
    `checking <rootDir>/src/api/test_fixtures/glob/hi.something.js`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/hi.something.js"}`,
    `checking <rootDir>/src/api/test_fixtures/glob/potato`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/potato"}`,
    `reading children of <rootDir>/src/api/test_fixtures/glob/potato`,
    `found 4 children of <rootDir>/src/api/test_fixtures/glob/potato`,
    `checking <rootDir>/src/api/test_fixtures/glob/potato/banana`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/potato/banana"}`,
    `not traversing deeper into dir as it matches a negated pattern: <rootDir>/src/api/test_fixtures/glob/potato/banana`,
    `checking <rootDir>/src/api/test_fixtures/glob/potato/eggplant`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/potato/eggplant"}`,
    `checking <rootDir>/src/api/test_fixtures/glob/hi.js`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/hi.js"}`,
    `checking <rootDir>/src/api/test_fixtures/glob/hi.txt`,
    `match info: {"didMatch":true,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/hi.txt"}`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/potato/**","negated":true,"fullName":"<rootDir>/src/api/test_fixtures/glob/hi.txt"}`,
    `checking <rootDir>/src/api/test_fixtures/glob/cabana`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/cabana"}`,
    `reading children of <rootDir>/src/api/test_fixtures/glob/cabana`,
    `found 3 children of <rootDir>/src/api/test_fixtures/glob/cabana`,
    `checking <rootDir>/src/api/test_fixtures/glob/cabana/.gitkeep`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/cabana/.gitkeep"}`,
    `checking <rootDir>/src/api/test_fixtures/glob/hi`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/hi"}`,
    `reading children of <rootDir>/src/api/test_fixtures/glob/hi`,
    `found 4 children of <rootDir>/src/api/test_fixtures/glob/hi`,
    `checking <rootDir>/src/api/test_fixtures/glob/hi/there.txt`,
    `match info: {"didMatch":true,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/hi/there.txt"}`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/potato/**","negated":true,"fullName":"<rootDir>/src/api/test_fixtures/glob/hi/there.txt"}`,
    `checking <rootDir>/src/api/test_fixtures/glob/hi/.yeah`,
    `match info: {"didMatch":false,"pattern":"<rootDir>/src/api/test_fixtures/glob/**/*.txt","negated":false,"fullName":"<rootDir>/src/api/test_fixtures/glob/hi/.yeah"}`,
    ``,
  ].join("\n");

  const expectedResult = [
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/hi/there.txt",
  ];

  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: expectedTraceMessages,
    stdout: inspect(expectedResult) + "\n",
  });
});
