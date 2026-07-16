import { expect, test } from "vitest";
import { evaluate, binaryPath } from "./test-helpers";

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
