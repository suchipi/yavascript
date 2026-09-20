import { expect, test } from "vitest";
import { rootDir, runYavascript } from "./test-helpers";

/**
 * The dot in "dir.with.dot" is load-bearing: the language of an extensionless
 * script has to come from its own name, not from the last dot anywhere in its
 * path.
 */
const fixturesDir = rootDir.concat(
  "meta/tests/fixtures/extensionless-scripts/dir.with.dot",
);

const ranAndPrinted = (output: string) => ({
  code: 0,
  error: null,
  stderr: "",
  stdout: output + "\n",
});

test("an extensionless TypeScript file runs", async () => {
  const result = await runYavascript([fixturesDir("typescript")]);
  expect(result).toEqual(ranAndPrinted("typescript ok"));
});

test("an extensionless TypeScript file runs with --lang ts", async () => {
  const result = await runYavascript([
    "--lang",
    "ts",
    fixturesDir("typescript"),
  ]);
  expect(result).toEqual(ranAndPrinted("typescript ok"));
});

test("an extensionless Civet file runs", async () => {
  const result = await runYavascript([fixturesDir("civet")]);
  expect(result).toEqual(ranAndPrinted("civet ok"));
});

test("an extensionless Civet file runs with --lang civet", async () => {
  const result = await runYavascript(["--lang", "civet", fixturesDir("civet")]);
  expect(result).toEqual(ranAndPrinted("civet ok"));
});

test("an extensionless CoffeeScript file runs", async () => {
  // autodetect tries Civet before CoffeeScript, so this fixture is written to
  // compile to the same thing in either language
  const result = await runYavascript([fixturesDir("coffeescript-or-civet")]);
  expect(result).toEqual(ranAndPrinted("coffeescript ok 4"));
});

test("an extensionless CoffeeScript file runs with --lang coffee", async () => {
  const result = await runYavascript([
    "--lang",
    "coffee",
    fixturesDir("coffeescript"),
  ]);
  expect(result).toEqual(ranAndPrinted("coffeescript ok 9"));
});
