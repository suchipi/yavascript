import {
  evaluate,
  binaryPath,
  inspect,
  cleanResult,
  TMP,
} from "../../test-helpers";

test("exec true - string", async () => {
  const result = await evaluate(`exec("true").wait()`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "ExecResult {
      stdioType: null
    }
    ",
    }
  `);
});

test("exec true - array", async () => {
  const result = await evaluate(`exec(["true"]).wait()`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "ExecResult {
      stdioType: null
    }
    ",
    }
  `);
});

test("exec true - Path", async () => {
  const result = await evaluate(`exec(new Path("/usr/bin/true")).wait()`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "ExecResult {
      stdioType: null
    }
    ",
    }
  `);
});

test("exec false - string", async () => {
  const result = await evaluate(`exec("false").wait()`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Command failed: "false" (status = 1, signal = undefined)
      at somewhere
    {
      status: 1
      signal: undefined
    }
    ",
      "stdout": "",
    }
  `);
});

test("exec false - array", async () => {
  const result = await evaluate(`exec(["false"]).wait()`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Command failed: ["false"] (status = 1, signal = undefined)
      at somewhere
    {
      status: 1
      signal: undefined
    }
    ",
      "stdout": "",
    }
  `);
});

test("exec false - Path", async () => {
  const result = await evaluate(`exec(new Path("/usr/bin/false")).wait()`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Command failed: "/usr/bin/false" (status = 1, signal = undefined)
      at somewhere
    {
      status: 1
      signal: undefined
    }
    ",
      "stdout": "",
    }
  `);
});

test("exec - child process receives args", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(
      binaryPath
    )}, "-e", "scriptArgs", "bla", "blah", "--", "haha"]).wait()`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      Frozen
      "<yavascript binary>"
      "-e"
      "scriptArgs"
      "bla"
      "blah"
      "--"
      "haha"
    ]
    ExecResult {
      stdioType: null
    }
    ",
    }
  `);
});

test("exec with env vars", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(
      binaryPath
    )}, "-e", "env"], { env: { HI_MOM: "yup" } }).wait()`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      HI_MOM: "yup"
    }
    ExecResult {
      stdioType: null
    }
    ",
    }
  `);
});

test("exec with cwd", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(
      binaryPath
    )}, "-e", "pwd()"], { cwd: "/tmp" }).wait()`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { /tmp }
    ExecResult {
      stdioType: null
    }
    ",
    }
  `);
});

test("exec with env", async () => {
  const result = await evaluate(
    `exec(['env'], { env: { HI: 'yeah' } }).wait()`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "HI=yeah
    ExecResult {
      stdioType: null
    }
    ",
    }
  `);
});

test("exec with captureOutput true", async () => {
  const result = await evaluate(`
    const result = exec(["echo", "hi there"], { captureOutput: true }).wait()
    const { stdout, stderr, status, signal } = result;
    ({ stdout, stderr, status, signal })
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      stdout: "hi there\\n"
      stderr: ""
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});

test("exec with captureOutput 'utf8'", async () => {
  const result = await evaluate(`
    const result = exec(["echo", "hi there"], { captureOutput: "utf8" }).wait()
    const { stdout, stderr, status, signal } = result;
    ({ stdout, stderr, status, signal })
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      stdout: "hi there\\n"
      stderr: ""
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});

test("exec with captureOutput 'arraybuffer'", async () => {
  const result = await evaluate(`
    const result = exec(["echo", "hi there"], { captureOutput: "arraybuffer" }).wait()
    const { stdout, stderr, status, signal } = result;
    ({ stdout, stderr, status, signal })
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      stdout: ArrayBuffer {
        │0x00000000│ 68 69 20 74 68 65 72 65 0A
      }
      stderr: ArrayBuffer {}
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});

test("exec with assertExitStatusZero false - running 'false'", async () => {
  const result = await evaluate(`
    const result = exec(["false"]).wait().assertExitStatusZero();
    const { status, signal } = result;
    ({ status, signal })
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      status: 1
      signal: undefined
    }
    ",
    }
  `);
});

test("exec with assertExitStatusZero false - running 'true'", async () => {
  const result = await evaluate(
    `
      const result = exec(["true"]).wait().assertExitStatusZero();
      const { status, signal } = result;
      ({ status, signal })
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});

test("$ echo hi - string", async () => {
  const result = await evaluate(`
    const result = $("echo hi");
    const { stdout, stderr, status, signal } = result;
    ({ stdout, stderr, status, signal })
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "ExecResult {
      stdioType: "utf8"
    }
    ",
    }
  `);
});

test("$ echo hi - array", async () => {
  const result = await evaluate(`
    const result = $(["echo", "hi"]);
    const { stdout, stderr, status, signal } = result;
    ({ stdout, stderr, status, signal })
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      stdout: "hi\\n"
      stderr: ""
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});

test("$ echo hi - array with Path", async () => {
  const result = await evaluate(`
    const result = $(["echo", new Path("hi")]);
    const { stdout, stderr, status, signal } = result;
    ({ stdout, stderr, status, signal })
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "ExecResult {
      stdioType: "utf8"
    }
    ",
    }
  `);
});

test("$ echo hi 2 - array with number", async () => {
  const result = await evaluate(`
    const result = $(["echo", "hi", 2]);
    const { stdout, stderr, status, signal } = result;
    ({ stdout, stderr, status, signal })
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      stdout: "hi 2\\n"
      stderr: ""
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});

test("$ false", async () => {
  const result = await evaluate(`$("false")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Command failed: "false" (status = 1, signal = undefined)
      at somewhere
    {
      status: 1
      signal: undefined
      stdout: ""
      stderr: ""
    }
    ",
      "stdout": "",
    }
  `);
});

test("exec parses arg string properly", async () => {
  const result = await evaluate(`void exec("bash -c 'echo hi'").wait()`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hi
    ",
    }
  `);
});

test("exec's string parsing does not interpolate env vars", async () => {
  const result = await evaluate(
    `void exec('echo $HI', { env: { HI: 'yeah' } }).wait()`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "$HI
    ",
    }
  `);
});

test("exec's string parsing does not expand globs", async () => {
  const result = await evaluate(`void exec('echo **/*').wait()`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "**/*
    ",
    }
  `);
});

test("logging", async () => {
  const result = await evaluate(
    `void exec('echo hi', { trace: console.error }).wait(); exec(['echo', '   hi'], { trace: console.error }).wait();`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "ChildProcess.start: [
      "echo"
      "hi"
    ]
    ChildProcess result: [
      "echo"
      "hi"
    ] -> {
      status: 0
      signal: undefined
    }
    ChildProcess.start: [
      "echo"
      "   hi"
    ]
    ChildProcess result: [
      "echo"
      "   hi"
    ] -> {
      status: 0
      signal: undefined
    }
    ",
      "stdout": "hi
       hi
    ",
    }
  `);
});
