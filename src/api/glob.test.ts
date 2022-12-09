import {
  evaluate,
  cleanResult,
  rootDir,
  EvaluateResult,
} from "../test-helpers";

const globDir = rootDir("src/api/test_fixtures/glob");
const symlinksDir = rootDir("src/api/test_fixtures/symlinks");

function compareResult(result: EvaluateResult, expected: Array<string>) {
  const res = JSON.parse(result.stdout);
  expect([...res].sort()).toEqual([...expected.sort()]);
}

function testGlob(
  name: string,
  dir: string,
  patterns: Array<string> | string,
  expected: Array<string>,
  testFn?: (descr: string, body: () => any) => any
) {
  // So you can do test.only, etc
  if (!testFn) testFn = test;

  testFn(name, async () => {
    const args: Array<any> = [patterns, { dir }];

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
    "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
    "<rootDir>/src/api/test_fixtures/glob/potato",
    "<rootDir>/src/api/test_fixtures/glob/hi.js",
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/cabana",
    "<rootDir>/src/api/test_fixtures/glob/hi",
  ]
);

testGlob("single glob", globDir, "*", [
  "<rootDir>/src/api/test_fixtures/glob/hi.something.js",
  "<rootDir>/src/api/test_fixtures/glob/potato",
  "<rootDir>/src/api/test_fixtures/glob/hi.js",
  "<rootDir>/src/api/test_fixtures/glob/hi.txt",
  "<rootDir>/src/api/test_fixtures/glob/cabana",
  "<rootDir>/src/api/test_fixtures/glob/hi",
]);

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
    `JSON.stringify(glob(["**/*"], {
      followSymlinks: true,
      dir: ${JSON.stringify(symlinksDir)}
    }))`
  );

  const expected = [
    "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
    "<rootDir>/src/api/test_fixtures/symlinks/link-to-file",
    "<rootDir>/src/api/test_fixtures/symlinks/link-to-folder",
    "<rootDir>/src/api/test_fixtures/symlinks/some-file",
  ];

  const cleaned = cleanResult(result);

  expect(cleaned).toMatchObject({
    code: 0,
    error: false,
    stderr: `glob encountered error: No such file or directory (errno = 2, path = <rootDir>/src/api/test_fixtures/symlinks/dead-link, linkpath = ./nowhere-real)\n`,
  });

  compareResult(cleaned, expected);
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
    `JSON.stringify(glob(["**/*.txt", "!**/potato/**"], {
      trace: console.error,
      dir: ${JSON.stringify(globDir)}
    }))`
  );

  const expectedResult = [
    "<rootDir>/src/api/test_fixtures/glob/hi.txt",
    "<rootDir>/src/api/test_fixtures/glob/hi/there.txt",
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
  expect(traceMessages).toMatchSnapshot();
});
