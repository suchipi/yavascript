import { evaluate, rootDir } from "./test-helpers";

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

test("Path.normalize with absolute path with . and ..s in it", async () => {
  const result = await evaluate(`Path.normalize("/hi/./there/yeah/../yup/./")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { /hi/there/yup }
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
      "stdout": "Path { hi/there/yup }
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
      "stdout": "Path { /hi/there/yeah }
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
      "stdout": "Path { hi/there/yeah }
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
      "stdout": "Path { ./hi/there/yeah }
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
      "stdout": "Path { ../hi/there/yeah }
    ",
    }
  `);
});

test("Path.normalize with non-absolute path with two leading ..", async () => {
  const result = await evaluate(`Path.normalize("../../hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { ../../hi/there/yeah }
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
      path: Path { / }
      path2: Path { \\ }
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
      path: Path { /tmp }
      path2: Path { \\\\SERVERNAME\\ShareName }
    }
    ",
    }
  `);
});

test("printing of normal Path object", async () => {
  const result = await evaluate(
    `
      new Path(pwd(), "something")
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { <rootDir>/something }
    ",
    }
  `);
});

test("printing of empty Path object", async () => {
  const result = await evaluate(
    `
      new Path()
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path {
      segments: []
      separator: "/"
    }
    ",
    }
  `);
});

test("printing of Path object with extra props", async () => {
  const result = await evaluate(
    `
      const p = new Path(pwd(), "something");
      p.something = true;
      p
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path {
      <rootDir>/something
      
      something: true
    }
    ",
    }
  `);
});

test("printing of frozen Path object", async () => {
  const result = await evaluate(
    `
      const p = new Path(pwd(), "something");
      Object.freeze(p);
      p
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path {
      Frozen
      <rootDir>/something
    }
    ",
    }
  `);
});

test("printing of Path object with a child path object attached to it", async () => {
  const result = await evaluate(
    `
      const p = new Path(pwd(), "something");
      const p2 = new Path(pwd(), "something-else");
      p.p2 = p2;
      p
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path {
      <rootDir>/something
      
      p2: Path { <rootDir>/something-else }
    }
    ",
    }
  `);
});

test("Path.startsWith", async () => {
  const result = await evaluate(
    `
      const p = new Path(pwd(), "something", "yeah");
      const p2 = new Path(pwd(), "something-else", "yeah", "yup");
      const p3 = new Path(pwd(), "something");

      // All true
      echo(p.startsWith(pwd()));
      echo(p2.startsWith(pwd()));
      echo(p3.startsWith(pwd()));
      echo(p.startsWith(p));
      echo(p2.startsWith(p2));
      echo(p3.startsWith(p3));

      // All false
      echo(p.startsWith(p2));
      echo(p2.startsWith(p));
      echo(p2.startsWith(p3));

      // true
      echo(p.startsWith(p3));
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    true
    true
    true
    true
    true
    false
    false
    false
    true
    ",
    }
  `);
});

test("Path.endsWith", async () => {
  const result = await evaluate(
    `
      const p = new Path(pwd(), "something", "yup");
      const p2 = new Path(pwd(), "something-else", "yeah", "yup");
      const p3 = new Path("yeah", "yup");

      // All true
      echo(p.endsWith(p));
      echo(p2.endsWith(p2));
      echo(p3.endsWith(p3));

      // All false
      echo(p.endsWith(p2));
      echo(p2.endsWith(p));
      echo(p.endsWith(p3));

      // true
      echo(p2.endsWith(p3));
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    true
    true
    false
    false
    false
    true
    ",
    }
  `);
});

test("Path.indexOf", async () => {
  const result = await evaluate(
    `
      const p = new Path("/tmp/something/yeah/yup");
      
      echo([
        p.indexOf("not here"),
        p.indexOf("/tmp"),
        // weird quirk of how we store segments: first segment in unix-style absolute path is ""
        p.indexOf("tmp"),
        p.indexOf("yup"),
        p.indexOf("something"),

        // You can specify search index... best way to test that is to make it miss something, I guess
        p.indexOf("tmp", 2),
        p.indexOf("yup", 2), // works because yup is after index 2
      ]);
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      -1
      0
      1
      4
      2
      -1
      4
    ]
    ",
    }
  `);
});

test("Path.replace", async () => {
  const result = await evaluate(
    `
      const p = new Path(pwd(), "something", "yup", "yeah");
      
      echo([
        p.replace("something", "something-else"),
        p.replace("something/yup", "something/nah"),
        p.replace("something/yup", "something-again"),
        p.replace(pwd(), "/tmp"),
        p.replace(["something", "yup", "yeah"], "/mhm"),
      ])
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      Path { <rootDir>/something-else/yup/yeah }
      Path { <rootDir>/something/nah/yeah }
      Path { <rootDir>/something-again/yeah }
      Path { /tmp/something/yup/yeah }
      Path { <rootDir>/mhm }
    ]
    ",
    }
  `);
});

