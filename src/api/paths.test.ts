import { evaluate, getBinaryPath } from "../test-helpers";
import { spawn } from "first-base";

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
