import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

test("assert.type - global constructor, pass", async () => {
  const result = await evaluate(`
    assert.type(2, number);
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

test("assert.type - types namespace, pass", async () => {
  const result = await evaluate(`
    assert.type(2, types.number);
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

test("assert.type - global constructor, fail", async () => {
  const result = await evaluate(`
    assert.type(2, string);
  `);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "TypeError: Expected value of type string, but received 2
     at somewhere
   {
     fileName: "yavascript-internals/dist/bundles/layer1.js"
     lineNumber: <redacted>
     columnNumber: <redacted>
   }
   ",
     "stdout": "",
   }
  `);
});

test("assert.type - types.namespace, fail", async () => {
  const result = await evaluate(`
    assert.type(2, types.string);
  `);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "TypeError: Expected value of type string, but received 2
     at somewhere
   {
     fileName: "yavascript-internals/dist/bundles/layer1.js"
     lineNumber: <redacted>
     columnNumber: <redacted>
   }
   ",
     "stdout": "",
   }
  `);
});

test("assert.type - custom class, pass", async () => {
  const result = await evaluate(`
    class Something {}
    const something = new Something();

    assert.type(something, Something);
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

test("assert.type - custom class, fail", async () => {
  const result = await evaluate(`
    class Something {}
    assert.type(null, Something);
  `);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "TypeError: Expected value of type instanceOf(Something), but received null
     at somewhere
   {
     fileName: "yavascript-internals/dist/bundles/layer1.js"
     lineNumber: <redacted>
     columnNumber: <redacted>
   }
   ",
     "stdout": "",
   }
  `);
});

// Reports the outcome of a single assert.type call, so that a failure shows
// whether it passed, rejected the value, or blew up on the type itself.
const outcomeHelper = `
  const outcome = (fn) => {
    try {
      fn();
      return "accepted";
    } catch (err) {
      const isRejection =
        err instanceof TypeError &&
        err.message.startsWith("Expected value of type ");
      return isRejection
        ? "rejected"
        : err.constructor.name + ": " + err.message;
    }
  };
`;

test("assert.type - Error and its subclasses reject non-Error values", async () => {
  const script = `
    ${outcomeHelper}
    JSON.stringify([
      outcome(() => assert.type(42, Error)),
      outcome(() => assert.type("hi", TypeError)),
      outcome(() => assert.type({}, RangeError)),
      outcome(() => assert.type(new Error("x"), Error)),
      outcome(() => assert.type(new TypeError("x"), TypeError)),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '["rejected","rejected","rejected","accepted","accepted"]\n',
  });
});

test("assert.type - constructors that can't be called without new check for instances", async () => {
  const script = `
    ${outcomeHelper}
    JSON.stringify([
      outcome(() => assert.type(Promise.resolve(), Promise)),
      outcome(() => assert.type({}, Promise)),
      outcome(() => assert.type(new WeakMap(), WeakMap)),
      outcome(() => assert.type(new ChildProcess(["true"]), ChildProcess)),
      outcome(() => assert.type({}, ChildProcess)),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '["accepted","rejected","accepted","accepted","rejected"]\n',
  });
});
