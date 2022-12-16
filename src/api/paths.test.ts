import { evaluate, getBinaryPath } from "../test-helpers";
import { spawn } from "first-base";

test("paths.OS_PATH_SEPARATOR", async () => {
  const result = await evaluate(`paths.OS_PATH_SEPARATOR`);
  expect(result).toMatchObject({
    code: 0,
    error: false,
    stderr: "",
  });

  if (process.platform === "win32") {
    expect(result.stdout).toBe("\\\n");
  } else {
    expect(result.stdout).toBe("/\n");
  }
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
