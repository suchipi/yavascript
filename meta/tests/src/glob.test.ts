import { afterAll, beforeEach, expect, test } from "vitest";
import fs from "fs";
import path from "path";
import {
  evaluate,
  evaluateWithTimeout,
  rootDir,
  EvaluateResult,
  HANG_TIMEOUT,
} from "./test-helpers";

/**
 * vitest's own per-test timeout has to be comfortably above HANG_TIMEOUT, or
 * it fires first and the test reports a timeout instead of the real failure.
 */
const HANG_TEST_TIMEOUT = HANG_TIMEOUT * 4;

const globDir = rootDir("meta/tests/fixtures/glob");
const symlinksDir = rootDir("meta/tests/fixtures/symlinks");

const scratchDir = rootDir.concat("meta/tests/fixtures/glob-scratch");
const scratch = (...parts: Array<string>) => scratchDir(...parts);
const scratchPath = (relative: string) =>
  `<rootDir>/meta/tests/fixtures/glob-scratch/${relative}`;

const makeDirsTraversable = (dir: string) => {
  let entries: Array<fs.Dirent>;
  try {
    fs.chmodSync(dir, 0o755);
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      makeDirsTraversable(path.join(dir, entry.name));
    }
  }
};

const cleanScratch = () => {
  for (const child of fs.readdirSync(scratchDir())) {
    if (child.startsWith(".")) continue;
    const target = scratchDir(child);
    if (fs.lstatSync(target).isDirectory()) makeDirsTraversable(target);
    fs.rmSync(target, { recursive: true, force: true });
  }
};

beforeEach(cleanScratch);
afterAll(cleanScratch);

