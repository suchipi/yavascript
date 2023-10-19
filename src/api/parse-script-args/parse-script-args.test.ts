import { evaluate, binaryPath, cleanResult } from "../../test-helpers";

test("parseScriptArgs", async () => {
  const result = await evaluate(`
    parseScriptArgs({
      somePath: Path,
      someNumber: Number,
      someBool: Boolean,
      anotherBool: Boolean,
      someString: String,
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
      "--",
      "yeah hi",
    ])
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      flags: {
        somePath: Path { <rootDir>/blah }
        someNumber: 32
        someBool: true
        someString: "hi"
        unexpectedFlag1: 73
        unexpectedFlag2: true
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
        }
        hints: {
          somePath: "path"
          someNumber: "number"
          someBool: "boolean"
          someString: "string"
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
