import { afterAll, beforeAll, describe, expect, test } from "vitest";
import {
  evaluate,
  removeSanitizer,
  restoreSanitizer,
  runYavascript,
  rootDir,
} from "./test-helpers";

const fixturesDir = rootDir.concat("meta/tests/fixtures/assert");

test("assert - truthy value", async () => {
  const result = await evaluate(`
    assert(2 + 2 === 4);
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

test("assert - falsy value", async () => {
  const result = await evaluate(`
    assert(2 + 2 === 5);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": null,
      "stderr": "Error: Assertion failed at <evalScript>:2:11 (value = false)
      at somewhere
    {
      fileName: "yavascript-internals/dist/bundles/layer1.js"
      lineNumber: <redacted>
      columnNumber: <redacted>
      value: false
    }
    ",
      "stdout": "",
    }
  `);
});

test("assert - falsy value with message", async () => {
  const result = await evaluate(`
    assert(2 + 2 === 5, "ohh this is bad!");
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": null,
      "stderr": "Error: ohh this is bad! at <evalScript>:2:11 (value = false)
      at somewhere
    {
      fileName: "yavascript-internals/dist/bundles/layer1.js"
      lineNumber: <redacted>
      columnNumber: <redacted>
      value: false
    }
    ",
      "stdout": "",
    }
  `);
});

test("assert - falsy value with message in real file", async () => {
  const result = await runYavascript([fixturesDir("nested-throw.js")]);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": null,
      "stderr": "Error: OHHH this is sad day!!
    meta/tests/fixtures/assert/nested-throw.js:10:9
    ───┬───────────────────────────────────────────
     9 │ function inner() {
    10 │   assert(2 + 2 === 5, "OHHH this is sad day!!");
    11 │ }
     (value = false)
      at somewhere
    {
      fileName: "yavascript-internals/dist/bundles/layer1.js"
      lineNumber: <redacted>
      columnNumber: <redacted>
      value: false
    }
    ",
      "stdout": "",
    }
  `);
});

// CLICOLOR_FORCE beats CLICOLOR, so it has to be neutralized too, or an
// ambient CLICOLOR_FORCE would decide the outcome.
const colorsOffEnv = { ...process.env, CLICOLOR: "0", CLICOLOR_FORCE: "0" };

