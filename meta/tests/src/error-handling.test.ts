import {
  evaluate,
  runYavascript,
  removeSanitizer,
  restoreSanitizer,
  rootDir,
} from "./test-helpers";

test("prints thrown errors to stderr", async () => {
  const result = await evaluate(`blahhhh`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "ReferenceError: 'blahhhh' is not defined
     at somewhere
   {
     fileName: "<internal>/quickjs.c"
     lineNumber: <redacted>
     columnNumber: <redacted>
   }
   ",
     "stdout": "",
   }
  `);
});

test("prints thrown non-errors to stderr", async () => {
  const result = await evaluate(`throw "nope"`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Non-error value was thrown: "nope"
   ",
     "stdout": "",
   }
  `);
});

test("prints extra error properties to stderr", async () => {
  const result = await evaluate(
    `e = new Error('hi'); e.something = true; e.somethingElse = false; throw e;`,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 1,
     "error": null,
     "stderr": "Error: hi
     at somewhere
   {
     fileName: "<rootDir>/<evalScript>"
     lineNumber: <redacted>
     columnNumber: <redacted>
     something: true
     somethingElse: false
   }
   ",
     "stdout": "",
   }
  `);
});

describe("source-mapped stack traces for compiled files", () => {
  // Remove the sanitizers that collapse frames to "at somewhere" and redact
  // line/column numbers, so the mapped locations are visible in the snapshots.
  beforeAll(() => {
    removeSanitizer("collapseStackTrace");
    removeSanitizer("redactLineAndColumnNumbers");
  });

  afterAll(() => {
    restoreSanitizer("collapseStackTrace");
    restoreSanitizer("redactLineAndColumnNumbers");
  });

  const sourceMapsFixture = rootDir.concat("meta/tests/fixtures/source-maps");

  // Source throw is on line 4; coffeescript's blank lines push the compiled
  // throw to line 8.
  test("coffee", async () => {
    const result = await runYavascript([sourceMapsFixture("throw.coffee")]);
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 1,
       "error": null,
       "stderr": "Error: coffee-boom
       at boom (<rootDir>/meta/tests/fixtures/source-maps/throw.coffee:4:9)
       at <anonymous> (<rootDir>/meta/tests/fixtures/source-maps/throw.coffee:5:1)
     {
       fileName: "<rootDir>/meta/tests/fixtures/source-maps/throw.coffee"
       lineNumber: 4
       columnNumber: 9
     }
     ",
       "stdout": "",
     }
    `);
  });

  // Civet's pipe operators collapse lines 2-4, so the compiled throw is on
  // line 4 while the source throw is on line 6. Civet also runs through Sucrase,
  // so this exercises the two-map chain.
  test("civet", async () => {
    const result = await runYavascript([sourceMapsFixture("throw.civet")]);
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 1,
       "error": null,
       "stderr": "Error: civet-boom
       at boom (<rootDir>/meta/tests/fixtures/source-maps/throw.civet:6:18)
       at <anonymous> (<rootDir>/meta/tests/fixtures/source-maps/throw.civet:7:5)
     {
       fileName: "<rootDir>/meta/tests/fixtures/source-maps/throw.civet"
       lineNumber: 6
       columnNumber: 18
     }
     ",
       "stdout": "",
     }
    `);
  });

  // Sucrase preserves line numbers but the JSX transform shifts columns: the
  // throw's call site is at source column 77, but column 97 once
  // `<div className="app">` expands into a React.createElement call.
  test("tsx", async () => {
    const result = await runYavascript([sourceMapsFixture("throw.tsx")]);
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 1,
       "error": null,
       "stderr": "Error: tsx-boom
       at <anonymous> (<rootDir>/meta/tests/fixtures/source-maps/throw.tsx:3:77)
       at App (<rootDir>/meta/tests/fixtures/source-maps/throw.tsx:3:92)
       at <anonymous> (<rootDir>/meta/tests/fixtures/source-maps/throw.tsx:5:4)
     {
       fileName: "<rootDir>/meta/tests/fixtures/source-maps/throw.tsx"
       lineNumber: 3
       columnNumber: 77
     }
     ",
       "stdout": "",
     }
    `);
  });

  // CJS-wrapping puts the user's code one line below a preamble; the chain is
  // [lineOffset -1, sucrase map], so the throw on source line 4 must still
  // report line 4 (not the compiled line 5) with its exact column.
  test("cjs-wrapped module", async () => {
    const result = await runYavascript([sourceMapsFixture("cjs-main.ts")]);
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 1,
       "error": null,
       "stderr": "Error: cjs-ts-boom
       at boom (<rootDir>/meta/tests/fixtures/source-maps/cjs-module.ts:4:18)
       at <anonymous> (<rootDir>/meta/tests/fixtures/source-maps/cjs-main.ts:2:9)
     {
       fileName: "<rootDir>/meta/tests/fixtures/source-maps/cjs-module.ts"
       lineNumber: 4
       columnNumber: 18
     }
     ",
       "stdout": "",
     }
    `);
  });

  // Reading err.stack / err.lineNumber from JS (not just printed output)
  // exercises the native path that sets the error's own properties.
  test("caught error reports mapped stack and lineNumber from JS", async () => {
    const result = await runYavascript([
      sourceMapsFixture("catch-stack.coffee"),
    ]);
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 0,
       "error": null,
       "stderr": "",
       "stdout": "stack:
         at boom (<rootDir>/meta/tests/fixtures/source-maps/catch-stack.coffee:4:9)
         at <anonymous> (<rootDir>/meta/tests/fixtures/source-maps/catch-stack.coffee:6:3)

     lineNumber: 4
     columnNumber: 9
     ",
     }
    `);
  });
});
