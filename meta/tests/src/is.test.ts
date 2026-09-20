import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

// Reports a throw or a non-boolean in place of the answer, so that a failure
// shows what `is` actually did instead of just "not false".
const checkHelper = `
  const check = (value, type) => {
    try {
      const result = is(value, type);
      return typeof result === "boolean"
        ? result
        : "non-boolean: " + String(result);
    } catch (err) {
      return "threw: " + err.message;
    }
  };
`;

test("is - Error and its subclasses reject non-Error values", async () => {
  const script = `
    ${checkHelper}
    JSON.stringify([
      check(42, Error),
      check("hi", TypeError),
      check({}, RangeError),
      check(new Error("x"), Error),
      check(new TypeError("x"), TypeError),
      check(new TypeError("x"), Error),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "[false,false,false,true,true,true]\n",
  });
});

test("is - built-in constructors that can't be called without new check for instances", async () => {
  const script = `
    ${checkHelper}
    JSON.stringify([
      check(Promise.resolve(), Promise),
      check({}, Promise),
      check(new WeakMap(), WeakMap),
      check({}, WeakMap),
      check(new BigInt64Array(1), BigInt64Array),
      check(new Int8Array(1), BigInt64Array),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "[true,false,true,false,true,false]\n",
  });
});

test("is - yavascript's own classes check for instances", async () => {
  const script = `
    ${checkHelper}
    JSON.stringify([
      check(new ChildProcess(["true"]), ChildProcess),
      check({}, ChildProcess),
      check(new Context(), Context),
      check({}, Context),
      check({}, GitRepo),
      check({}, InteractivePrompt),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "[true,false,true,false,false,false]\n",
  });
});

test("is - an ES5 constructor function is checked with instanceof, not called", async () => {
  const script = `
    ${checkHelper}
    let calls = 0;
    function Legacy() {
      calls++;
    }
    const instance = new Legacy();
    JSON.stringify([check(instance, Legacy), check({}, Legacy), calls]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "[true,false,1]\n",
  });
});

test('is - a validator whose source text mentions "class " is still used as a validator', async () => {
  const script = `
    ${checkHelper}
    const isThing = (value) => /* the class of thing */ value != null;
    const isClassName = (value) =>
      typeof value === "string" && value.startsWith("class ");

    JSON.stringify([
      check(1, isThing),
      check({}, isThing),
      check("class Foo", isClassName),
      check("nope", isClassName),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "[true,true,true,false]\n",
  });
});

test("is - symbol-keyed properties in an object shape are checked", async () => {
  const script = `
    const k = Symbol("k");
    JSON.stringify([
      is({ [k]: 5 }, { [k]: String }),
      is({ [k]: "x" }, { [k]: String }),
      types.objectWithProperties({ [k]: types.string })({}),
      types.objectWithOnlyTheseProperties({ [k]: String })({ [k]: "x" }),
      types.partialObjectWithProperties({ [k]: String })({ [k]: 5 }),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "[false,true,false,true,false]\n",
  });
});

test("is - array holes fail element checks", async () => {
  const script = `
    JSON.stringify([
      is([1, , 3], [Number]),
      is([1, 2, 3], [Number]),
      is(new Array(3), [String]),
      is([, 2], [Number, Number]),
      is([1, 2], [Number, Number]),
      types.tuple(Number, Number)([, 2]),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "[false,true,false,false,true,false]\n",
  });
});

test("is - returns a boolean", async () => {
  const script = `
    JSON.stringify([
      typeof is(1, (value) => "yes"),
      typeof is(1, async (value) => false),
      typeof is(1, types.arrayOf),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '["boolean","boolean","boolean"]\n',
  });
});

test("types.record - a Number key type matches numeric keys", async () => {
  const script = `
    JSON.stringify([
      types.record(Number, String)({ 1: "a" }),
      types.record(Number, String)({ 1: 2 }),
      types.record(Number, String)({ a: "b" }),
      types.record(String, String)({ 1: "a" }),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "[true,false,false,true]\n",
  });
});
