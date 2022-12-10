import path from "path";
import { evaluate, cleanResult, inspect, getBinaryPath } from "../test-helpers";
import { spawn } from "first-base";

const rootDir = path.resolve(__dirname, "..", "..");
const symlinkFixturesDir = path.join(rootDir, "src/api/test_fixtures/symlinks");

test("cd and pwd", async () => {
  const script = `
    echo(pwd());
    cd("src");
    echo(pwd());
    cd("..");
    echo(pwd());
    cd("./meta");
    echo(pwd());
    cd("/tmp");
    echo(pwd());
  `;

  const result = await evaluate(script, { cwd: rootDir });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "<rootDir>
    <rootDir>/src
    <rootDir>
    <rootDir>/meta
    /tmp
    ",
    }
  `);
});

test("cd affects working directory of exec", async () => {
  const script = `
    cd("src");
    exec(["sh", "-c", "echo $PWD"]);
  `;

  const result = await evaluate(script, { cwd: rootDir });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "<rootDir>/src
    ",
    }
  `);
});

test("realpath resolution behavior", async () => {
  const script = `
    echo(realpath("/tmp"));

    cd(${JSON.stringify(symlinkFixturesDir)});

    echo(realpath("."));
    echo(realpath(".."));

    echo(realpath("./link-to-folder"));
    echo(realpath("./link-to-file"));
    echo(realpath("./some-folder"));
    echo(realpath("./some-file"));

    echo(realpath("link-to-folder"));
    echo(realpath("link-to-file"));
    echo(realpath("some-folder"));
    echo(realpath("some-file"));

    cd(${JSON.stringify(rootDir)});
    echo(realpath("./src/.."));
  `;

  const result = await evaluate(script, { cwd: rootDir });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "/tmp
    <rootDir>/src/api/test_fixtures/symlinks
    <rootDir>/src/api/test_fixtures
    <rootDir>/src/api/test_fixtures/symlinks/some-folder
    <rootDir>/src/api/test_fixtures/symlinks/some-file
    <rootDir>/src/api/test_fixtures/symlinks/some-folder
    <rootDir>/src/api/test_fixtures/symlinks/some-file
    <rootDir>/src/api/test_fixtures/symlinks/some-folder
    <rootDir>/src/api/test_fixtures/symlinks/some-file
    <rootDir>/src/api/test_fixtures/symlinks/some-folder
    <rootDir>/src/api/test_fixtures/symlinks/some-file
    <rootDir>
    ",
    }
  `);
});

test("realpath against dead link throws error", async () => {
  const result = await evaluate(`realpath("./dead-link")`, {
    cwd: symlinkFixturesDir,
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: No such file or directory (errno = 2, path = ./dead-link)
      at realpath (native)
      at realpath (<rootDir>/bin/.../yavascript)
      at <eval> (<evalScript>) {
      errno: 2
      path: "./dead-link"
    }
    ",
      "stdout": "",
    }
  `);
});