const ansiEscapesIn = (str: string) =>
  (str.match(/\x1b\[[0-9;]*m/g) || []).map((sequence) =>
    sequence.replace("\x1b", "\\x1b"),
  );

describe("no colors", () => {
  // The default sanitizers strip ANSI, so these have to look at raw output.
  const runWithColorsOff = (code: string) =>
    evaluate(code, { env: colorsOffEnv, cleanResult: false });

  test("assert - caught failure message has no ANSI escapes", async () => {
    const result = await runWithColorsOff(`
      try {
        assert(2 + 2 === 5);
      } catch (err) {
        err.message;
      }
    `);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Assertion failed");
    expect(ansiEscapesIn(result.stdout)).toEqual([]);
  });

  test("assert - uncaught failure printed to stderr has no ANSI escapes", async () => {
    const result = await runWithColorsOff(`assert(2 + 2 === 5);`);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("Assertion failed");
    expect(ansiEscapesIn(result.stderr)).toEqual([]);
  });

  test("assert - code frame from a file has no ANSI escapes", async () => {
    const result = await runYavascript([fixturesDir("nested-throw.js")], {
      env: colorsOffEnv,
      cleanResult: false,
    });
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("OHHH this is sad day!!");
    expect(ansiEscapesIn(result.stderr)).toEqual([]);
  });
});

describe("colorized code frames", () => {
  // Remove the sanitizers that strip ANSI escapes, so the syntax highlighting
  // is visible in the snapshots.
  beforeAll(() => {
    removeSanitizer("stripAnsi");
    removeSanitizer("cleanOutput");
  });

  afterAll(() => {
    restoreSanitizer("stripAnsi");
    restoreSanitizer("cleanOutput");
  });

  test("assert - code frame is syntax highlighted when colors are on", async () => {
    const result = await runYavascript(
      [fixturesDir("nested-throw.js").toString()],
      { env: { ...process.env, CLICOLOR_FORCE: "1" } },
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": null,
        "stderr": "Error: OHHH this is sad day!!
      [1m[31mmeta/tests/fixtures/assert/nested-throw.js:10:9[39m[22m
      [1m[31m───┬───────────────────────────────────────────[39m[22m
      [31m 9[1m │ [22m[39m[34;1mfunction[0m[0m [0m[32;1minner[0m[0m() {[0m
      [31m10[1m │ [22m[39m[0m  [0m[32;1massert[0m[0m([0m[35;1m2[0m[0m + [0m[35;1m2[0m[0m === [0m[35;1m5[0m[0m, [0m[32;1m"OHHH this is sad day!!"[0m[0m);[0m
      [31m11[1m │ [22m[39m[0m}[0m
       (value = false)
        at somewhere
      [38;5;237m{[0m
        [39mfileName[0m[38;5;237m:[0m [38;5;22m"[38;5;10myavascript-internals/dist/bundles/layer1.js[38;5;22m"[0m
        [39mlineNumber[0m[38;5;237m:[0m [35m<redacted>[0m
        [39mcolumnNumber[0m[38;5;237m:[0m [35m<redacted>[0m
        [39mvalue[0m[38;5;237m:[0m [35mfalse[0m
      [38;5;237m}[0m
      ",
        "stdout": "",
      }
    `);
  });

  test("assert - code frame tokenizes jsx in a .tsx file", async () => {
    const result = await runYavascript(
      [fixturesDir("throw-in-tsx.tsx").toString()],
      { env: { ...process.env, CLICOLOR_FORCE: "1" } },
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": null,
        "stderr": "Error: tsx has jsx
      [1m[31mmeta/tests/fixtures/assert/throw-in-tsx.tsx:2:7[39m[22m
      [1m[31m──┬────────────────────────────────────────────[39m[22m
      [31m1[1m │ [22m[39m[34;1mconst[0m[0m [0m[0mbefore[0m[0m = () => [0m[36;1m<div>[0m[0mhi[0m[36;1m</div>[0m[0m;[0m
      [31m2[1m │ [22m[39m[32;1massert[0m[0m([0m[35;1m2[0m[0m + [0m[35;1m2[0m[0m === [0m[35;1m5[0m[0m, [0m[32;1m"tsx has jsx"[0m[0m);[0m
      [31m3[1m │ [22m[39m[34;1mconst[0m[0m [0m[0mafter[0m[0m = [0m[35;1m2[0m[0m;[0m
       (value = false)
        at somewhere
      [38;5;237m{[0m
        [39mfileName[0m[38;5;237m:[0m [38;5;22m"[38;5;10myavascript-internals/dist/bundles/layer1.js[38;5;22m"[0m
        [39mlineNumber[0m[38;5;237m:[0m [35m<redacted>[0m
        [39mcolumnNumber[0m[38;5;237m:[0m [35m<redacted>[0m
        [39mvalue[0m[38;5;237m:[0m [35mfalse[0m
      [38;5;237m}[0m
      ",
        "stdout": "",
      }
    `);
  });

  test("assert - code frame doesn't tokenize <Type> assertions as jsx in a .ts file", async () => {
    const result = await runYavascript(
      [fixturesDir("throw-in-ts.ts").toString()],
      { env: { ...process.env, CLICOLOR_FORCE: "1" } },
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": null,
        "stderr": "Error: type assertions aren't jsx
      [1m[31mmeta/tests/fixtures/assert/throw-in-ts.ts:2:7[39m[22m
      [1m[31m──┬──────────────────────────────────────────[39m[22m
      [31m1[1m │ [22m[39m[34;1mconst[0m[0m [0m[0mbefore[0m[0m = <[0m[0many[0m[0m>[0m[35;1m1[0m[0m;[0m
      [31m2[1m │ [22m[39m[32;1massert[0m[0m([0m[35;1m2[0m[0m + [0m[35;1m2[0m[0m === [0m[35;1m5[0m[0m, [0m[32;1m"type assertions aren't jsx"[0m[0m);[0m
      [31m3[1m │ [22m[39m[34;1mconst[0m[0m [0m[0mafter[0m[0m = <[0m[0many[0m[0m>[0m[35;1m2[0m[0m;[0m
       (value = false)
        at somewhere
      [38;5;237m{[0m
        [39mfileName[0m[38;5;237m:[0m [38;5;22m"[38;5;10myavascript-internals/dist/bundles/layer1.js[38;5;22m"[0m
        [39mlineNumber[0m[38;5;237m:[0m [35m<redacted>[0m
        [39mcolumnNumber[0m[38;5;237m:[0m [35m<redacted>[0m
        [39mvalue[0m[38;5;237m:[0m [35mfalse[0m
      [38;5;237m}[0m
      ",
        "stdout": "",
      }
    `);
  });
});
