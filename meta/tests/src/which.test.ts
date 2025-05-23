import { pathMarker } from "path-less-traveled";
import { evaluate, rootDir } from "./test-helpers";

const fixturesDir = pathMarker(rootDir("meta/tests/fixtures/which"));

test("which", async () => {
  const env = {
    PATH: [
      fixturesDir("bin1"),
      fixturesDir("bin2"),
      fixturesDir("usr/bin3"),
    ].join(":"),
  };

  const script = `
    echo([
      which("program"),
      which("program2"),
      which("program3"),
      which("program4657438"), // doesn't exist

      which("program", {
        // override PATH
        searchPaths: ${JSON.stringify([fixturesDir("bin2")])}
      }),

      which("something"),
      which("something", {
        suffixes: [".exe", ".bat"],
      }),

      which("sample", {
        suffixes: [".one", ".two"],
        logging: {
          trace: console.error,
        },
      }),
      which("program2", {
        logging: {
          trace: console.error,
        },
      }),
    ]);
  `;

  const result = await evaluate(script, { env });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "which: Searching for "sample" in "<rootDir>/meta/tests/fixtures/which/bin1"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/bin1/sample"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/bin1/sample.one"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/bin1/sample.two"
    which: Searching for "sample" in "<rootDir>/meta/tests/fixtures/which/bin2"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/bin2/sample"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/bin2/sample.one"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/bin2/sample.two"
    which: Searching for "sample" in "<rootDir>/meta/tests/fixtures/which/usr/bin3"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/usr/bin3/sample"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/usr/bin3/sample.one"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/usr/bin3/sample.two"
    which: Failed to find "sample"...
    which: Searching for "program2" in "<rootDir>/meta/tests/fixtures/which/bin1"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/bin1/program2"
    which: Searching for "program2" in "<rootDir>/meta/tests/fixtures/which/bin2"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/bin2/program2"
    which: Searching for "program2" in "<rootDir>/meta/tests/fixtures/which/usr/bin3"
    which: Checking for "<rootDir>/meta/tests/fixtures/which/usr/bin3/program2"
    which: Found "program2" at "<rootDir>/meta/tests/fixtures/which/usr/bin3/program2"!
    ",
      "stdout": "[
      Path { <rootDir>/meta/tests/fixtures/which/bin1/program }
      Path { <rootDir>/meta/tests/fixtures/which/usr/bin3/program2 }
      Path { <rootDir>/meta/tests/fixtures/which/bin2/program3 }
      null
      Path { <rootDir>/meta/tests/fixtures/which/bin2/program }
      null
      Path { <rootDir>/meta/tests/fixtures/which/bin1/something.bat }
      null
      Path { <rootDir>/meta/tests/fixtures/which/usr/bin3/program2 }
    ]
    ",
    }
  `);
});
