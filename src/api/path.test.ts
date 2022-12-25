import { evaluate } from "../test-helpers";

test("Path.OS_SEGMENT_SEPARATOR", async () => {
  const result = await evaluate(`Path.OS_SEGMENT_SEPARATOR`);
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

test("Path.splitToSegments", async () => {
  const script = `
    echo(Path.splitToSegments("/some/path/some/where"));
    echo(Path.splitToSegments("/with/trailing/slash/"));
    echo(Path.splitToSegments("./this/one's/relative"));
    echo(Path.splitToSegments(".."));
    echo(Path.splitToSegments("../yeah"));
    echo(Path.splitToSegments("hi"));
    echo(Path.splitToSegments("hello/mario"));
    echo(Path.splitToSegments("///what/"));
    echo(Path.splitToSegments("/who//tf//keeps putting/double/slashes/"));
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

test("Path.splitToSegments (windows-style paths)", async () => {
  const script = `
    echo(Path.splitToSegments("C:\\\\some\\\\path\\\\some\\\\where"));
    echo(Path.splitToSegments("D:\\\\with\\\\trailing\\\\slash\\\\"));
    echo(Path.splitToSegments(".\\\\this\\\\one's\\\\relative"));
    echo(Path.splitToSegments(".."));
    echo(Path.splitToSegments("..\\\\yeah"));
    echo(Path.splitToSegments("hi"));
    echo(Path.splitToSegments("hello\\\\mario"));
    echo(Path.splitToSegments("E:\\\\what\\\\"));
    echo(Path.splitToSegments("Z:\\\\\\\\who\\\\\\\\tf\\\\\\\\keeps putting\\\\\\\\double\\\\\\\\slashes\\\\\\\\"));
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

test("Path.detectSeparator", async () => {
  const script = `
    echo(Path.detectSeparator("./hi/there"));
    echo(Path.detectSeparator(".\\\\hi\\\\there"));
    echo(Path.detectSeparator("hi"));
    echo(Path.detectSeparator("hi", null));
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
    null
    ",
    }
  `);
});

test("Path.join", async () => {
  const script = `
    echo(Path.join("one", "two"));
    echo(Path.join("", "one", "two", "three", "four"));
    echo(Path.join("bla/blah", "hi"));
    echo(Path.join("./bla/blah", "hi\\\\there"));
    echo(Path.join(".\\\\bla\\\\blah", "hi/there"));
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
    ./bla/blah/hi/there
    .\\bla\\blah\\hi\\there
    ",
    }
  `);
});

test("Path.resolve with already-absolute path", async () => {
  const result = await evaluate(`Path.resolve("/hi/there/yeah")`);
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

test("Path.resolve with absolute path with . and ..s in it", async () => {
  const result = await evaluate(`Path.resolve("/hi/./there/yeah/../yup/./")`);
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

test("Path.resolve with non-absolute path with leading .", async () => {
  const result = await evaluate(`Path.resolve("./hi/there/yeah")`, {
    cwd: "/usr",
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "/usr/hi/there/yeah
    ",
    }
  `);
});

test("Path.resolve with non-absolute path with leading ..", async () => {
  const result = await evaluate(`Path.resolve("../hi/there/yeah")`, {
    cwd: "/usr",
  });
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

test("Path.resolve with unresolvable path (leading ..)", async () => {
  const result = await evaluate(`Path.resolve("../hi/there/yeah")`, {
    cwd: "/",
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Could not resolve ../hi/there/yeah from / (this = "../hi/there/yeah", from = "/")
      at makeErrorWithProperties
      at resolve
      at resolve
      at <eval>
      this: "../hi/there/yeah"
      from: "/"
    }
    ",
      "stdout": "",
    }
  `);
});

test("Path.normalize with absolute path with . and ..s in it", async () => {
  const result = await evaluate(`Path.normalize("/hi/./there/yeah/../yup/./")`);
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

test("Path.normalize with non-absolute path with . and ..s in it", async () => {
  const result = await evaluate(`Path.normalize("hi/./there/yeah/../yup/./")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hi/there/yup
    ",
    }
  `);
});

test("Path.normalize with already-absolute path", async () => {
  const result = await evaluate(`Path.normalize("/hi/there/yeah")`);
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

test("Path.normalize with non-absolute path with no . or .. in it", async () => {
  const result = await evaluate(`Path.normalize("hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hi/there/yeah
    ",
    }
  `);
});

test("Path.normalize with non-absolute path with leading .", async () => {
  const result = await evaluate(`Path.normalize("./hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "./hi/there/yeah
    ",
    }
  `);
});

test("Path.normalize with non-absolute path with leading ..", async () => {
  const result = await evaluate(`Path.normalize("../hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "../hi/there/yeah
    ",
    }
  `);
});

test("Path.tag", async () => {
  const result = await evaluate(`
    [
      Path.tag\`\`,
      Path.tag\`a/b/c\`,
      Path.tag\`/some/thing\`,
      Path.tag\`/some/thing/\${"cool"}\`,
      Path.tag\`/some/\${"thing"}cool/\${new Path("ikr/yay")}\`,
    ]
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      Path {
        segments: []
        separator: "/"
      }
      Path {
        segments: [
          "a"
          "b"
          "c"
        ]
        separator: "/"
      }
      Path {
        segments: [
          ""
          "some"
          "thing"
        ]
        separator: "/"
      }
      Path {
        segments: [
          ""
          "some"
          "thing"
          "cool"
        ]
        separator: "/"
      }
      Path {
        segments: [
          ""
          "some"
          "thing"
          "cool"
          "ikr"
          "yay"
        ]
        separator: "/"
      }
    ]
    ",
    }
  `);
});

test("Path.tagUsingBase", async () => {
  const result = await evaluate(`
    const p = Path.tagUsingBase("/tmp");

    [
      p\`\`,
      p\`a/b/c\`,
      p\`/some/thing\`,
      p\`/some/thing/\${"cool"}\`,
      p\`/some/\${"thing"}cool/\${new Path("ikr/yay")}\`,
    ]
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      Path {
        segments: [
          ""
          "tmp"
        ]
        separator: "/"
      }
      Path {
        segments: [
          ""
          "tmp"
          "a"
          "b"
          "c"
        ]
        separator: "/"
      }
      Path {
        segments: [
          ""
          "tmp"
          "some"
          "thing"
        ]
        separator: "/"
      }
      Path {
        segments: [
          ""
          "tmp"
          "some"
          "thing"
          "cool"
        ]
        separator: "/"
      }
      Path {
        segments: [
          ""
          "tmp"
          "some"
          "thing"
          "cool"
          "ikr"
          "yay"
        ]
        separator: "/"
      }
    ]
    ",
    }
  `);
});
