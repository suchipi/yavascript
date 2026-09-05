import { expect, test } from "vitest";
import { evaluate, rootDir } from "./test-helpers";

const fixturesDir = rootDir.concat("meta/tests/fixtures/assert");

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

test("assert - falsy value with message in real file", async () => {
  const result = await evaluate(`
    require(${JSON.stringify(fixturesDir("throw-in-real-file.js"))});
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": null,
      "stderr": "Error: OHHH this is sad day!! at <rootDir>/meta/tests/fixtures/assert/throw-in-real-file.js:10:9
     9 | function inner() {
    10 |   assert(2 + 2 === 5, "OHHH this is sad day!!");
    11 | }
     (value = false)
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
