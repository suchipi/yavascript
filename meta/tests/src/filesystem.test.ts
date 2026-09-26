import { afterAll, afterEach, beforeEach, expect, test } from "vitest";
import fs from "fs";
import path from "path";
import { execFileSync, spawn as spawnProcess } from "child_process";
import {
  evaluate,
  evaluateWithTimeout,
  inspect,
  rootDir,
  HANG_TIMEOUT,
} from "./test-helpers";

/**
 * vitest's own per-test timeout has to be comfortably above HANG_TIMEOUT, or
 * it fires first and the test reports a timeout instead of the real failure.
 */
const HANG_TEST_TIMEOUT = HANG_TIMEOUT * 4;

const symlinksFixturesDir = rootDir("meta/tests/fixtures/symlinks");
const fileContentFixturesDir = rootDir("meta/tests/fixtures/file_content");

const scratchDir = rootDir.concat("meta/tests/fixtures/fs-scratch");
const scratch = (...parts: Array<string>) => scratchDir(...parts);

const cleanScratch = () => {
  for (const child of fs.readdirSync(scratchDir())) {
    if (child.startsWith(".")) continue;
    const target = scratchDir(child);
    // chmod back anything a test made read-only, so rm can descend into it
    try {
      if (fs.lstatSync(target).isDirectory()) fs.chmodSync(target, 0o755);
    } catch {}
    fs.rmSync(target, { recursive: true, force: true });
  }
};

beforeEach(cleanScratch);
afterAll(cleanScratch);

/**
 * Bigger than any pipe buffer, so a reader that sizes its buffer from
 * stat().size can never accidentally get all of it.
 */
const FIFO_PAYLOAD_SIZE = 1000000;

const fifoWriters: Array<ReturnType<typeof spawnProcess>> = [];

/**
 * Makes a fifo and starts filling it from a detached shell. The writer blocks
 * until something reads, so it has to be a separate process rather than a
 * node stream (which would tie up a libuv threadpool thread).
 */
function makeFifo(name: string, payload?: string) {
  const fifoPath = scratch(name);
  execFileSync("mkfifo", [fifoPath]);

  const writer = spawnProcess(
    "sh",
    payload == null
      ? [
          "-c",
          `head -c ${FIFO_PAYLOAD_SIZE} /dev/zero | tr '\\0' z > "$1"`,
          "sh",
          fifoPath,
        ]
      : ["-c", `printf '%s' "$2" > "$1"`, "sh", fifoPath, payload],
    { stdio: "ignore" },
  );
  writer.on("error", () => {});
  fifoWriters.push(writer);

  return { path: fifoPath };
}

afterEach(() => {
  while (fifoWriters.length > 0) fifoWriters.pop()!.kill("SIGKILL");
});

test("readlink", async () => {
  const result = await evaluate(
    `[readlink("dead-link"), readlink("link-to-file"), readlink("link-to-folder")]`,
    { cwd: symlinksFixturesDir },
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
    `readFile("${fileContentFixturesDir}/hello.txt")`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "hello, world!!! :D
   あ
   ",
   }
  `);
});

test("readFile - binary", async () => {
  const result = await evaluate(
    `readFile("${fileContentFixturesDir}/hello.txt", { binary: true })`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
    `writeFile(${JSON.stringify(targetFile)}, "hiiii~!!! :D あ")`,
  );
  expect(result).toEqual({
    code: 0,
    error: null,
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
     "error": null,
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
     "error": null,
     "stderr": "",
     "stdout": "false
   ",
   }
  `);
});

test("isDir - on link to folder", async () => {
  const result = await evaluate(
    `isDir("./meta/tests/fixtures/symlinks/link-to-folder")`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "true
   ",
   }
  `);
});

test("isDir - on link to file", async () => {
  const result = await evaluate(
    `isDir("./meta/tests/fixtures/symlinks/link-to-file")`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "false
   ",
   }
  `);
});

test("isDir - on dead link", async () => {
  const result = await evaluate(
    `isDir("./meta/tests/fixtures/symlinks/dead-link")`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
     "error": null,
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
     "error": null,
     "stderr": "",
     "stdout": "false
   ",
   }
  `);
});

test("isLink - on link to folder", async () => {
  const result = await evaluate(
    `isLink("./meta/tests/fixtures/symlinks/link-to-folder")`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "true
   ",
   }
  `);
});

