import { evaluate } from "./test-helpers";

test("logger is present", async () => {
  const result = await evaluate(`logger`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      get info: Function "get info" {}
      set info: Function "set info" {}
      get trace: Function "get trace" {}
      set trace: Function "set trace" {}
    }
    ",
    }
  `);
});

test("logger.info defaults to writing to stderr", async () => {
  const result = await evaluate(
    `logger.info("test bla bla", 45, { yes: true })`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "test bla bla 45 {
      yes: true
    }
    ",
      "stdout": "",
    }
  `);
});

test("logger.trace defaults to no-op function", async () => {
  const result = await evaluate(
    `logger.trace("test bla bla", 45, { yes: true })`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);
});

test("modifying logger.info affects logging of API functions", async () => {
  const result = await evaluate(
    `
      console.log("first");
      exec("true");
      // defaults to writing to stderr; this changes it to stdout
      logger.info = console.log;
      console.log("second");
      exec("true");
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: true
    ",
      "stdout": "first
    second
    exec: true
    ",
    }
  `);
});

test("modifying logger.trace affects logging of API functions", async () => {
  const result = await evaluate(
    `
      logger.trace = console.error;
      exec("true");
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: true
    ChildProcess.start: [
      "true"
    ]
    ChildProcess result: [
      "true"
    ] -> {
      id: "EXITED"
      oldPid: <redacted>
      status: 0
    }
    ",
      "stdout": "",
    }
  `);
});
