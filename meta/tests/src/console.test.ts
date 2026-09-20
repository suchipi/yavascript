import { afterAll, beforeEach, expect, test } from "vitest";
import fs from "fs";
import { spawnSync } from "child_process";
import { binaryPath, evaluate, inspect, rootDir } from "./test-helpers";

const scratchDir = rootDir.concat("meta/tests/fixtures/console-scratch");
const scratch = (...parts: Array<string>) => scratchDir(...parts);

const cleanScratch = () => {
  for (const child of fs.readdirSync(scratchDir())) {
    if (child.startsWith(".")) continue;
    fs.rmSync(scratchDir(child), { recursive: true, force: true });
  }
};

beforeEach(cleanScratch);
afterAll(cleanScratch);

function shellQuote(str: string): string {
  return `'${str.replaceAll("'", `'\\''`)}'`;
}

/**
 * Runs code with stdout and stderr pointed at the same pipe, which is the only
 * way to see which of the two streams was written to first.
 */
function runWithMergedOutput(code: string): string {
  const run = spawnSync(
    "sh",
    ["-c", `"$1" -e "$2" 2>&1`, "sh", binaryPath, code],
    { cwd: rootDir(), encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] },
  );
  if (run.error) throw run.error;
  return run.stdout;
}

/**
 * Runs code with stdout attached to a terminal and stderr redirected to a
 * file. `script` is the only portable way to hand a child process a pty, and
 * its argument order differs between BSD and util-linux.
 */
function runWithStdoutOnATerminal(code: string, stderrFile: string): void {
  fs.writeFileSync(
    scratch("run.sh"),
    `${shellQuote(binaryPath)} -e ${shellQuote(code)} 2> ${shellQuote(stderrFile)}\n`,
  );

  const args =
    process.platform === "darwin"
      ? ["-q", "/dev/null", "sh", "run.sh"]
      : ["-q", "-c", "sh run.sh", "/dev/null"];

  const run = spawnSync("script", args, {
    cwd: scratchDir(),
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (run.error) throw run.error;
}

test("console.log string", async () => {
  const result = await evaluate(`console.log("hi");`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "hi
   ",
   }
  `);
});

test("console.info string", async () => {
  const result = await evaluate(`console.info("hi");`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "hi
   ",
   }
  `);
});

test("console.warn string", async () => {
  const result = await evaluate(`console.warn("hi");`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "hi
   ",
     "stdout": "",
   }
  `);
});

test("console.error string", async () => {
  const result = await evaluate(`console.error("hi");`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "hi
   ",
     "stdout": "",
   }
  `);
});

test("console.log object", async () => {
  const result = await evaluate(`console.log({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     hi: true
   }
   ",
   }
  `);
});

test("console.info object", async () => {
  const result = await evaluate(`console.info({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     hi: true
   }
   ",
   }
  `);
});

test("console.warn object", async () => {
  const result = await evaluate(`console.warn({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "{
     hi: true
   }
   ",
     "stdout": "",
   }
  `);
});

test("console.error object", async () => {
  const result = await evaluate(`console.error({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "{
     hi: true
   }
   ",
     "stdout": "",
   }
  `);
});

test("console.log multiple", async () => {
  const result = await evaluate(`console.log("hi", { hi: true }, "hi again");`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "hi {
     hi: true
   } hi again
   ",
   }
  `);
});

test("console.info multiple", async () => {
  const result = await evaluate(
    `console.info("hi", { hi: true }, "hi again");`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "hi {
     hi: true
   } hi again
   ",
   }
  `);
});

test("console.warn multiple", async () => {
  const result = await evaluate(
    `console.warn("hi", { hi: true }, "hi again");`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "hi {
     hi: true
   } hi again
   ",
     "stdout": "",
   }
  `);
});

test("console.error multiple", async () => {
  const result = await evaluate(
    `console.error("hi", { hi: true }, "hi again");`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "hi {
     hi: true
   } hi again
   ",
     "stdout": "",
   }
  `);
});

// ---------------------------------------------------------------------------
// ordering of writes when stdout isn't a terminal
// ---------------------------------------------------------------------------

test("console.log output lands on stdout before a child process writes to it", async () => {
  const result = await evaluate(
    `
      console.log("1 parent out");
      exec(["echo", "2 child out"], { logging: { info() {} } });
      console.log("3 parent out");
    `,
  );
  expect(result).toMatchObject({
    code: 0,
    stdout: "1 parent out\n2 child out\n3 parent out\n",
  });
});

test("console.log and console.error land on a shared stream in call order", () => {
  const output = runWithMergedOutput(
    `console.log("1 out"); console.error("2 err"); console.log("3 out");`,
  );
  expect(output).toBe("1 out\n2 err\n3 out\n");
});

test("console.log output lands on stdout before an uncaught error is printed", () => {
  const output = runWithMergedOutput(
    `console.log("before throw"); throw new Error("boom");`,
  );
  expect(output.split("\n")[0]).toBe("before throw");
});

// ---------------------------------------------------------------------------
// which stream decides colorization
// ---------------------------------------------------------------------------

test("console.error doesn't colorize when stderr isn't a terminal", () => {
  const stderrFile = scratch("stderr.txt");
  runWithStdoutOnATerminal(`console.error({ a: 1 })`, stderrFile);

  expect(fs.readFileSync(stderrFile, "utf-8")).toBe("{\n  a: 1\n}\n");
});

// ---------------------------------------------------------------------------
// values that can't be inspected
// ---------------------------------------------------------------------------

test("console.log survives a value that can't be inspected or stringified", async () => {
  const result = await evaluate(`
    const revocable = Proxy.revocable({}, {});
    revocable.revoke();
    console.log("v:", revocable.proxy);
    console.log("after");
  `);
  expect(result.stdout).toMatch(/\nafter\n$/);
  expect(result.code).toBe(0);
});
