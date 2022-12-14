import { evaluate } from "./test-helpers";

test("prints thrown errors to stderr", async () => {
  const result = await evaluate(`blahhhh`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "ReferenceError: 'blahhhh' is not defined
      at <eval>
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
      "error": false,
      "stderr": "Non-error value was thrown: "nope"
    ",
      "stdout": "",
    }
  `);
});

test("prints extra error properties to stderr", async () => {
  const result = await evaluate(
    `e = new Error('hi'); e.something = true; e.somethingElse = false; throw e;`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: hi
      at <eval>
      something: true
      somethingElse: false
    }
    ",
      "stdout": "",
    }
  `);
});
