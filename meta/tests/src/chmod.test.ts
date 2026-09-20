import { afterAll, beforeEach, expect, test } from "vitest";
import fs from "fs";
import { evaluate, rootDir } from "./test-helpers";

const scratchDir = rootDir.concat("meta/tests/fixtures/chmod-scratch");

const clean = () => {
  for (const child of fs.readdirSync(scratchDir())) {
    if (child.startsWith(".")) continue;
    fs.rmSync(scratchDir(child), { recursive: true, force: true });
  }
};

beforeEach(clean);
afterAll(clean);

function makeFile(name: string, mode: number) {
  const file = scratchDir(name);
  fs.writeFileSync(file, "");
  fs.chmodSync(file, mode);
  return file;
}

const modeOf = (file: string) => (fs.statSync(file).mode & 0o777).toString(8);

test('chmod - "remove" of a bit that is not set leaves it off', async () => {
  const file = makeFile("unset-bit", 0o644);

  const result = await evaluate(
    `chmod("remove", { user: "x" }, ${JSON.stringify(file)})`,
  );
  expect(result.code).toBe(0);

  // `chmod u-x` on a 644 file leaves it at 644.
  expect(modeOf(file)).toBe("644");
});

test('chmod - "remove" of several classes only clears the bits named', async () => {
  const file = makeFile("multi-class", 0o664);

  const result = await evaluate(
    `chmod("remove", { group: "w", others: "w" }, ${JSON.stringify(file)})`,
  );
  expect(result.code).toBe(0);

  // `chmod go-w` on a 664 file gives 644.
  expect(modeOf(file)).toBe("644");
});

test('chmod - "go" targets group and others', async () => {
  const file = makeFile("go", 0o644);

  const result = await evaluate(
    `chmod("add", { go: "x" }, ${JSON.stringify(file)})`,
  );
  expect(result.code).toBe(0);

  // `chmod go+x` on a 644 file gives 655.
  expect(modeOf(file)).toBe("655");
});

test("chmod - a JS-style octal string isn't truncated into a different mode", async () => {
  const file = makeFile("js-octal", 0o644);

  const result = await evaluate(`chmod("0o755", ${JSON.stringify(file)})`);

  // Accepting "0o755" and rejecting it are both defensible; applying some
  // other mode is not.
  if (result.code === 0) {
    expect(modeOf(file)).toBe("755");
  } else {
    expect(modeOf(file)).toBe("644");
  }
});

test("chmod - a string with non-octal characters is rejected", async () => {
  const file = makeFile("garbage", 0o644);

  const outcomes: Array<{ input: string; code: number | null; mode: string }> =
    [];
  for (const input of ["789", "75x"]) {
    fs.chmodSync(file, 0o644);
    const result = await evaluate(
      `chmod(${JSON.stringify(input)}, ${JSON.stringify(file)})`,
    );
    outcomes.push({ input, code: result.code, mode: modeOf(file) });
  }

  expect(outcomes).toEqual([
    { input: "789", code: 1, mode: "644" },
    { input: "75x", code: 1, mode: "644" },
  ]);
});
