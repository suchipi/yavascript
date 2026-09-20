import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

test("logger is present", async () => {
  const result = await evaluate(`logger`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     get info: Function "get info" {}
     set info: Function "set info" {}
     get trace: Function "get trace" {}
     set trace: Function "set trace" {}
     get warn: Function "get warn" {}
     set warn: Function "set warn" {}
   }
   ",
   }
  `);
});

test("logger.info defaults to writing to stderr", async () => {
  const result = await evaluate(
    `logger.info("test bla bla", 45, { yes: true })`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
    `logger.trace("test bla bla", 45, { yes: true })`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "exec: true
   ",
     "stdout": "first
   second
   exec: true
   ",
   }
  `);
});

test("logger.info writes no ANSI escapes to a non-terminal stderr", async () => {
  const result = await evaluate(`logger.info("msg")`, { cleanResult: false });
  expect(result).toMatchObject({ code: 0, stdout: "", stderr: "msg\n" });
});

test("logger.warn writes no ANSI escapes to a non-terminal stderr", async () => {
  const result = await evaluate(`logger.warn("careful")`, {
    cleanResult: false,
  });
  expect(result).toMatchObject({ code: 0, stdout: "", stderr: "careful\n" });
});

test("logger output has no ANSI escapes when CLICOLOR is 0", async () => {
  const result = await evaluate(
    `logger.info("msg"); logger.warn("careful"); exec("true");`,
    { cleanResult: false, env: { ...process.env, CLICOLOR: "0" } },
  );
  expect(result).toMatchObject({
    code: 0,
    stdout: "",
    stderr: "msg\ncareful\nexec: true\n",
  });
});

test("modifying logger.trace affects logging of API functions", async () => {
  const result = await evaluate(
    `
      logger.trace = console.error;
      exec("true");
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
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
