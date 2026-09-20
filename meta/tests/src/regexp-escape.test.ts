import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

test("RegExp.escape output is safe inside a character class", async () => {
  const result = await evaluate(`
    JSON.stringify({
      escaped: RegExp.escape("a-c"),
      matchesB: new RegExp("[" + RegExp.escape("a-c") + "]").test("b"),
    })
  `);
  expect(result).toMatchObject({ code: 0, stderr: "" });

  expect(JSON.parse(result.stdout)).toEqual({
    escaped: "\\x61\\x2dc",
    matchesB: false,
  });
});

test("RegExp.escape escapes what the language spec says to escape", async () => {
  const result = await evaluate(`
    JSON.stringify({
      "a-c": RegExp.escape("a-c"),
      "a/b": RegExp.escape("a/b"),
      "1abc": RegExp.escape("1abc"),
      "abc": RegExp.escape("abc"),
      " \\t\\n": RegExp.escape(" \\t\\n"),
    })
  `);
  expect(result).toMatchObject({ code: 0, stderr: "" });

  expect(JSON.parse(result.stdout)).toEqual({
    "a-c": "\\x61\\x2dc",
    "a/b": "\\x61\\/b",
    "1abc": "\\x31abc",
    abc: "\\x61bc",
    " \t\n": "\\x20\\t\\n",
  });
});

test("RegExp.escape rejects a non-string input", async () => {
  const result = await evaluate(`
    let outcome = "no error";
    try {
      RegExp.escape(123);
    } catch (err) {
      outcome = err.constructor.name;
    }
    outcome
  `);
  expect(result).toMatchObject({
    code: 0,
    stderr: "",
    stdout: "TypeError\n",
  });
});
