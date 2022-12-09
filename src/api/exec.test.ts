import {
  evaluate,
  binaryPath,
  inspect,
  cleanResult,
  TMP,
} from "../test-helpers";

test("exec true - string", async () => {
  const result = await evaluate(`exec("true")`);
  expect(result).toMatchSnapshot();
});

test("exec true - array", async () => {
  const result = await evaluate(`exec(["true"])`);
  expect(result).toMatchSnapshot();
});

test("exec false - string", async () => {
  const result = await evaluate(`exec("false")`);
  expect(result).toMatchSnapshot();
});

test("exec false - array", async () => {
  const result = await evaluate(`exec(["false"])`);
  expect(result).toMatchSnapshot();
});

test("exec - child process receives args", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(
      binaryPath
    )}, "-e", "scriptArgs", "bla", "blah", "--", "haha"])`
  );
  expect(result).toMatchSnapshot();
});

test("exec with env vars", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(
      binaryPath
    )}, "-e", "env"], { env: { HI_MOM: "yup" } })`
  );
  expect(result).toMatchSnapshot();
});

test("exec with cwd", async () => {
  const result = await evaluate(
    `exec([${JSON.stringify(binaryPath)}, "-e", "pwd()"], { cwd: "/tmp" })`
  );
  expect(result).toMatchSnapshot();
});

test("exec with env", async () => {
  const result = await evaluate(`exec(['env'], { env: { HI: 'yeah' } })`);
  expect(result).toMatchSnapshot();
});

test("exec with captureOutput true", async () => {
  const result = await evaluate(
    `exec(["echo", "hi there"], { captureOutput: true })`
  );
  expect(result).toMatchSnapshot();
});

test("exec with failOnNonZeroStatus false - running 'false'", async () => {
  const result = await evaluate(
    `exec(["false"], { failOnNonZeroStatus: false })`
  );
  expect(result).toMatchSnapshot();
});

test("exec with failOnNonZeroStatus false - running 'true'", async () => {
  const result = await evaluate(
    `exec(["true"], { failOnNonZeroStatus: false })`
  );
  expect(result).toMatchSnapshot();
});

test("$ echo hi - string", async () => {
  const result = await evaluate(`$(\`echo hi\`)`);
  expect(result).toMatchSnapshot();
});

test("$ echo hi - array", async () => {
  const result = await evaluate(`$(["echo", "hi"])`);
  expect(result).toMatchSnapshot();
});

test("$ false", async () => {
  const result = await evaluate(`$("false")`);
  expect(result).toMatchSnapshot();
});

test("exec parses arg string properly", async () => {
  const result = await evaluate(`exec("bash -c 'echo hi'")`);
  expect(result).toMatchSnapshot();
});

test("exec's string parsing does not interpolate env vars", async () => {
  const result = await evaluate(`exec('echo $HI', { env: { HI: 'yeah' } })`);
  expect(result).toMatchSnapshot();
});

test("exec's string parsing does not parse globs", async () => {
  const result = await evaluate(`exec('echo **/*')`);
  expect(result).toMatchSnapshot();
});

test("logging", async () => {
  const result = await evaluate(
    `exec('echo hi', { trace: console.error }); exec(['echo', '   hi'], { trace: console.error });`
  );
  expect(result).toMatchSnapshot();
});
