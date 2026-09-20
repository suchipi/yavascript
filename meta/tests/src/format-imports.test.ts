import { expect, test } from "vitest";
import { evaluate, rootDir } from "./test-helpers";

const fixturesDir = rootDir.concat("meta/tests/fixtures/format-imports");

const describeValue = `
  const describe = (value) => {
    const tag = Object.prototype.toString.call(value);
    if (value instanceof Date) return tag + " " + value.toISOString();
    if (value instanceof Set) return tag + " " + JSON.stringify(Array.from(value));
    return tag + " " + String(value);
  };
`;

const compareScript = (file: string, namespace: string) => `
  ${describeValue}
  const file = ${JSON.stringify(file)};
  const direct = ${namespace}.parse(readFile(file));
  const imported = require(file);
  for (const key of Object.keys(direct)) {
    console.log(key, "direct:", describe(direct[key]), "imported:", describe(imported[key]));
  }
`;

test("importing a .toml file gives the same values as TOML.parse", async () => {
  const result = await evaluate(
    compareScript(fixturesDir("data.toml"), "TOML"),
  );
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: [
      "when direct: [object Date] 1979-05-27T07:32:00.000Z imported: [object Date] 1979-05-27T07:32:00.000Z",
      "inf direct: [object Number] Infinity imported: [object Number] Infinity",
      "nan direct: [object Number] NaN imported: [object Number] NaN",
      "",
    ].join("\n"),
  });
});

test("importing a .yaml file gives the same values as YAML.parse", async () => {
  const result = await evaluate(
    compareScript(fixturesDir("data.yaml"), "YAML"),
  );
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: [
      "inf direct: [object Number] Infinity imported: [object Number] Infinity",
      "nan direct: [object Number] NaN imported: [object Number] NaN",
      'set direct: [object Set] ["a","b"] imported: [object Set] ["a","b"]',
      "",
    ].join("\n"),
  });
});

test("importing a .toml file containing an integer above Number.MAX_SAFE_INTEGER", async () => {
  const result = await evaluate(`
    const file = ${JSON.stringify(fixturesDir("big.toml"))};
    const direct = TOML.parse(readFile(file));
    console.log("direct:", typeof direct.big, String(direct.big));
    const imported = require(file);
    console.log("imported:", typeof imported.big, String(imported.big));
  `);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout:
      "direct: bigint 9007199254740993\nimported: bigint 9007199254740993\n",
  });
});