const write = (relative: string, content = "") => {
  const target = scratch(relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
};

function globCode(
  patterns: string | Array<string>,
  options: Record<string, any> = {},
) {
  return `JSON.stringify(glob(${JSON.stringify(patterns)}, Object.assign(${JSON.stringify(
    options,
  )}, { logging: { info() {} } })).map(String))`;
}

function compareResult(result: EvaluateResult, expected: Array<string>) {
  const res = JSON.parse(result.stdout);
  expect([...res].sort()).toEqual([...expected.sort()]);
}

function testGlob(
  name: string,
  dir: string | undefined,
  patterns: Array<string> | string,
  expected: Array<string>,
  testFn?: (descr: string, body: () => any) => any,
) {
  // So you can do test.only, etc
  if (!testFn) testFn = test;

  testFn(name, async () => {
    const args: Array<any> = [patterns];
    if (dir) {
      args.push({ dir });
    }

    const result = await evaluate(
      `
        const args = ${JSON.stringify(args)};
        const paths = glob(...args);
        JSON.stringify(paths.map(path => path.toString()))
      `,
    );

    expect(result).toMatchObject({
      code: 0,
      error: null,
    });

    compareResult(result, expected);
  });
}

testGlob(
  "simple glob",
  globDir,
  ["*"],
  [
    "<rootDir>/meta/tests/fixtures/glob/hi.something.js",
    "<rootDir>/meta/tests/fixtures/glob/potato",
    "<rootDir>/meta/tests/fixtures/glob/hi.js",
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/cabana",
    "<rootDir>/meta/tests/fixtures/glob/hi",
  ],
);

testGlob("single glob", globDir, "*", [
  "<rootDir>/meta/tests/fixtures/glob/hi.something.js",
  "<rootDir>/meta/tests/fixtures/glob/potato",
  "<rootDir>/meta/tests/fixtures/glob/hi.js",
  "<rootDir>/meta/tests/fixtures/glob/hi.txt",
  "<rootDir>/meta/tests/fixtures/glob/cabana",
  "<rootDir>/meta/tests/fixtures/glob/hi",
]);

testGlob(
  "simple starglob",
  globDir,
  ["**/*"],
  [
    "<rootDir>/meta/tests/fixtures/glob/hi.something.js",
    "<rootDir>/meta/tests/fixtures/glob/potato",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.js",
    "<rootDir>/meta/tests/fixtures/glob/potato/eggplant",
    "<rootDir>/meta/tests/fixtures/glob/hi.js",
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/cabana",
    "<rootDir>/meta/tests/fixtures/glob/hi",
    "<rootDir>/meta/tests/fixtures/glob/hi/there.txt",
  ],
);

testGlob(
  "glob targeting specific filetypes",
  globDir,
  ["**/*.txt"],
  [
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi/there.txt",
  ],
);

testGlob(
  "absolute path in glob",
  globDir,
  [globDir + "/**/*.txt"],
  [
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi/there.txt",
  ],
);

testGlob(
  "absolute path in glob (dir inferred)",
  undefined,
  [globDir + "/**/*.txt"],
  [
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi/there.txt",
  ],
);

testGlob(
  "glob targeting specific filetypes 2",
  globDir,
  ["**/*.js"],
  [
    "<rootDir>/meta/tests/fixtures/glob/hi.something.js",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.js",
    "<rootDir>/meta/tests/fixtures/glob/hi.js",
  ],
);

testGlob(
  "glob targeting multiple filetypes using brace expansion",
  globDir,
  ["**/*.{js,txt}"],
  [
    "<rootDir>/meta/tests/fixtures/glob/hi.something.js",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.js",
    "<rootDir>/meta/tests/fixtures/glob/hi.js",
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi/there.txt",
  ],
);

testGlob(
  "starglob with ignore",
  globDir,
  ["**/*", "!**/*.js"],
  [
    "<rootDir>/meta/tests/fixtures/glob/potato",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/potato/eggplant",
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/cabana",
    "<rootDir>/meta/tests/fixtures/glob/hi",
    "<rootDir>/meta/tests/fixtures/glob/hi/there.txt",
  ],
);

testGlob(
  "two patterns (behaves like AND)",
  globDir,
  ["**/*.js", "**/hi*"],
  [
    "<rootDir>/meta/tests/fixtures/glob/hi.something.js",
    "<rootDir>/meta/tests/fixtures/glob/hi.js",
    // Note that hi.txt is not present even though it matches the second pattern
  ],
);

testGlob(
  "brace expansion with ignore",
  globDir,
  ["**/{hi,yo}*", "!**/*.js"],
  [
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi",
  ],
);

test("error reading dead link does not stop search", async () => {
  const result = await evaluate(
    `JSON.stringify(glob(["**/*"], {
      followSymlinks: true,
      dir: ${JSON.stringify(symlinksDir)}
    }))`,
  );

  const expected = [
    "<rootDir>/meta/tests/fixtures/symlinks/some-folder",
    "<rootDir>/meta/tests/fixtures/symlinks/link-to-file",
    "<rootDir>/meta/tests/fixtures/symlinks/link-to-folder",
    "<rootDir>/meta/tests/fixtures/symlinks/some-file",
  ];

  const resWithoutStdout = {
    ...result,
    stdout: "",
  };
  expect(resWithoutStdout).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "glob: expanding ["**/*"]
   glob encountered error: No such file or directory (errno = 2, path = <rootDir>/meta/tests/fixtures/symlinks/dead-link, linkpath = ./nowhere-real)
   ",
     "stdout": "",
   }
  `);

  compareResult(result, expected);
});

testGlob(
  "doesn't read symlinks if you don't pass followSymlinks: true",
  symlinksDir,
  ["**/*"],
  [
    "<rootDir>/meta/tests/fixtures/symlinks/some-folder",
    "<rootDir>/meta/tests/fixtures/symlinks/link-to-file",
    "<rootDir>/meta/tests/fixtures/symlinks/link-to-folder",
    "<rootDir>/meta/tests/fixtures/symlinks/dead-link",
    "<rootDir>/meta/tests/fixtures/symlinks/some-file",
  ],
);

testGlob(
  "you have to specify leading dot to get stuff starting with a dot",
  symlinksDir,
  ["**/.*"],
  ["<rootDir>/meta/tests/fixtures/symlinks/some-folder/.gitkeep"],
);

testGlob(
  "using brace expansion to get both stuff with and without a leading dot",
  symlinksDir,
  ["**/{.,}*"],
  [
    "<rootDir>/meta/tests/fixtures/symlinks/some-folder",
    "<rootDir>/meta/tests/fixtures/symlinks/some-folder/.gitkeep",
    "<rootDir>/meta/tests/fixtures/symlinks/link-to-file",
    "<rootDir>/meta/tests/fixtures/symlinks/link-to-folder",
    "<rootDir>/meta/tests/fixtures/symlinks/dead-link",
    "<rootDir>/meta/tests/fixtures/symlinks/some-file",
  ],
);

test("using trace", async () => {
  const result = await evaluate(
    `JSON.stringify(glob(["**/*.txt", "!**/potato/**"], {
      logging: {
        trace: console.error,
      },
      dir: ${JSON.stringify(globDir)}
    }))`,
  );

  const expectedResult = [
    "<rootDir>/meta/tests/fixtures/glob/hi.txt",
    "<rootDir>/meta/tests/fixtures/glob/hi/there.txt",
  ];

  expect(result).toMatchObject({
    code: 0,
    error: null,
  });

  compareResult(result, expectedResult);

  // message order varies with OS
  const traceMessages = result.stderr.split("\n").sort().join("\n");
  expect(traceMessages).toMatchInlineSnapshot(`
    "
    checking <rootDir>/meta/tests/fixtures/glob/cabana
    checking <rootDir>/meta/tests/fixtures/glob/cabana/.gitkeep
    checking <rootDir>/meta/tests/fixtures/glob/hi
    checking <rootDir>/meta/tests/fixtures/glob/hi.js
    checking <rootDir>/meta/tests/fixtures/glob/hi.something.js
    checking <rootDir>/meta/tests/fixtures/glob/hi.txt
    checking <rootDir>/meta/tests/fixtures/glob/hi/.yeah
    checking <rootDir>/meta/tests/fixtures/glob/hi/there.txt
    checking <rootDir>/meta/tests/fixtures/glob/potato
    checking <rootDir>/meta/tests/fixtures/glob/potato/banana
    checking <rootDir>/meta/tests/fixtures/glob/potato/eggplant
    found 3 children of <rootDir>/meta/tests/fixtures/glob/cabana
    found 4 children of <rootDir>/meta/tests/fixtures/glob/hi
    found 4 children of <rootDir>/meta/tests/fixtures/glob/potato
    found 8 children of <rootDir>/meta/tests/fixtures/glob
    glob: expanding ["**/*.txt","!**/potato/**"]
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/cabana"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/cabana/.gitkeep"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/hi"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/hi.js"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/hi.something.js"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/hi/.yeah"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/potato"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/potato/banana"}
    match info: {"didMatch":false,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/potato/eggplant"}
    match info: {"didMatch":true,"pattern":"!**/potato/**","negated":true,"fullName":"<rootDir>/meta/tests/fixtures/glob/hi.txt"}
    match info: {"didMatch":true,"pattern":"!**/potato/**","negated":true,"fullName":"<rootDir>/meta/tests/fixtures/glob/hi/there.txt"}
    match info: {"didMatch":true,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/hi.txt"}
    match info: {"didMatch":true,"pattern":"**/*.txt","negated":false,"fullName":"<rootDir>/meta/tests/fixtures/glob/hi/there.txt"}
    not traversing deeper into dir as it matches a negated pattern: {"dir":"<rootDir>/meta/tests/fixtures/glob/potato/banana","pattern":"!**/potato/**"}
    reading children of <rootDir>/meta/tests/fixtures/glob
    reading children of <rootDir>/meta/tests/fixtures/glob/cabana
    reading children of <rootDir>/meta/tests/fixtures/glob/hi
    reading children of <rootDir>/meta/tests/fixtures/glob/potato"
  `);
});

test("leading single-asterisk pattern doesn't traverse deeper than the pattern can match", async () => {
  const result = await evaluate(
    `JSON.stringify(glob("*/*.txt", {
      logging: {
        trace: (...args) => {
          const message = args.join(" ");
          if (message.startsWith("reading children of ")) {
            console.error(message);
          }
        },
      },
      dir: ${JSON.stringify(globDir)}
    }))`,
  );

  expect(result).toMatchObject({
    code: 0,
    error: null,
  });

  compareResult(result, ["<rootDir>/meta/tests/fixtures/glob/hi/there.txt"]);

  // message order varies with OS
  const traceMessages = result.stderr.split("\n").sort().join("\n");
  expect(traceMessages).toMatchInlineSnapshot(`
    "
    glob: expanding ["*/*.txt"]
    reading children of <rootDir>/meta/tests/fixtures/glob
    reading children of <rootDir>/meta/tests/fixtures/glob/cabana
    reading children of <rootDir>/meta/tests/fixtures/glob/hi
    reading children of <rootDir>/meta/tests/fixtures/glob/potato"
  `);
});

testGlob(
  "trailing globstar alongside another globstar",
  globDir,
  ["**/potato/**"],
  [
    "<rootDir>/meta/tests/fixtures/glob/potato/banana",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.js",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/potato/eggplant",
  ],
);

testGlob(
  "trailing globstar doesn't match the dir it hangs off of",
  globDir,
  ["potato/**"],
  [
    "<rootDir>/meta/tests/fixtures/glob/potato/banana",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.js",
    "<rootDir>/meta/tests/fixtures/glob/potato/banana/yo.txt",
    "<rootDir>/meta/tests/fixtures/glob/potato/eggplant",
  ],
);

test("globbing from the filesystem root accepts a leading slash", async () => {
  const result = await evaluate(
    `JSON.stringify(glob("/us*", { dir: "/" }).map(path => path.toString()))`,
  );

  expect(result).toMatchObject({ code: 0, error: null });
  expect(JSON.parse(result.stdout)).toEqual(["/usr"]);
});

test("a caught readdir error leaves the exit status alone", async () => {
  write("not-a-dir.txt", "hi");

  const result = await evaluate(
    `try { ${globCode("*", { dir: scratch("not-a-dir.txt") })} } catch (err) { console.log("caught") }`,
  );
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  expect(result.stdout).toBe("caught\n");
});

test("an unreadable subdirectory leaves the exit status alone", async () => {
  write("tree/readable/a.txt");
  fs.mkdirSync(scratch("tree/noperm"), { recursive: true });
  fs.chmodSync(scratch("tree/noperm"), 0o000);

  try {
    const result = await evaluate(
      // glob reports the unreadable dir through console.warn, which its
      // logging options can't redirect.
      `console.warn = () => {}; ${globCode("**", { dir: scratch("tree") })}`,
    );
    expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  } finally {
    fs.chmodSync(scratch("tree/noperm"), 0o755);
  }
});

test("relative patterns work when 'dir' contains glob metacharacters", async () => {
  write("weird[1]/w.js");

  const result = await evaluate(globCode("*", { dir: scratch("weird[1]") }));
  expect(result).toMatchObject({ code: 0, error: null });
  compareResult(result, [scratchPath("weird[1]/w.js")]);
});

test("relative patterns work when the cwd contains glob metacharacters", async () => {
  write("weird[1]/w.js");

  const result = await evaluate(globCode("*"), { cwd: scratch("weird[1]") });
  expect(result).toMatchObject({ code: 0, error: null });
  compareResult(result, [scratchPath("weird[1]/w.js")]);
});

test("an absolute pattern naming one existing file matches that file", async () => {
  write("solo.txt");

  const result = await evaluate(globCode(scratch("solo.txt")));
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  compareResult(result, [scratchPath("solo.txt")]);
});

test("an absolute pattern with '?' in a directory segment matches", async () => {
  write("abc/z.js");

  const result = await evaluate(globCode(scratch("ab?/*.js")));
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  compareResult(result, [scratchPath("abc/z.js")]);
});

test("an absolute pattern with a character class in a directory segment matches", async () => {
  write("abc/z.js");

  const result = await evaluate(globCode(scratch("[a]bc/*.js")));
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  compareResult(result, [scratchPath("abc/z.js")]);
});

test(
  "an empty pattern list matches nothing",
  async () => {
    write("tree/one.js");
    write("tree/sub/two.js");

    const result = await evaluateWithTimeout(
      globCode([], { dir: scratch("tree") }),
    );
    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({ code: 0, error: null });
    compareResult(result, []);
  },
  HANG_TEST_TIMEOUT,
);

test("a pattern starting with '../' matches in the parent directory", async () => {
  write("parent/one.js");
  write("parent/two.js");
  write("parent/child/three.js");

  const result = await evaluate(
    globCode("../*.js", { dir: scratch("parent/child") }),
  );
  expect(result).toMatchObject({ code: 0, error: null });
  compareResult(result, [
    scratchPath("parent/one.js"),
    scratchPath("parent/two.js"),
  ]);
});

test("a backslash escapes a glob metacharacter in a pattern", async () => {
  write("weird[1]/w.js");
  write("weird1/decoy.js");

  const result = await evaluate(
    globCode("weird\\[1\\]/*", { dir: scratchDir() }),
  );
  expect(result).toMatchObject({ code: 0, error: null });
  compareResult(result, [scratchPath("weird[1]/w.js")]);
});

test("a backslash is not a path separator", async () => {
  write("a*.js");
  write("a/one.js");

  const result = await evaluate(globCode("a\\*.js", { dir: scratchDir() }));
  expect(result).toMatchObject({ code: 0, error: null });
  compareResult(result, [scratchPath("a*.js")]);
});

test("a leading extglob '!(...)' excludes what it names", async () => {
  write("x/one.js");
  write("x/two.ts");

  const result = await evaluate(globCode("!(*.js)", { dir: scratch("x") }));
  expect(result).toMatchObject({ code: 0, error: null });
  compareResult(result, [scratchPath("x/two.ts")]);
});

test("a trailing slash matches only directories", async () => {
  write("y/f.txt");
  write("y/d/inner.txt");

  const result = await evaluate(globCode("*/", { dir: scratch("y") }));
  expect(result).toMatchObject({ code: 0, error: null });
  const found: Array<string> = JSON.parse(result.stdout).map((entry: string) =>
    entry.replace(/\/$/, ""),
  );
  expect(found.sort()).toEqual([scratchPath("y/d")]);
});

test(
  "followSymlinks doesn't walk a symlink cycle",
  async () => {
    write("cycle/f.txt");
    fs.symlinkSync(".", scratch("cycle/self"));

    const result = await evaluateWithTimeout(
      globCode("**", { dir: scratch("cycle"), followSymlinks: true }),
    );
    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({ code: 0, error: null });

    const revisited = JSON.parse(result.stdout).filter(
      (entry: string) =>
        entry.split("/").filter((segment) => segment === "self").length > 1,
    );
    expect(revisited).toEqual([]);
  },
  HANG_TEST_TIMEOUT,
);
