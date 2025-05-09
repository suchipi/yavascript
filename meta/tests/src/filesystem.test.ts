import fs from "fs";
import path from "path";
import { evaluate, inspect, cleanResult, rootDir } from "./test-helpers";

const symlinksFixturesDir = rootDir("meta/tests/fixtures/symlinks");
const fileContentFixturesDir = rootDir("meta/tests/fixtures/file_content");

test("readlink", async () => {
  const result = await evaluate(
    `[readlink("dead-link"), readlink("link-to-file"), readlink("link-to-folder")]`,
    { cwd: symlinksFixturesDir }
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      Path { ./nowhere-real }
      Path { ./some-file }
      Path { ./some-folder }
    ]
    ",
    }
  `);
});

test("readFile - string", async () => {
  const result = await evaluate(
    `readFile("${fileContentFixturesDir}/hello.txt")`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hello, world!!! :D
    あ
    ",
    }
  `);
});

test("readFile - binary", async () => {
  const result = await evaluate(
    `readFile("${fileContentFixturesDir}/hello.txt", { binary: true })`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "ArrayBuffer {
      │0x00000000│ 68 65 6C 6C 6F 2C 20 77 6F 72 6C 64 21 21 21 20
      │0x00000010│ 3A 44 0A E3 81 82
    }
    ",
    }
  `);
});

test("writeFile", async () => {
  const targetFile = path.join(fileContentFixturesDir, "written.txt");
  if (fs.existsSync(targetFile)) {
    fs.unlinkSync(targetFile);
    expect(fs.existsSync(targetFile)).toBe(false);
  }

  const result = await evaluate(
    `writeFile(${JSON.stringify(targetFile)}, "hiiii~!!! :D あ")`
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  const content = fs.readFileSync(targetFile, "utf-8");
  expect(content).toBe("hiiii~!!! :D あ");

  fs.unlinkSync(targetFile);
});

test("isDir - on dir", async () => {
  const result = await evaluate(`isDir("./meta/tests/fixtures/glob/cabana")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("isDir - on file", async () => {
  const result = await evaluate(`isDir("./meta/tests/fixtures/glob/hi.txt")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "false
    ",
    }
  `);
});

test("isDir - on link to folder", async () => {
  const result = await evaluate(
    `isDir("./meta/tests/fixtures/symlinks/link-to-folder")`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("isDir - on link to file", async () => {
  const result = await evaluate(
    `isDir("./meta/tests/fixtures/symlinks/link-to-file")`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "false
    ",
    }
  `);
});

test("isDir - on dead link", async () => {
  const result = await evaluate(
    `isDir("./meta/tests/fixtures/symlinks/dead-link")`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "false
    ",
    }
  `);
});

test("isLink - on dir", async () => {
  const result = await evaluate(`isLink("./meta/tests/fixtures/glob/cabana")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "false
    ",
    }
  `);
});

test("isLink - on file", async () => {
  const result = await evaluate(`isLink("./meta/tests/fixtures/glob/hi.txt")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "false
    ",
    }
  `);
});

test("isLink - on link to folder", async () => {
  const result = await evaluate(
    `isLink("./meta/tests/fixtures/symlinks/link-to-folder")`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("isLink - on link to file", async () => {
  const result = await evaluate(
    `isLink("./meta/tests/fixtures/symlinks/link-to-file")`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("isLink - on dead link", async () => {
  const result = await evaluate(
    `isLink("./meta/tests/fixtures/symlinks/dead-link")`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("remove - on file", async () => {
  const target = rootDir("meta/tests/fixtures/remove/hi.txt");

  fs.writeFileSync(target, "hello there");

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`remove(${JSON.stringify(target)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  expect(fs.existsSync(target)).toBe(false);
});

test("remove - on empty dir", async () => {
  const targetDir = rootDir("meta/tests/fixtures/remove/empty-dir");

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir);

  expect(fs.existsSync(targetDir)).toBe(true);

  const result = await evaluate(`remove(${JSON.stringify(targetDir)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  expect(fs.existsSync(targetDir)).toBe(false);
});

test("remove - on dir with content", async () => {
  const targetDir = rootDir("meta/tests/fixtures/remove/dir-with-content");

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir);

  fs.mkdirSync(path.join(targetDir, "empty-dir"));
  fs.mkdirSync(path.join(targetDir, "another-dir-with-content"));
  fs.writeFileSync(
    path.join(targetDir, "another-dir-with-content", "hi.txt"),
    "hello there"
  );
  fs.writeFileSync(
    path.join(targetDir, "another-dir-with-content", "hi2.txt"),
    "hello again!!"
  );
  fs.mkdirSync(
    path.join(targetDir, "another-dir-with-content", "another-empty-dir")
  );
  fs.writeFileSync(path.join(targetDir, "something.js"), "console.log(2 + 2);");

  const result = await evaluate(`remove(${JSON.stringify(targetDir)})`);
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });

  expect(fs.existsSync(targetDir)).toBe(false);
});

test("exists - existent target file", async () => {
  const target = rootDir("meta/tests/fixtures/glob/hi.something.js");

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("exists - existent target dir", async () => {
  const target = rootDir("meta/tests/fixtures/glob");

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("exists - nonexistent target", async () => {
  const target = rootDir("meta/tests/fixtures/glob/nope_this_aint_there");

  expect(fs.existsSync(target)).toBe(false);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "false
    ",
    }
  `);
});

test("exists - link to file", async () => {
  const target = rootDir("meta/tests/fixtures/symlinks/link-to-file");

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("exists - link to dir", async () => {
  const target = rootDir("meta/tests/fixtures/symlinks/link-to-folder");

  expect(fs.existsSync(target)).toBe(true);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

// weird that this says it doesn't exist, but that's consistent with os.access
// and node behavior, so I guess it's fine
test("exists - dead link", async () => {
  const target = rootDir("meta/tests/fixtures/symlinks/dead-link");

  expect(fs.existsSync(target)).toBe(false);

  const result = await evaluate(`exists(${JSON.stringify(target)})`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "false
    ",
    }
  `);
});

test("copy", async () => {
  const source = rootDir("meta/tests/fixtures/copy/blah");
  const target = rootDir("meta/tests/fixtures/copy/blah_copy");

  // wanna have an empty folder in this test, but empty folders
  // can't be in git
  if (!fs.existsSync(path.join(source, "/blah3"))) {
    fs.mkdirSync(path.join(source, "/blah3"));
  }

  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }

  const result = await evaluate(
    `copy(${JSON.stringify(source)}, ${JSON.stringify(target)})`
  );
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "copy: meta/tests/fixtures/copy/blah/blah2/hi.txt -> meta/tests/fixtures/copy/blah_copy/blah2/hi.txt
    ",
      "stdout": "",
    }
  `);

  const blah2 = path.join(target, "blah2");
  const blah3 = path.join(target, "blah3");
  const blah2_hiTxt = path.join(target, "blah2", "hi.txt");

  expect(fs.existsSync(target)).toBe(true);
  expect(fs.statSync(target).isDirectory()).toBe(true);
  expect(fs.existsSync(blah2)).toBe(true);
  expect(fs.statSync(blah2).isDirectory()).toBe(true);
  expect(fs.existsSync(blah3)).toBe(true);
  expect(fs.statSync(blah3).isDirectory()).toBe(true);
  expect(fs.readFileSync(blah2_hiTxt, "utf-8")).toBe("yeah hi there\n");

  fs.rmSync(target, { recursive: true, force: true });
});

// rename test TODO