test("isLink - on link to file", async () => {
  const result = await evaluate(
    `isLink("./meta/tests/fixtures/symlinks/link-to-file")`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "true
   ",
   }
  `);
});

test("isLink - on dead link", async () => {
  const result = await evaluate(
    `isLink("./meta/tests/fixtures/symlinks/dead-link")`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
  expect(result).toEqual({
    code: 0,
    error: null,
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
  expect(result).toEqual({
    code: 0,
    error: null,
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
    "hello there",
  );
  fs.writeFileSync(
    path.join(targetDir, "another-dir-with-content", "hi2.txt"),
    "hello again!!",
  );
  fs.mkdirSync(
    path.join(targetDir, "another-dir-with-content", "another-empty-dir"),
  );
  fs.writeFileSync(path.join(targetDir, "something.js"), "console.log(2 + 2);");

  const result = await evaluate(`remove(${JSON.stringify(targetDir)})`);
  expect(result).toEqual({
    code: 0,
    error: null,
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
     "error": null,
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
     "error": null,
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
     "error": null,
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
     "error": null,
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
     "error": null,
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
     "error": null,
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
    `copy(${JSON.stringify(source)}, ${JSON.stringify(target)})`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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

// ---------------------------------------------------------------------------
// remove
// ---------------------------------------------------------------------------

test("remove - on a symlink to a dir removes the link, not the target's contents", async () => {
  const victim = scratch("victim");
  const link = scratch("link-to-victim");

  fs.mkdirSync(victim, { recursive: true });
  fs.writeFileSync(path.join(victim, "keep.txt"), "keep me");
  fs.mkdirSync(path.join(victim, "nested"));
  fs.symlinkSync(victim, link);

  const result = await evaluate(`remove(${JSON.stringify(link)})`);
  expect(result.code).toBe(0);

  expect(fs.existsSync(link)).toBe(false);
  expect(fs.existsSync(path.join(victim, "keep.txt"))).toBe(true);
  expect(fs.readFileSync(path.join(victim, "keep.txt"), "utf-8")).toBe(
    "keep me",
  );
  expect(fs.existsSync(path.join(victim, "nested"))).toBe(true);
});

test("remove - a symlink inside the tree being removed doesn't delete the target's contents", async () => {
  const victim = scratch("victim");
  const tree = scratch("tree");

  fs.mkdirSync(victim, { recursive: true });
  fs.writeFileSync(path.join(victim, "keep.txt"), "keep me");
  fs.mkdirSync(tree, { recursive: true });
  fs.symlinkSync(victim, path.join(tree, "link"));

  const result = await evaluate(`remove(${JSON.stringify(tree)})`);
  expect(result.code).toBe(0);

  expect(fs.existsSync(tree)).toBe(false);
  expect(fs.existsSync(path.join(victim, "keep.txt"))).toBe(true);
  expect(fs.readFileSync(path.join(victim, "keep.txt"), "utf-8")).toBe(
    "keep me",
  );
});

test(
  "remove - a symlink to the tree's own parent doesn't delete anything outside",
  async () => {
    const outside = scratch("outside.txt");
    const tree = scratch("tree");

    fs.writeFileSync(outside, "outside");
    fs.mkdirSync(tree, { recursive: true });
    fs.writeFileSync(path.join(tree, "t.txt"), "inside");
    fs.symlinkSync("..", path.join(tree, "up"));

    const result = await evaluateWithTimeout(`remove(${JSON.stringify(tree)})`);
    expect(result.timedOut).toBe(false);
    expect(result.code).toBe(0);

    expect(fs.existsSync(tree)).toBe(false);
    expect(fs.readFileSync(outside, "utf-8")).toBe("outside");
  },
  HANG_TEST_TIMEOUT,
);

test('remove - on "." refuses instead of emptying the directory', async () => {
  const dir = scratch("dot-removal");
  fs.mkdirSync(path.join(dir, "a"), { recursive: true });
  fs.writeFileSync(path.join(dir, "a", "1.txt"), "one");
  fs.writeFileSync(path.join(dir, "2.txt"), "two");

  // `rm -rf .` refuses up front and deletes nothing.
  const result = await evaluate(`remove(".")`, { cwd: dir });
  expect(result.code).not.toBe(0);

  expect(fs.existsSync(path.join(dir, "2.txt"))).toBe(true);
  expect(fs.existsSync(path.join(dir, "a", "1.txt"))).toBe(true);
});

// ---------------------------------------------------------------------------
// copy
// ---------------------------------------------------------------------------

test('copy - whenTargetExists "overwrite" truncates the target', async () => {
  const source = scratch("src.txt");
  const target = scratch("dest.txt");

  fs.writeFileSync(source, "SRC-A");
  fs.writeFileSync(target, "THIS TARGET IS MUCH LONGER THAN THE SOURCE");

  const result = await evaluate(
    `copy(${JSON.stringify(source)}, ${JSON.stringify(target)}, { whenTargetExists: "overwrite", logging: { info() {} } })`,
  );
  expect(result.code).toBe(0);

  expect(fs.readFileSync(target, "utf-8")).toBe("SRC-A");
});

test("copy - file into a dir honors whenTargetExists", async () => {
  const source = scratch("src.txt");
  const destDir = scratch("destdir");

  fs.writeFileSync(source, "SRC-A");
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(
    path.join(destDir, "src.txt"),
    "EXISTING LONGER CONTENT IN DEST",
  );

  // The default is whenTargetExists: "error", same as the file -> file case.
  const result = await evaluate(
    `copy(${JSON.stringify(source)}, ${JSON.stringify(destDir)}, { logging: { info() {} } })`,
  );
  expect(result.code).not.toBe(0);

  expect(fs.readFileSync(path.join(destDir, "src.txt"), "utf-8")).toBe(
    "EXISTING LONGER CONTENT IN DEST",
  );
});

test(
  "copy - a dir symlink is copied as a link instead of being followed",
  async () => {
    const source = scratch("src-loop");
    const target = scratch("dst-loop");

    fs.mkdirSync(source, { recursive: true });
    fs.writeFileSync(path.join(source, "l.txt"), "l");
    fs.symlinkSync("..", path.join(source, "parent-link"));

    const result = await evaluateWithTimeout(
      `copy(${JSON.stringify(source)}, ${JSON.stringify(target)}, { logging: { info() {} } })`,
    );
    expect(result.timedOut).toBe(false);
    expect(result.code).toBe(0);

    // cp -R copies the link itself, giving exactly l.txt and parent-link.
    expect(fs.readdirSync(target).sort()).toEqual(["l.txt", "parent-link"]);
    expect(
      fs.lstatSync(path.join(target, "parent-link")).isSymbolicLink(),
    ).toBe(true);
  },
  HANG_TEST_TIMEOUT,
);

test(
  "copy - copying a dir into itself doesn't run away",
  async () => {
    const source = scratch("selfsrc");
    fs.mkdirSync(path.join(source, "x"), { recursive: true });
    fs.writeFileSync(path.join(source, "x", "s.txt"), "s");

    const result = await evaluateWithTimeout(
      `copy(${JSON.stringify(source)}, ${JSON.stringify(path.join(source, "x"))}, { logging: { info() {} } })`,
    );
    expect(result.timedOut).toBe(false);

    // macOS `cp -R selfsrc selfsrc/x` copies exactly one level and stops.
    // Whatever yavascript decides to do, it must not recurse without bound.
    const countEntries = (dir: string): number =>
      fs.readdirSync(dir, { withFileTypes: true }).reduce((total, entry) => {
        return (
          total +
          1 +
          (entry.isDirectory() ? countEntries(path.join(dir, entry.name)) : 0)
        );
      }, 0);
    expect(countEntries(source)).toBeLessThan(20);
  },
  HANG_TEST_TIMEOUT,
);

test("copy - into an existing tree merges instead of nesting subdirectories", async () => {
  const source = scratch("src");
  const target = scratch("dst");

  fs.mkdirSync(path.join(source, "sub"), { recursive: true });
  fs.mkdirSync(path.join(source, "emptydir"), { recursive: true });
  fs.writeFileSync(path.join(source, "a.txt"), "A");
  fs.writeFileSync(path.join(source, "sub", "b.txt"), "B");

  const result = await evaluate(
    `for (let i = 0; i < 3; i++) copy(${JSON.stringify(source)}, ${JSON.stringify(target)}, { whenTargetExists: "overwrite", logging: { info() {} } })`,
  );
  expect(result.code).toBe(0);

  // Three runs of `cp -R src dst` give exactly this, no deeper.
  const copied = path.join(target, "src");
  expect(fs.readdirSync(copied).sort()).toEqual(["a.txt", "emptydir", "sub"]);
  expect(fs.readdirSync(path.join(copied, "sub"))).toEqual(["b.txt"]);
  expect(fs.readdirSync(path.join(copied, "emptydir"))).toEqual([]);
});

test("copy - preserves directory modes", async () => {
  const source = scratch("modes-src");
  const target = scratch("modes-dst");

  fs.mkdirSync(path.join(source, "private"), { recursive: true });
  fs.chmodSync(path.join(source, "private"), 0o700);

  const result = await evaluate(
    `copy(${JSON.stringify(source)}, ${JSON.stringify(target)}, { logging: { info() {} } })`,
  );
  expect(result.code).toBe(0);

  expect(fs.statSync(path.join(target, "private")).mode & 0o777).toBe(0o700);
});

test("copy - a failed copy reports the real error and leaves the target alone", async () => {
  const source = scratch("ro-src.txt");
  const target = scratch("ro-target.txt");

  fs.writeFileSync(source, "SRC");
  fs.utimesSync(
    source,
    new Date("2020-01-02T03:04:00Z"),
    new Date("2020-01-02T03:04:00Z"),
  );
  fs.writeFileSync(target, "RO TARGET");
  fs.chmodSync(target, 0o444);
  const mtimeBefore = fs.statSync(target).mtimeMs;

  const result = await evaluate(
    `copy(${JSON.stringify(source)}, ${JSON.stringify(target)}, { whenTargetExists: "overwrite", logging: { info() {} } })`,
  );
  expect(result.code).not.toBe(0);
  expect(result.stderr).toMatch(/Permission denied/);

  expect(fs.readFileSync(target, "utf-8")).toBe("RO TARGET");
  expect(fs.statSync(target).mtimeMs).toBe(mtimeBefore);
});

test("copy - a failed open isn't masked by a utimes error", async () => {
  const source = scratch("src.txt");
  const roDir = scratch("ro-dir");

  fs.writeFileSync(source, "x");
  fs.mkdirSync(roDir, { recursive: true });
  fs.chmodSync(roDir, 0o555);

  const result = await evaluate(
    `copy(${JSON.stringify(source)}, ${JSON.stringify(roDir)}, { logging: { info() {} } })`,
  );
  expect(result.code).not.toBe(0);
  expect(result.stderr).toMatch(/Permission denied/);
});

// ---------------------------------------------------------------------------
// readFile on non-regular files
// ---------------------------------------------------------------------------

test(
  "readFile - string mode reads a fifo in full",
  async () => {
    const fifo = makeFifo("readfile-string-fifo", "hello from a pipe\n");
    const result = await evaluateWithTimeout(
      `JSON.stringify(readFile(${JSON.stringify(fifo.path)}))`,
    );
    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: JSON.stringify("hello from a pipe\n") + "\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test("readFile - binary mode reads a fifo in full", async () => {
  const fifo = makeFifo("readfile-fifo");
  const result = await evaluate(
    `readFile(${JSON.stringify(fifo.path)}, { binary: true }).byteLength`,
  );
  expect(result.stdout.trim()).toBe(String(FIFO_PAYLOAD_SIZE));
});

test("cat - reads a fifo in full", async () => {
  const fifo = makeFifo("cat-fifo");
  const result = await evaluate(`cat(${JSON.stringify(fifo.path)}).length`);
  expect(result.stdout.trim()).toBe(String(FIFO_PAYLOAD_SIZE));
});

// ---------------------------------------------------------------------------
// rename
// ---------------------------------------------------------------------------

test("rename - resolves paths the way the OS does, not lexically", async () => {
  const dir = scratchDir();
  fs.mkdirSync(scratch("real/deep"), { recursive: true });
  fs.writeFileSync(scratch("real/x.txt"), "REAL");
  fs.writeFileSync(scratch("x.txt"), "CWD");
  fs.symlinkSync("real/deep", scratch("L"));

  // "L/../x.txt" means real/x.txt to the OS, and that's what readFile reads.
  const result = await evaluate(
    `const before = readFile("L/../x.txt"); rename("L/../x.txt", "moved.txt"); JSON.stringify([before, readFile("moved.txt")])`,
    { cwd: dir },
  );
  expect(result.code).toBe(0);
  expect(result.stdout.trim()).toBe(`["REAL","REAL"]`);

  expect(fs.existsSync(scratch("real/x.txt"))).toBe(false);
  expect(fs.readFileSync(scratch("x.txt"), "utf-8")).toBe("CWD");
});
