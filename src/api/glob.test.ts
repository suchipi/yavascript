import {
  evaluate,
  cleanResult,
  rootDir,
  EvaluateResult,
} from "../test-helpers";

const globDir = rootDir("src/test_fixtures/glob");
const symlinksDir = rootDir("src/test_fixtures/symlinks");

function compareResult(result: EvaluateResult, expected: Array<string>) {
  const res = JSON.parse(result.stdout);
  expect([...res].sort()).toEqual([...expected.sort()]);
}

function testGlob(
  name: string,
  dir: string | undefined,
  patterns: Array<string> | string,
  expected: Array<string>,
  testFn?: (descr: string, body: () => any) => any
) {
  // So you can do test.only, etc
  if (!testFn) testFn = test;

  testFn(name, async () => {
    const args: Array<any> = [patterns];
    if (dir) {
      args.push({ dir });
    }

    const result = await evaluate(
      `JSON.stringify(glob(${args
        .map((arg) => JSON.stringify(arg))
        .join(", ")}))`
    );

    expect(result).toMatchObject({
      code: 0,
      error: false,
      stderr: "",
    });

    const cleaned = cleanResult(result);
    compareResult(cleaned, expected);
  });
}

testGlob(
  "simple glob",
  globDir,
  ["*"],
  [
    "<rootDir>/src/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/test_fixtures/glob/potato",
    "<rootDir>/src/test_fixtures/glob/hi.js",
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/cabana",
    "<rootDir>/src/test_fixtures/glob/hi",
  ]
);

testGlob("single glob", globDir, "*", [
  "<rootDir>/src/test_fixtures/glob/hi.something.js",
  "<rootDir>/src/test_fixtures/glob/potato",
  "<rootDir>/src/test_fixtures/glob/hi.js",
  "<rootDir>/src/test_fixtures/glob/hi.txt",
  "<rootDir>/src/test_fixtures/glob/cabana",
  "<rootDir>/src/test_fixtures/glob/hi",
]);

