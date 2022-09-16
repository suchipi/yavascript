///<reference types="@test-it/core/globals" />
import { evaluate, binaryPath, inspect, cleanResult } from "../test-helpers";

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
  expect(cleanResult(result)).toEqual({
    code: 1,
    error: false,
    stderr: `Error: Command failed: [\"false\"] (status = 1, signal = undefined)
  at makeErrorWithProperties (yavascript-internal.js)
  at exec (yavascript-internal.js)
  at <eval> (<evalScript>) ${inspect({ status: 1, signal: undefined })}\n`,
    stdout: "",
  });
});

test("exec false - array", async () => {
  const result = await evaluate(`exec(["false"])`);
  expect(cleanResult(result)).toEqual({
    code: 1,
    error: false,
    stderr: `Error: Command failed: [\"false\"] (status = 1, signal = undefined)
  at makeErrorWithProperties (yavascript-internal.js)
  at exec (yavascript-internal.js)
  at <eval> (<evalScript>) ${inspect({ status: 1, signal: undefined })}\n`,
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

test("exec with env", async () => {
  const result = await evaluate(`exec(['env'], { env: { HI: 'yeah' } })`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "HI=yeah\n",
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
        stdout: "hi there\n",
        stderr: "",
        status: 0,
        signal: undefined,
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
        signal: undefined,
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
        signal: undefined,
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
        stdout: "hi\n",
        stderr: "",
        status: 0,
        signal: undefined,
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
        stdout: "hi\n",
        stderr: "",
        status: 0,
        signal: undefined,
      }) + "\n",
  });
});

test("$ false", async () => {
  const result = await evaluate(`$("false")`);
  expect(cleanResult(result)).toEqual({
    code: 1,
    error: false,
    stdout: "",
    stderr: `Error: Command failed: [\"false\"] (status = 1, signal = undefined)
  at makeErrorWithProperties (yavascript-internal.js)
  at exec (yavascript-internal.js)
  at $ (yavascript-internal.js)
  at <eval> (<evalScript>) ${inspect({ status: 1, signal: undefined })}\n`,
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

test("exec's string parsing does not parse globs", async () => {
  const result = await evaluate(`exec('echo **/*')`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stdout: "**/*\n",
    stderr: "",
  });
});

test("logging", async () => {
  const result = await evaluate(
    `exec.enableLogging(); exec('echo hi'); exec(['echo', '   hi']);`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: [
      `+ exec: ["echo","hi"]`,
      `+ exec result: ["echo","hi"] -> {"status":0}`,
      `+ exec: ["echo","   hi"]`,
      `+ exec result: ["echo","   hi"] -> {"status":0}`,
      ``,
    ].join("\n"),
    stdout: "hi\n   hi\n",
  });
});
