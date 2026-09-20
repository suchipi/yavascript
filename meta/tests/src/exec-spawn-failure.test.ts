import { expect, test } from "vitest";
import { evaluate, rootDir } from "./test-helpers";

const onDarwin = process.platform === "darwin";
const onLinux = process.platform === "linux";

const MISSING_PROGRAM = "no-such-cmd-xyz";
const MISSING_CWD = rootDir("meta/tests/fixtures/definitely-not-here");
const NON_EXECUTABLE_FILE = rootDir("meta/tests/fixtures/glob/hi.txt");

const quiet = `{ logging: { info() {} } }`;

test("failOnNonZeroStatus: false returns instead of throwing when the program doesn't exist", async () => {
  const result = await evaluate(
    `console.log(JSON.stringify(exec(${JSON.stringify(MISSING_PROGRAM)}, { failOnNonZeroStatus: false, logging: { info() {} } })))`,
  );
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
});

test("failOnNonZeroStatus: false returns instead of throwing when the program isn't executable", async () => {
  const result = await evaluate(
    `console.log(JSON.stringify(exec([${JSON.stringify(NON_EXECUTABLE_FILE)}], { failOnNonZeroStatus: false, logging: { info() {} } })))`,
  );
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
});

test("failOnNonZeroStatus: false returns instead of throwing when the cwd doesn't exist", async () => {
  const result = await evaluate(
    `console.log(JSON.stringify(exec("true", { cwd: ${JSON.stringify(MISSING_CWD)}, failOnNonZeroStatus: false, logging: { info() {} } })))`,
  );
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
});

test("a spawn failure names the program that couldn't be run", async () => {
  const result = await evaluate(
    `exec(${JSON.stringify(MISSING_PROGRAM)}, ${quiet})`,
  );
  expect(result.code).not.toBe(0);
  expect(result.stderr).toContain(MISSING_PROGRAM);
});

test("a spawn failure caused by the cwd names the cwd", async () => {
  const result = await evaluate(
    `exec("true", { cwd: ${JSON.stringify(MISSING_CWD)}, logging: { info() {} } })`,
  );
  expect(result.code).not.toBe(0);
  expect(result.stderr).toContain("definitely-not-here");
});

test.runIf(onDarwin)(
  "a missing program is reported as a status, the way it is on other unixes",
  async () => {
    const result = await evaluate(
      `console.log(JSON.stringify(exec(${JSON.stringify(MISSING_PROGRAM)}, { failOnNonZeroStatus: false, logging: { info() {} } })))`,
    );
    expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
    expect(JSON.parse(result.stdout)).toEqual({ status: 127 });
  },
);

test.runIf(onLinux)("a missing program is reported as status 127", async () => {
  const result = await evaluate(
    `console.log(JSON.stringify(exec(${JSON.stringify(MISSING_PROGRAM)}, { failOnNonZeroStatus: false, logging: { info() {} } })))`,
  );
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  expect(JSON.parse(result.stdout)).toEqual({ status: 127 });
});
