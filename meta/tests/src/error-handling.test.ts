import { evaluate } from "./test-helpers";

test("prints thrown errors to stderr", async () => {
  const result = await evaluate(`blahhhh`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "ReferenceError: 'blahhhh' is not defined
     at somewhere
   {
     fileName: "<internal>/quickjs.c"
     lineNumber: <redacted>
     columnNumber: <redacted>
   }
   ",
     "stdout": "",
   }
  `);
});

test("prints thrown non-errors to stderr", async () => {
  const result = await evaluate(`throw "nope"`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Non-error value was thrown: "nope"
   ",
     "stdout": "",
   }
  `);
});

test("prints extra error properties to stderr", async () => {
  const result = await evaluate(
    `e = new Error('hi'); e.something = true; e.somethingElse = false; throw e;`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Error: hi
     at somewhere
   {
     fileName: "<rootDir>/<evalScript>"
     lineNumber: <redacted>
     columnNumber: <redacted>
     something: true
     somethingElse: false
   }
   ",
     "stdout": "",
   }
  `);
});