test("Path.replaceAll", async () => {
  const result = await evaluate(
    `
      const p = new Path("/one/two/three/two/one/zero");
      echo(p.replaceAll("one", "nine/ten"));

      // replaceAll avoids an infinite loop by only replacing forwards
      echo(p.replaceAll("one", "one"));
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { /nine/ten/two/three/two/nine/ten/zero }
    Path { /one/two/three/two/one/zero }
    ",
    }
  `);
});

test("Path.replaceLast", async () => {
  const result = await evaluate(
    `
      const p = new Path("/one/two/three/two/one/zero");
      echo(p.replaceLast("twenty-two"));
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { /one/two/three/two/one/twenty-two }
    ",
    }
  `);
});

test("Path.basename", async () => {
  const result = await evaluate(
    `
      const p = new Path("/one/two/three/two/one/zero.help.txt");
      echo(p.basename());
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "zero.help.txt
    ",
    }
  `);
});

test("Path.extname", async () => {
  const result = await evaluate(
    `
      const p = new Path("/one/two/three/two/one/zero.help.txt");
      echo(p.extname());
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": ".txt
    ",
    }
  `);
});

test("Path.extname full", async () => {
  const result = await evaluate(
    `
      const p = new Path("/one/two/three/two/one/zero.help.txt");
      echo(p.extname({ full: true }));
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": ".help.txt
    ",
    }
  `);
});

test("Path.dirname", async () => {
  const result = await evaluate(
    `
      const p = new Path("/one/two/three/two/one/zero.help.txt");
      echo(p.dirname());
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { /one/two/three/two/one }
    ",
    }
  `);
});

test("Path.clone", async () => {
  const result = await evaluate(
    `
      const p = new Path("/one/two/three/two/one/zero.help.txt");
      const p2 = p.clone();
      console.log("p", p);
      console.log("p2", p2);
      console.log("p === p2", p === p2);
      console.log("p.segments === p2.segments", p.segments === p2.segments);
      console.log("p.separator === p2.separator", p.separator === p2.separator);
    `,
    { cwd: rootDir() },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "p Path { /one/two/three/two/one/zero.help.txt }
    p2 Path { /one/two/three/two/one/zero.help.txt }
    p === p2 false
    p.segments === p2.segments false
    p.separator === p2.separator true
    ",
    }
  `);
});

test("Path.equals", async () => {
  const script = `
    const pairs = [
      [new Path(), new Path()],
      [new Path(""), new Path("")],
      [new Path("/abc/d"), new Path("/abc/d")],
      [new Path("/abc/d"), new Path("abc/d")],
      [new Path("abc/d"), new Path("abc/d")],
      [new Path("/123/4"), new Path("abc/d")],
      [Path.fromRaw(["", "a", "b", "c"], "\\\\"), new Path("/a/b/c")],
      [Path.fromRaw(["a", "b", "c"], "\\\\"), new Path("a/b/c")],
    ];

    for (const [a, b] of pairs) {
      echo(a, b, "equals", a.equals(b));
    }
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path {
      segments: []
      separator: "/"
    } Path {
      segments: []
      separator: "/"
    } equals true
    Path { / } Path { / } equals true
    Path { /abc/d } Path { /abc/d } equals true
    Path { /abc/d } Path { abc/d } equals false
    Path { abc/d } Path { abc/d } equals true
    Path { /123/4 } Path { abc/d } equals false
    Path { \\a\\b\\c } Path { /a/b/c } equals false
    Path { a\\b\\c } Path { a/b/c } equals false
    ",
    }
  `);
});

test("Path.hasEqualSegments", async () => {
  const script = `
    const pairs = [
      [new Path(), new Path()],
      [new Path(""), new Path("")],
      [new Path("/abc/d"), new Path("/abc/d")],
      [new Path("/abc/d"), new Path("abc/d")],
      [new Path("abc/d"), new Path("abc/d")],
      [new Path("/123/4"), new Path("abc/d")],
      [Path.fromRaw(["", "a", "b", "c"], "\\\\"), new Path("/a/b/c")],
      [Path.fromRaw(["a", "b", "c"], "\\\\"), new Path("a/b/c")],
    ];

    for (const [a, b] of pairs) {
      echo(a, b, "hasEqualSegments", a.hasEqualSegments(b));
    }
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path {
      segments: []
      separator: "/"
    } Path {
      segments: []
      separator: "/"
    } hasEqualSegments true
    Path { / } Path { / } hasEqualSegments true
    Path { /abc/d } Path { /abc/d } hasEqualSegments true
    Path { /abc/d } Path { abc/d } hasEqualSegments false
    Path { abc/d } Path { abc/d } hasEqualSegments true
    Path { /123/4 } Path { abc/d } hasEqualSegments false
    Path { \\a\\b\\c } Path { /a/b/c } hasEqualSegments true
    Path { a\\b\\c } Path { a/b/c } hasEqualSegments true
    ",
    }
  `);
});