test("realpath against non-existent target throws error", async () => {
  const result = await evaluate(`realpath("./this doesn't exist, bro")`, {
    cwd: rootDir,
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: No such file or directory (errno = 2, path = ./this doesn't exist, bro)
      at realpath (native)
      at realpath (<rootDir>/bin/.../yavascript)
      at <eval> (<evalScript>) {
      errno: 2
      path: "./this doesn't exist, bro"
    }
    ",
      "stdout": "",
    }
  `);
});

test("dirname", async () => {
  const result = await evaluate(`dirname("/hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "/hi/there
    ",
    }
  `);
});

test("dirname (windows-style path)", async () => {
  const result = await evaluate(`dirname("C:\\\\Users\\\\Suchipi")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "C:\\Users
    ",
    }
  `);
});

test("basename", async () => {
  const result = await evaluate(`basename("/hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "yeah
    ",
    }
  `);
});

test("basename (windows-style path)", async () => {
  const result = await evaluate(`basename("C:\\\\Users\\\\Suchipi")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Suchipi
    ",
    }
  `);
});

test("extname", async () => {
  const script = `
    echo(extname("something.js"));
    echo(extname("/tmp/somewhere/something.js"));

    echo(extname("something.test.js"));
    echo(extname("/tmp/somewhere/something.test.js"));

    echo(extname("something.test.js", { full: true }));
    echo(extname("/tmp/somewhere/something.test.js", { full: true }));

    echo(extname("something.test.js", { full: false }));
    echo(extname("/tmp/somewhere/something.test.js", { full: false }));

    echo(extname("Makefile"));
    echo(extname("Makefile", { full: false }));
    echo(extname("Makefile", { full: true }));
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": ".js
    .js
    .js
    .js
    .test.js
    .test.js
    .js
    .js



    ",
    }
  `);
});

test("extname (windows-style path)", async () => {
  const script = `
    echo(extname("E:\\\\somewhere\\\\something.js"));
    echo(extname("E:\\\\somewhere\\\\something.test.js"));
    echo(extname("E:\\\\somewhere\\\\something.test.js", { full: true }));
    echo(extname("E:\\\\somewhere\\\\something.test.js", { full: false }));
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": ".js
    .js
    .test.js
    .js
    ",
    }
  `);
});

// this test will only work on non-windows
test("paths.OS_PATH_SEPARATOR (unix behavior)", async () => {
  const resultNative = await evaluate(`paths.OS_PATH_SEPARATOR`);
  expect(resultNative).toEqual({
    code: 0,
    error: false,
    stdout: "/" + "\n",
    stderr: "",
  });
});

// this test will only work on linux and only if you have wine installed
test("paths.OS_PATH_SEPARATOR (windows behavior, via wine)", async () => {
  const wineRun = spawn("wine", [
    getBinaryPath("win32", process.arch),
    "-e",
    `paths.OS_PATH_SEPARATOR`,
  ]);
  await wineRun.completion;
  if (wineRun.result.error) {
    throw new Error(
      "Failed to run wine (this is expected when running tests on macOS)"
    );
  }
  expect(wineRun.result).toMatchObject({
    code: 0,
    error: false,
    stdout: "\\" + "\r\n",
    // stderr has some garbage in it we don't care about
  });
});

test("paths.split", async () => {
  const script = `
    echo(paths.split("/some/path/some/where"));
    echo(paths.split("/with/trailing/slash/"));
    echo(paths.split("./this/one's/relative"));
    echo(paths.split(".."));
    echo(paths.split("../yeah"));
    echo(paths.split("hi"));
    echo(paths.split("hello/mario"));
    echo(paths.split("///what/"));
    echo(paths.split("/who//tf//keeps putting/double/slashes/"));
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      ""
      "some"
      "path"
      "some"
      "where"
    ]
    [
      ""
      "with"
      "trailing"
      "slash"
    ]
    [
      "."
      "this"
      "one's"
      "relative"
    ]
    [
      ".."
    ]
    [
      ".."
      "yeah"
    ]
    [
      "hi"
    ]
    [
      "hello"
      "mario"
    ]
    [
      ""
      "what"
    ]
    [
      ""
      "who"
      "tf"
      "keeps putting"
      "double"
      "slashes"
    ]
    ",
    }
  `);
});

test("paths.split (windows-style paths)", async () => {
  const script = `
    echo(paths.split("C:\\\\some\\\\path\\\\some\\\\where"));
    echo(paths.split("D:\\\\with\\\\trailing\\\\slash\\\\"));
    echo(paths.split(".\\\\this\\\\one's\\\\relative"));
    echo(paths.split(".."));
    echo(paths.split("..\\\\yeah"));
    echo(paths.split("hi"));
    echo(paths.split("hello\\\\mario"));
    echo(paths.split("E:\\\\what\\\\"));
    echo(paths.split("Z:\\\\\\\\who\\\\\\\\tf\\\\\\\\keeps putting\\\\\\\\double\\\\\\\\slashes\\\\\\\\"));
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      "C:"
      "some"
      "path"
      "some"
      "where"
    ]
    [
      "D:"
      "with"
      "trailing"
      "slash"
    ]
    [
      "."
      "this"
      "one's"
      "relative"
    ]
    [
      ".."
    ]
    [
      ".."
      "yeah"
    ]
    [
      "hi"
    ]
    [
      "hello"
      "mario"
    ]
    [
      "E:"
      "what"
    ]
    [
      "Z:"
      "who"
      "tf"
      "keeps putting"
      "double"
      "slashes"
    ]
    ",
    }
  `);
});

test("paths.detectSeparator", async () => {
  const script = `
    echo(paths.detectSeparator("./hi/there"));
    echo(paths.detectSeparator(".\\\\hi\\\\there"));
    echo(paths.detectSeparator("hi"));
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "/
    \\
    /
    ",
    }
  `);
});

test("paths.join", async () => {
  const script = `
    echo(paths.join("one", "two"));
    echo(paths.join("", "one", "two", "three", "four"));
    echo(paths.join("bla/blah", "hi"));
    echo(paths.join("./bla/blah", "hi\\\\there"));
    echo(paths.join(".\\\\bla\\\\blah", "hi/there"));
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "one/two
    /one/two/three/four
    bla/blah/hi
    .\\bla\\blah\\hi\\there
    .\\bla\\blah\\hi\\there
    ",
    }
  `);
});

test("paths.resolve with already-absolute path", async () => {
  const result = await evaluate(`paths.resolve("/hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "/hi/there/yeah
    ",
    }
  `);
});

test("paths.resolve with absolute path with . and ..s in it", async () => {
  const result = await evaluate(`paths.resolve("/hi/./there/yeah/../yup/./")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "/hi/there/yup
    ",
    }
  `);
});
