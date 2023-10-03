import { evaluate } from "../../test-helpers";

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
    echo(Path.splitToSegments("\\\\\\\\SERVERNAME\\\\ShareName$\\\\file.txt"));
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
    [
      ""
      ""
      "SERVERNAME"
      "ShareName$"
      "file.txt"
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
      "stdout": "Path {
      segments: [
        "one"
        "two"
      ]
      separator: "/"
    }
    Path {
      segments: [
        ""
        "one"
        "two"
        "three"
        "four"
      ]
      separator: "/"
    }
    Path {
      segments: [
        "bla"
        "blah"
        "hi"
      ]
      separator: "/"
    }
    Path {
      segments: [
        "."
        "bla"
        "blah"
        "hi"
        "there"
      ]
      separator: "/"
    }
    Path {
      segments: [
        "."
        "bla"
        "blah"
        "hi"
        "there"
      ]
      separator: "\\\\"
    }
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
      "stdout": "Path {
      segments: [
        ""
        "hi"
        "there"
        "yeah"
      ]
      separator: "/"
    }
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
      "stdout": "Path {
      segments: [
        ""
        "hi"
        "there"
        "yup"
      ]
      separator: "/"
    }
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
      "code": 1,
      "error": false,
      "stderr": "Error: .resolve could not create an absolute path. If you're okay with non-absolute paths, use '.concat(others).normalize()' instead of '.resolve(...others)'. (this = Path { segments: […] separator: "/" }, subpaths = [], result = Path { segments: […] separator: "/" })
      at somewhere
    {
      this: Path {
        segments: [
          "."
          "hi"
          "there"
          "yeah"
        ]
        separator: "/"
      }
      subpaths: []
      result: Path {
        segments: [
          "."
          "hi"
          "there"
          "yeah"
        ]
        separator: "/"
      }
    }
    ",
      "stdout": "",
    }
  `);
});

test("Path.resolve with non-absolute path with leading ..", async () => {
  const result = await evaluate(`Path.resolve("../hi/there/yeah")`, {
    cwd: "/usr",
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: .resolve could not create an absolute path. If you're okay with non-absolute paths, use '.concat(others).normalize()' instead of '.resolve(...others)'. (this = Path { segments: […] separator: "/" }, subpaths = [], result = Path { segments: […] separator: "/" })
      at somewhere
    {
      this: Path {
        segments: [
          ".."
          "hi"
          "there"
          "yeah"
        ]
        separator: "/"
      }
      subpaths: []
      result: Path {
        segments: [
          ".."
          "hi"
          "there"
          "yeah"
        ]
        separator: "/"
      }
    }
    ",
      "stdout": "",
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
      "stderr": "Error: .resolve could not create an absolute path. If you're okay with non-absolute paths, use '.concat(others).normalize()' instead of '.resolve(...others)'. (this = Path { segments: […] separator: "/" }, subpaths = [], result = Path { segments: […] separator: "/" })
      at somewhere
    {
      this: Path {
        segments: [
          ".."
          "hi"
          "there"
          "yeah"
        ]
        separator: "/"
      }
      subpaths: []
      result: Path {
        segments: [
          ".."
          "hi"
          "there"
          "yeah"
        ]
        separator: "/"
      }
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
      "stdout": "Path {
      segments: [
        ""
        "hi"
        "there"
        "yup"
      ]
      separator: "/"
    }
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
      "stdout": "Path {
      segments: [
        "hi"
        "there"
        "yup"
      ]
      separator: "/"
    }
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
      "stdout": "Path {
      segments: [
        ""
        "hi"
        "there"
        "yeah"
      ]
      separator: "/"
    }
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
      "stdout": "Path {
      segments: [
        "hi"
        "there"
        "yeah"
      ]
      separator: "/"
    }
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
      "stdout": "Path {
      segments: [
        "."
        "hi"
        "there"
        "yeah"
      ]
      separator: "/"
    }
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
      "stdout": "Path {
      segments: [
        ".."
        "hi"
        "there"
        "yeah"
      ]
      separator: "/"
    }
    ",
    }
  `);
});

test("Path.relativeTo", async () => {
  const result = await evaluate(`
    [
      new Path("/tmp/a/b/c").relativeTo("/tmp").toString(),
      new Path("/tmp/a/b/c").relativeTo("/").toString(),
      new Path("/tmp/a/b/c").relativeTo("/tmp/a/b/c/d/e").toString(),
      new Path("/tmp/a/b/c").relativeTo("/tmp/a/b/f/g/h").toString(),

      new Path("/home/suchipi/Code/something/src/index.ts").relativeTo("/home/suchipi/Code/something").toString(),
      new Path("/home/suchipi/Code/something/src/index.ts").relativeTo("/home/suchipi/Code/something", { noLeadingDot: true }).toString(),

      new Path("/home/suchipi/Code/something/src/index.ts").relativeTo("/home/suchipi/Code/something-else").toString(),
      new Path("/home/suchipi/Code/something/src/index.ts").relativeTo("/home/suchipi/Code/something-else", { noLeadingDot: true }).toString(),
    ]
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      "./a/b/c"
      "./tmp/a/b/c"
      "../.."
      "../../../c"
      "./src/index.ts"
      "src/index.ts"
      "../something/src/index.ts"
      "../something/src/index.ts"
    ]
    ",
    }
  `);
});

test("Path.toJSON", async () => {
  const result = await evaluate(`
    const path = new Path("/tmp/something/somewhere");
    const path2 = new Path("C:\\\\Users\\\\user");

    JSON.stringify({path, path2}, null, 2);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      "path": "/tmp/something/somewhere",
      "path2": "C:\\\\Users\\\\user"
    }
    ",
    }
  `);
});

test("Path constructor with fs root strings", async () => {
  const result = await evaluate(`
    const path = new Path("/");
    const path2 = new Path("\\\\\\\\");

    ({ path, path2 });
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      path: Path {
        segments: [
          ""
        ]
        separator: "/"
      }
      path2: Path {
        segments: [
          ""
          ""
        ]
        separator: "\\\\"
      }
    }
    ",
    }
  `);
});

test("Path constructor with absolute paths", async () => {
  const result = await evaluate(`
    const path = new Path("/tmp");
    const path2 = new Path("\\\\\\\\SERVERNAME\\\\ShareName");

    ({ path, path2 });
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      path: Path {
        segments: [
          ""
          "tmp"
        ]
        separator: "/"
      }
      path2: Path {
        segments: [
          ""
          ""
          "SERVERNAME"
          "ShareName"
        ]
        separator: "\\\\"
      }
    }
    ",
    }
  `);
});