testGlob(
  "simple starglob",
  globDir,
  ["**/*"],
  [
    "<rootDir>/src/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/test_fixtures/glob/potato",
    "<rootDir>/src/test_fixtures/glob/potato/banana",
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.js",
    "<rootDir>/src/test_fixtures/glob/potato/eggplant",
    "<rootDir>/src/test_fixtures/glob/hi.js",
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/cabana",
    "<rootDir>/src/test_fixtures/glob/hi",
    "<rootDir>/src/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "glob targeting specific filetypes",
  globDir,
  ["**/*.txt"],
  [
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "absolute path in glob",
  globDir,
  [globDir + "/**/*.txt"],
  [
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "absolute path in glob (dir inferred)",
  undefined,
  [globDir + "/**/*.txt"],
  [
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "glob targeting specific filetypes 2",
  globDir,
  ["**/*.js"],
  [
    "<rootDir>/src/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.js",
    "<rootDir>/src/test_fixtures/glob/hi.js",
  ]
);

testGlob(
  "glob targeting multiple filetypes using brace expansion",
  globDir,
  ["**/*.{js,txt}"],
  [
    "<rootDir>/src/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.js",
    "<rootDir>/src/test_fixtures/glob/hi.js",
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "starglob with ignore",
  globDir,
  ["**/*", "!**/*.js"],
  [
    "<rootDir>/src/test_fixtures/glob/potato",
    "<rootDir>/src/test_fixtures/glob/potato/banana",
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/test_fixtures/glob/potato/eggplant",
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/cabana",
    "<rootDir>/src/test_fixtures/glob/hi",
    "<rootDir>/src/test_fixtures/glob/hi/there.txt",
  ]
);

testGlob(
  "two patterns (behaves like AND)",
  globDir,
  ["**/*.js", "**/hi*"],
  [
    "<rootDir>/src/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/test_fixtures/glob/hi.js",
    // Note that hi.txt is not present even though it matches the second pattern
  ]
);

testGlob(
  "brace expansion with ignore",
  globDir,
  ["**/{hi,yo}*", "!**/*.js"],
  [
    "<rootDir>/src/test_fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/hi",
  ]
);

test("error reading dead link does not stop search", async () => {
  const result = await evaluate(
    `JSON.stringify(glob(["**/*"], {
      followSymlinks: true,
      dir: ${JSON.stringify(symlinksDir)}
    }))`
  );

  const expected = [
    "<rootDir>/src/test_fixtures/symlinks/some-folder",
    "<rootDir>/src/test_fixtures/symlinks/link-to-file",
    "<rootDir>/src/test_fixtures/symlinks/link-to-folder",
    "<rootDir>/src/test_fixtures/symlinks/some-file",
  ];

  const cleaned = cleanResult(result);

  expect(cleaned).toMatchObject({
    code: 0,
    error: false,
    stderr: `glob encountered error: No such file or directory (errno = 2, path = <rootDir>/src/test_fixtures/symlinks/dead-link, linkpath = ./nowhere-real)\n`,
  });

  compareResult(cleaned, expected);
});

testGlob(
  "doesn't read symlinks if you don't pass followSymlinks: true",
  symlinksDir,
  ["**/*"],
  [
    "<rootDir>/src/test_fixtures/symlinks/some-folder",
    "<rootDir>/src/test_fixtures/symlinks/link-to-file",
    "<rootDir>/src/test_fixtures/symlinks/link-to-folder",
    "<rootDir>/src/test_fixtures/symlinks/dead-link",
    "<rootDir>/src/test_fixtures/symlinks/some-file",
  ]
);

testGlob(
  "you have to specify leading dot to get stuff starting with a dot",
  symlinksDir,
  ["**/.*"],
  ["<rootDir>/src/test_fixtures/symlinks/some-folder/.gitkeep"]
);

testGlob(
  "using brace expansion to get both stuff with and without a leading dot",
  symlinksDir,
  ["**/{.,}*"],
  [
    "<rootDir>/src/test_fixtures/symlinks/some-folder",
    "<rootDir>/src/test_fixtures/symlinks/some-folder/.gitkeep",
    "<rootDir>/src/test_fixtures/symlinks/link-to-file",
    "<rootDir>/src/test_fixtures/symlinks/link-to-folder",
    "<rootDir>/src/test_fixtures/symlinks/dead-link",
    "<rootDir>/src/test_fixtures/symlinks/some-file",
  ]
);

test("using trace", async () => {
  const result = await evaluate(
    `JSON.stringify(glob(["**/*.txt", "!**/potato/**"], {
      trace: console.error,
      dir: ${JSON.stringify(globDir)}
    }))`
  );

  const expectedResult = [
    "<rootDir>/src/test_fixtures/glob/hi.txt",
    "<rootDir>/src/test_fixtures/glob/hi/there.txt",
  ];

  // for when you need to update the trace output
  // console.log(
  //   cleanResult(result)
  //     .stderr.split("\n")
  //     .map((line) => "`" + line + "`,")
  //     .join("\n")
  // );

  const cleaned = cleanResult(result);
  expect(cleaned).toMatchObject({
    code: 0,
    error: false,
  });

  compareResult(cleaned, expectedResult);

  // message order varies with OS
  const traceMessages = cleaned.stderr.split("\n").sort().join("\n");
  expect(traceMessages).toMatchInlineSnapshot(`
    "
    checking <rootDir>/src/test_fixtures/glob/cabana
    checking <rootDir>/src/test_fixtures/glob/cabana/.gitkeep
    checking <rootDir>/src/test_fixtures/glob/hi
    checking <rootDir>/src/test_fixtures/glob/hi.js
    checking <rootDir>/src/test_fixtures/glob/hi.something.js
    checking <rootDir>/src/test_fixtures/glob/hi.txt
    checking <rootDir>/src/test_fixtures/glob/hi/.yeah
    checking <rootDir>/src/test_fixtures/glob/hi/there.txt
    checking <rootDir>/src/test_fixtures/glob/potato
    found 3 children of <rootDir>/src/test_fixtures/glob/cabana
    found 4 children of <rootDir>/src/test_fixtures/glob/hi
    found 8 children of <rootDir>/src/test_fixtures/glob
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/cabana"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/cabana/.gitkeep"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/hi"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/hi.js"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/hi.something.js"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/hi/.yeah"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/potato"}
    match info: {"didMatch":true,"pattern":"!**/potato/**","negated":true,"fullName":"<rootDir>/src/test_fixtures/glob/hi.txt"}
    match info: {"didMatch":true,"pattern":"!**/potato/**","negated":true,"fullName":"<rootDir>/src/test_fixtures/glob/hi/there.txt"}
    match info: {"didMatch":true,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/hi.txt"}
    match info: {"didMatch":true,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/src/test_fixtures/glob/hi/there.txt"}
    not traversing deeper into dir as it matches a negated pattern: {"dir":"<rootDir>/src/test_fixtures/glob/potato","pattern":"!**/potato/**"}
    reading children of <rootDir>/src/test_fixtures/glob
    reading children of <rootDir>/src/test_fixtures/glob/cabana
    reading children of <rootDir>/src/test_fixtures/glob/hi"
  `);
});
