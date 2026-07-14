import {
  evaluate,
  removeSanitizer,
  restoreSanitizer,
  runYavascript,
  rootDir,
} from "./test-helpers";

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
     "stderr": "AssertionError: Assertion failed (value = false)
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

describe("stack trimming", () => {
  // Remove the sanitizers that collapse frames to "at somewhere" and redact
  // line/column numbers, so the mapped locations are visible in the snapshots.
  beforeAll(() => {
    removeSanitizer("collapseStackTrace");
    removeSanitizer("redactLineAndColumnNumbers");
  });

  afterAll(() => {
    restoreSanitizer("collapseStackTrace");
    restoreSanitizer("redactLineAndColumnNumbers");
  });

  test("top of error stack points to assert call rather than internals", async () => {
    const fixturePath = rootDir("meta/tests/fixtures/assert/sample-assert.js");

    const result = await runYavascript([fixturePath]);
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 1,
       "error": null,
       "stderr": "AssertionError: nah! (value = false)
       at two (<rootDir>/meta/tests/fixtures/assert/sample-assert.js:6:9)
       at one (<rootDir>/meta/tests/fixtures/assert/sample-assert.js:2:6)
       at <anonymous> (<rootDir>/meta/tests/fixtures/assert/sample-assert.js:9:4)
     {
       fileName: "yavascript-internals/dist/bundles/layer1.js"
       lineNumber: 4757
       columnNumber: 10
       value: false
     }
     ",
       "stdout": "",
     }
    `);
  });
});
