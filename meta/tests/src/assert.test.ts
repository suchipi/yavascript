import { evaluate } from "./test-helpers";

test("assert - truthy value", async () => {
  const result = await evaluate(`
    assert(2 + 2 === 4);
  `);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "",
   }
  `);
});

test("assert - falsy value", async () => {
  const result = await evaluate(`
    assert(2 + 2 === 5);
  `);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Error: Assertion failed (value = false)
     at somewhere
   {
     fileName: "yavascript-internal.js"
     lineNumber: <redacted>
     columnNumber: <redacted>
     value: false
   }
   ",
     "stdout": "",
   }
  `);
});
