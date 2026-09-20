import { expect, test } from "vitest";
import { evaluate, runYavascript, binaryPath, rootDir } from "./test-helpers";

const fixturesDir = rootDir.concat("meta/tests/fixtures/parse-script-args");

test("parseScriptArgs", async () => {
  const result = await evaluate(`
    parseScriptArgs({
      somePath: Path,
      someNumber: Number,
      someBool: Boolean,
      anotherBool: Boolean,
      someString: String,
      arrayOfPathSingle: types.arrayOf(Path),
      arrayOfPathMulti: types.arrayOf(Path),
      arrayOfNumberSingle: types.arrayOf(Number),
      arrayOfNumberMulti: types.arrayOf(number),
      arrayOfBoolSingle: types.arrayOf(Boolean),
      arrayOfBoolMulti: types.arrayOf(boolean),
      arrayOfStringSingle: types.arrayOf(String),
      arrayOfStringMulti: types.arrayOf(string),
      unspecifiedArrayFlag: types.arrayOf(types.Path),
    }, [
      "--some-path",
      "blah",
      "--some-number",
      "32",
      "--some-bool",
      "--some-string",
      "hi",
      "--unexpected-flag-1",
      "73",
      "--unexpected-flag-2",
      "--arrayOfPathSingle",
      "blah2",
      "--arrayOfPathMulti",
      "blah3",
      "--arrayOfPathMulti",
      "blah4",
      "--arrayOfStringSingle",
      "blah2",
      "--arrayOfStringMulti",
      "blah3",
      "--arrayOfStringMulti",
      "blah4",
      "--arrayOfNumberSingle",
      "2",
      "--arrayOfNumberMulti",
      "3",
      "--arrayOfNumberMulti",
      "4",
      "--arrayOfBoolSingle",
      "true",
      "--arrayOfBoolMulti",
      "true",
      "--arrayOfBoolMulti",
      "false",
      "--",
      "yeah hi",
    ])
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": null,
      "stderr": "",
      "stdout": "{
      flags: {
        somePath: Path { <rootDir>/blah }
        someNumber: 32
        someBool: true
        someString: "hi"
        unexpectedFlag1: 73
        unexpectedFlag2: true
        arrayOfPathSingle: [
          Path { <rootDir>/blah2 }
        ]
        arrayOfPathMulti: [
          Path { <rootDir>/blah3 }
          Path { <rootDir>/blah4 }
        ]
        arrayOfStringSingle: [
          "blah2"
        ]
        arrayOfStringMulti: [
          "blah3"
          "blah4"
        ]
        arrayOfNumberSingle: [
          2
        ]
        arrayOfNumberMulti: [
          3
          4
        ]
        arrayOfBoolSingle: [
          true
        ]
        arrayOfBoolMulti: [
          true
          false
        ]
      }
      args: [
        "yeah hi"
      ]
      metadata: {
        keys: {
          --some-path: "somePath"
          --some-number: "someNumber"
          --some-bool: "someBool"
          --some-string: "someString"
          --unexpected-flag-1: "unexpectedFlag1"
          --unexpected-flag-2: "unexpectedFlag2"
          --arrayOfPathSingle: "arrayOfPathSingle"
          --arrayOfPathMulti: "arrayOfPathMulti"
          --arrayOfStringSingle: "arrayOfStringSingle"
          --arrayOfStringMulti: "arrayOfStringMulti"
          --arrayOfNumberSingle: "arrayOfNumberSingle"
          --arrayOfNumberMulti: "arrayOfNumberMulti"
          --arrayOfBoolSingle: "arrayOfBoolSingle"
          --arrayOfBoolMulti: "arrayOfBoolMulti"
        }
        hints: {
          somePath: "path"
          someNumber: "number"
          someBool: "boolean"
          someString: "string"
          arrayOfPathSingle: "array of paths"
          arrayOfPathMulti: "array of paths"
          arrayOfStringSingle: "array of strings"
          arrayOfStringMulti: "array of strings"
          arrayOfNumberSingle: "array of numbers"
          arrayOfNumberMulti: "array of numbers"
          arrayOfBoolSingle: "array of booleans"
          arrayOfBoolMulti: "array of booleans"
        }
        guesses: {
          unexpectedFlag1: "number"
          unexpectedFlag2: "boolean"
        }
      }
    }
    ",
    }
  `);
});

test("default args skip the code string given to -e", async () => {
  const result = await runYavascript([
    "-e",
    `console.log(JSON.stringify(parseScriptArgs().args))`,
    "a",
    "b",
  ]);
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  expect(JSON.parse(result.stdout)).toEqual(["a", "b"]);
});

test("default args skip --lang and its value", async () => {
  const result = await runYavascript([
    "--lang",
    "js",
    fixturesDir("print-args.js"),
    "a",
    "b",
  ]);
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  expect(JSON.parse(result.stdout)).toEqual(["a", "b"]);
});

test("default args skip -r and its value", async () => {
  const result = await runYavascript([
    "-r",
    fixturesDir("preload.js"),
    fixturesDir("print-args.js"),
    "a",
    "b",
  ]);
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  expect(JSON.parse(result.stdout)).toEqual(["a", "b"]);
});

test("a flag value that starts with a minus sign is kept", async () => {
  const result = await evaluate(
    `JSON.stringify(parseScriptArgs({}, ["--count=-5"]).flags)`,
  );
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  expect(String(JSON.parse(result.stdout).count)).toBe("-5");
});

test("a negative number is a positional arg", async () => {
  const result = await evaluate(`JSON.stringify(parseScriptArgs({}, ["-3"]))`);
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  const parsed = JSON.parse(result.stdout);
  expect(parsed.args).toEqual(["-3"]);
  expect(parsed.flags).toEqual({});
});

test("a lone dash is a positional arg", async () => {
  const result = await evaluate(`JSON.stringify(parseScriptArgs({}, ["-"]))`);
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  const parsed = JSON.parse(result.stdout);
  expect(parsed.args).toEqual(["-"]);
  expect(parsed.flags).toEqual({});
});

test("a flag name with non-ASCII letters keeps them", async () => {
  const result = await evaluate(
    `JSON.stringify(parseScriptArgs({}, ["--héllo"]).flags)`,
  );
  expect(result).toMatchObject({ code: 0, error: null, stderr: "" });
  expect(Object.keys(JSON.parse(result.stdout))).toEqual(["héllo"]);
});
