import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

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
