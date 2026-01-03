import {
  evaluate,
  binaryPath,
  inspect,
  cleanResult,
  TMP,
} from "./test-helpers";

test("exec true - string", async () => {
  const result = await evaluate(`exec("true")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: true
    ",
      "stdout": "",
    }
  `);
});

test("exec true - array", async () => {
  const result = await evaluate(`exec(["true"])`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: true
    ",
      "stdout": "",
    }
  `);
});

test("exec true - Path", async () => {
  const result = await evaluate(`exec(new Path("/usr/bin/true"))`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: /usr/bin/true
    ",
      "stdout": "",
    }
  `);
});

test("exec false - string", async () => {
  const result = await evaluate(`exec("false")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "exec: false
    Error: Command failed: "false" (status = 1, signal = undefined)
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
  const result = await evaluate(`exec(["false"])`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "exec: false
    Error: Command failed: ["false"] (status = 1, signal = undefined)
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
  const result = await evaluate(`exec(new Path("/usr/bin/false"))`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "exec: /usr/bin/false
    Error: Command failed: "/usr/bin/false" (status = 1, signal = undefined)
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
      binaryPath,
    )}, "-e", "scriptArgs", "bla", "blah", "--", "haha"])`,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: <yavascript binary> -e scriptArgs bla blah -- haha
    ",
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
    ",
    }
  `);
});

test("exec with env vars", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(
      binaryPath,
    )}, "-e", "env"], { env: { HI_MOM: "yup" } })`,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: <yavascript binary> -e env
    ",
      "stdout": "{
      HI_MOM: "yup"
    }
    ",
    }
  `);
});

test("exec with cwd", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(binaryPath)}, "-e", "pwd()"], { cwd: "/tmp" })`,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: <yavascript binary> -e "pwd()"
    ",
      "stdout": "Path { /tmp }
    ",
    }
  `);
});

test("exec with env", async () => {
  const result = await evaluate(`exec(['env'], { env: { HI: 'yeah' } })`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: env
    ",
      "stdout": "HI=yeah
    ",
    }
  `);
});

test("exec with captureOutput true", async () => {
  const result = await evaluate(
    `exec(["echo", "hi there"], { captureOutput: true })`,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo "hi there"
    ",
      "stdout": "{
      stdout: "hi there\\n"
      stderr: ""
    }
    ",
    }
  `);
});

test("exec with captureOutput 'utf8'", async () => {
  const result = await evaluate(
    `exec(["echo", "hi there"], { captureOutput: "utf8" })`,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo "hi there"
    ",
      "stdout": "{
      stdout: "hi there\\n"
      stderr: ""
    }
    ",
    }
  `);
});

test("exec with captureOutput 'arraybuffer'", async () => {
  const result = await evaluate(
    `exec(["echo", "hi there"], { captureOutput: "arraybuffer" })`,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo "hi there"
    ",
      "stdout": "{
      stdout: ArrayBuffer {
        │0x00000000│ 68 69 20 74 68 65 72 65 0A
      }
      stderr: ArrayBuffer {}
    }
    ",
    }
  `);
});

test("exec with failOnNonZeroStatus false - running 'false'", async () => {
  const result = await evaluate(
    `exec(["false"], { failOnNonZeroStatus: false })`,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: false
      exec -> {"status":1}
    ",
      "stdout": "{
      status: 1
      signal: undefined
    }
    ",
    }
  `);
});

test("exec with failOnNonZeroStatus false - running 'true'", async () => {
  const result = await evaluate(
    `exec(["true"], { failOnNonZeroStatus: false })`,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: true
    ",
      "stdout": "{
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});

test("$ echo hi - string", async () => {
  const result = await evaluate(`$(\`echo hi\`)`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo hi
    ",
      "stdout": "{
      stdout: "hi\\n"
      stderr: ""
    }
    ",
    }
  `);
});

test("$ echo hi - array", async () => {
  const result = await evaluate(`$(["echo", "hi"])`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo hi
    ",
      "stdout": "{
      stdout: "hi\\n"
      stderr: ""
    }
    ",
    }
  `);
});

test("$ echo hi - array with Path", async () => {
  const result = await evaluate(`$(["echo", new Path("hi")])`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo hi
    ",
      "stdout": "{
      stdout: "hi\\n"
      stderr: ""
    }
    ",
    }
  `);
});

test("$ echo hi 2 - array with number", async () => {
  const result = await evaluate(`$(["echo", "hi", 2])`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo hi 2
    ",
      "stdout": "{
      stdout: "hi 2\\n"
      stderr: ""
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
      "stderr": "exec: false
    Error: Command failed: "false" (status = 1, signal = undefined)
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
  const result = await evaluate(`exec("bash -c 'echo hi'")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: bash -c "echo hi"
    ",
      "stdout": "hi
    ",
    }
  `);
});

test("exec's string parsing does not interpolate env vars", async () => {
  const result = await evaluate(`exec('echo $HI', { env: { HI: 'yeah' } })`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo "$HI"
    ",
      "stdout": "$HI
    ",
    }
  `);
});

test("exec's string parsing does not parse globs", async () => {
  const result = await evaluate(`exec('echo **/*')`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo "**/*"
    ",
      "stdout": "**/*
    ",
    }
  `);
});

test("logging", async () => {
  const result = await evaluate(`
    exec('echo hi', { logging: { trace: console.error } });
    exec(['echo', '   hi'], { logging: { trace: console.error } });
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: echo hi
    ChildProcess.start: [
      "echo"
      "hi"
    ]
    ChildProcess result: [
      "echo"
      "hi"
    ] -> {
      id: "EXITED"
      oldPid: <redacted>
      status: 0
    }
    exec: echo "   hi"
    ChildProcess.start: [
      "echo"
      "   hi"
    ]
    ChildProcess result: [
      "echo"
      "   hi"
    ] -> {
      id: "EXITED"
      oldPid: <redacted>
      status: 0
    }
    ",
      "stdout": "hi
       hi
    ",
    }
  `);
});

test("non-blocking", async () => {
  const result = await evaluate(`
    console.log("hi 1");
    const proc = exec("true", { block: false, logging: { trace: console.log } });
    console.log("hi 2");
    proc.wait();
    console.log("hi 3");
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: true
    ",
      "stdout": "hi 1
    ChildProcess.start: [
      "true"
    ]
    hi 2
    ChildProcess result: [
      "true"
    ] -> {
      id: "EXITED"
      oldPid: <redacted>
      status: 0
    }
    hi 3
    ",
    }
  `);
});

test("non-blocking with return value", async () => {
  const result = await evaluate(`
    console.log("hi 1");
    const proc = exec("printf yeah", { block: false, captureOutput: true });
    console.log("hi 2");
    const result = proc.wait();
    console.log("hi 3", result);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: printf yeah
    ",
      "stdout": "hi 1
    hi 2
    hi 3 {
      stdout: "yeah"
      stderr: ""
    }
    ",
    }
  `);
});

test("non-blocking with full return value", async () => {
  const result = await evaluate(`
    console.log("hi 1");
    const proc = exec("printf yeah", {
      block: false,
      captureOutput: true,
      failOnNonZeroStatus: false,
    });
    console.log("hi 2");
    const result = proc.wait();
    console.log("hi 3", result);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: printf yeah
    ",
      "stdout": "hi 1
    hi 2
    hi 3 {
      stdout: "yeah"
      stderr: ""
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});
