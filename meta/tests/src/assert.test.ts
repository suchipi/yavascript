import { expect, test } from "vitest";
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
      "stderr": "Error: Assertion failed at <rootDir>/<evalScript>:2:11 (value = false)
      at somewhere
    {
      fileName: "yavascript-internals/dist/bundles/layer1.js"
      lineNumber: <redacted>
      columnNumber: <redacted>
      value: false
    }
    ",
      "stdout": "",
    }
  `);
});

test("assert - falsy value with message", async () => {
  const result = await evaluate(`
    assert(2 + 2 === 5, "ohh this is bad!");
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": null,
      "stderr": "Error: ohh this is bad! at <rootDir>/<evalScript>:2:11 (value = false)
      at somewhere
    {
      fileName: "yavascript-internals/dist/bundles/layer1.js"
      lineNumber: <redacted>
      columnNumber: <redacted>
      value: false
    }
    ",
      "stdout": "",
    }
  `);
});
