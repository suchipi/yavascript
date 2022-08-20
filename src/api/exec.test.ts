///<reference types="@test-it/core/globals" />
import { evaluate, binaryPath } from "../test-helpers";
import { inspect } from "./inspect";

test("exec true - string", async () => {
  const result = await evaluate(`exec("true")`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });
});

test("exec true - array", async () => {
  const result = await evaluate(`exec(["true"])`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "",
  });
});

test("exec false - string", async () => {
  const result = await evaluate(`exec("false")`);
  expect(result).toEqual({
    code: 1,
    error: false,
    stderr: `Error: Command failed: [\"false\"]
    at exec (yavascript-internal.js:987)
    at <eval> (<evalScript>)

`,
    stdout: "",
  });
});

test("exec false - array", async () => {
  const result = await evaluate(`exec(["false"])`);
  expect(result).toEqual({
    code: 1,
    error: false,
    stderr: `Error: Command failed: [\"false\"]
    at exec (yavascript-internal.js:987)
    at <eval> (<evalScript>)

`,
    stdout: "",
  });
});

test("exec - child process receives args", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(
      binaryPath
    )}, "-e", "scriptArgs", "bla", "blah", "--", "haha"])`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect([binaryPath, "-e", "scriptArgs", "bla", "blah", "--", "haha"]) +
      "\n",
  });
});

test("exec with env vars", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(
      binaryPath
    )}, "-e", "env"], { env: { HI_MOM: "yup" } })`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect({ HI_MOM: "yup" }) + "\n",
  });
});

test("exec with cwd", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(binaryPath)}, "-e", "pwd()"], { cwd: "/tmp" })`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "/tmp\n",
  });
});

test("exec with captureOutput true", async () => {
  const result = await evaluate(
    `exec(["echo", "hi there"], { captureOutput: true })`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect({
        status: 0,
        stderr: "",
        stdout: "hi there\n",
      }) + "\n",
  });
});

test("exec with failOnNonZeroStatus false - running 'false'", async () => {
  const result = await evaluate(
    `exec(["false"], { failOnNonZeroStatus: false })`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect({
        status: 1,
      }) + "\n",
  });
});

test("exec with failOnNonZeroStatus false - running 'true'", async () => {
  const result = await evaluate(
    `exec(["true"], { failOnNonZeroStatus: false })`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect({
        status: 0,
      }) + "\n",
  });
});

test("$ echo hi - string", async () => {
  const result = await evaluate(`$(\`echo hi\`)`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect({
        status: 0,
        stderr: "",
        stdout: "hi\n",
      }) + "\n",
  });
});

test("$ echo hi - array", async () => {
  const result = await evaluate(`$(["echo", "hi"])`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect({
        status: 0,
        stderr: "",
        stdout: "hi\n",
      }) + "\n",
  });
});

test("$ false", async () => {
  const result = await evaluate(`$("false")`);
  expect(result).toEqual({
    code: 1,
    error: false,
    stdout: "",
    stderr: `Error: Command failed: [\"false\"]
    at exec (yavascript-internal.js:987)
    at $ (yavascript-internal.js:1028)
    at <eval> (<evalScript>)

`,
  });
});

test("exec parses arg string properly", async () => {
  const result = await evaluate(`exec("bash -c 'echo hi'")`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stdout: "hi\n",
    stderr: "",
  });
});

test("exec's string parsing does not interpolate env vars", async () => {
  const result = await evaluate(`exec('echo $HI', { env: { HI: 'yeah' } })`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stdout: "$HI\n",
    stderr: "",
  });
});
