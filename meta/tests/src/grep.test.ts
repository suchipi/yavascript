import { afterAll, beforeAll, expect, test } from "vitest";
import {
  evaluate,
  removeSanitizer,
  restoreSanitizer,
  rootDir,
} from "./test-helpers";

const grepFixture = rootDir("meta/tests/fixtures/grep/stuff.txt");

beforeAll(() => {
  removeSanitizer("omitThrowLineNumber");
  removeSanitizer("redactLineAndColumnNumbers");
});

afterAll(() => {
  restoreSanitizer("omitThrowLineNumber");
  restoreSanitizer("redactLineAndColumnNumbers");
});

test("grepString", async () => {
  const result = await evaluate(
    `
      const str = readFile(${JSON.stringify(grepFixture)});
      const result1 = grepString(str, "bl");
      const result2 = grepString(str, "bl", { inverse: true });
      const result3 = grepString(str, "bl", { details: true });
      const result4 = grepString(str, "bl", { details: true, inverse: true });
      const result5 = grepString(str, /b\\w/, { details: true });

      console.log({
        result1,
        result2,
        result3,
        result4,
        result5,
      });
    `,
    { cleanResult: false },
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     result1: [
       "blah bla"
       "one two bl"
     ]
     result2: [
       "rah rah bb"
       "twot"
       ""
     ]
     result3: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           "bl"
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
         ]
         index: 1
         content: "one two bl"
       }
     ]
     result4: [
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: null
         index: 2
         content: "rah rah bb"
       }
       {
         lineNumber: 4
         lineContent: "twot"
         matches: null
         index: 3
         content: "twot"
       }
       {
         lineNumber: 5
         lineContent: ""
         matches: null
         index: 4
         content: ""
       }
     ]
     result5: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           
           index: 0
           input: "blah bla"
           groups: undefined
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
           
           index: 8
           input: "one two bl"
           groups: undefined
         ]
         index: 1
         content: "one two bl"
       }
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: [
           "bb"
           
           index: 8
           input: "rah rah bb"
           groups: undefined
         ]
         index: 2
         content: "rah rah bb"
       }
     ]
   }
   ",
   }
  `);
});

test("String.prototype.grep", async () => {
  const result = await evaluate(
    `
      const str = readFile(${JSON.stringify(grepFixture)});
      const result1 = str.grep("bl");
      const result2 = str.grep("bl", { inverse: true });
      const result3 = str.grep("bl", { details: true });
      const result4 = str.grep("bl", { details: true, inverse: true });
      const result5 = str.grep(/b\\w/, { details: true });

      console.log({
        result1,
        result2,
        result3,
        result4,
        result5,
      });
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     result1: [
       "blah bla"
       "one two bl"
     ]
     result2: [
       "rah rah bb"
       "twot"
       ""
     ]
     result3: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           "bl"
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
         ]
         index: 1
         content: "one two bl"
       }
     ]
     result4: [
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: null
         index: 2
         content: "rah rah bb"
       }
       {
         lineNumber: 4
         lineContent: "twot"
         matches: null
         index: 3
         content: "twot"
       }
       {
         lineNumber: 5
         lineContent: ""
         matches: null
         index: 4
         content: ""
       }
     ]
     result5: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           
           index: 0
           input: "blah bla"
           groups: undefined
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
           
           index: 8
           input: "one two bl"
           groups: undefined
         ]
         index: 1
         content: "one two bl"
       }
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: [
           "bb"
           
           index: 8
           input: "rah rah bb"
           groups: undefined
         ]
         index: 2
         content: "rah rah bb"
       }
     ]
   }
   ",
   }
  `);
});

test("grepFile", async () => {
  const result = await evaluate(
    `
      const path = ${JSON.stringify(grepFixture)};
      const result1 = grepFile(path, "bl");
      const result2 = grepFile(path, "bl", { inverse: true });
      const result3 = grepFile(path, "bl", { details: true });
      const result4 = grepFile(path, "bl", { details: true, inverse: true });
      const result5 = grepFile(path, /b\\w/, { details: true });

      console.log({
        result1,
        result2,
        result3,
        result4,
        result5,
      });
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     result1: [
       "blah bla"
       "one two bl"
     ]
     result2: [
       "rah rah bb"
       "twot"
       ""
     ]
     result3: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           "bl"
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
         ]
         index: 1
         content: "one two bl"
       }
     ]
     result4: [
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: null
         index: 2
         content: "rah rah bb"
       }
       {
         lineNumber: 4
         lineContent: "twot"
         matches: null
         index: 3
         content: "twot"
       }
       {
         lineNumber: 5
         lineContent: ""
         matches: null
         index: 4
         content: ""
       }
     ]
     result5: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           
           index: 0
           input: "blah bla"
           groups: undefined
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
           
           index: 8
           input: "one two bl"
           groups: undefined
         ]
         index: 1
         content: "one two bl"
       }
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: [
           "bb"
           
           index: 8
           input: "rah rah bb"
           groups: undefined
         ]
         index: 2
         content: "rah rah bb"
       }
     ]
   }
   ",
   }
  `);
});

test("grepArray", async () => {
  const result = await evaluate(
    `
      const targetArray = readFile(${JSON.stringify(grepFixture)}).split("\\n");
      const result1 = grepArray(targetArray, "bl");
      const result2 = grepArray(targetArray, "bl", { inverse: true });
      const result3 = grepArray(targetArray, "bl", { details: true });
      const result4 = grepArray(targetArray, "bl", { details: true, inverse: true });
      const result5 = grepArray(targetArray, /b\\w/, { details: true });

      // non-strings are coerced to strings
      const result6 = grepArray([2, "ab2", "b2d", "def", "2at"], /2/i);
      const result7 = grepArray([[], {}, new Set()], "Object");

      console.log({
        result1,
        result2,
        result3,
        result4,
        result5,
        result6,
        result7,
      });
    `,
    { cleanResult: false },
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     result1: [
       "blah bla"
       "one two bl"
     ]
     result2: [
       "rah rah bb"
       "twot"
       ""
     ]
     result3: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           "bl"
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
         ]
         index: 1
         content: "one two bl"
       }
     ]
     result4: [
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: null
         index: 2
         content: "rah rah bb"
       }
       {
         lineNumber: 4
         lineContent: "twot"
         matches: null
         index: 3
         content: "twot"
       }
       {
         lineNumber: 5
         lineContent: ""
         matches: null
         index: 4
         content: ""
       }
     ]
     result5: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           
           index: 0
           input: "blah bla"
           groups: undefined
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
           
           index: 8
           input: "one two bl"
           groups: undefined
         ]
         index: 1
         content: "one two bl"
       }
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: [
           "bb"
           
           index: 8
           input: "rah rah bb"
           groups: undefined
         ]
         index: 2
         content: "rah rah bb"
       }
     ]
     result6: [
       2
       "ab2"
       "b2d"
       "2at"
     ]
     result7: [
       {}
     ]
   }
   ",
   }
  `);
});

test("Array.prototype.grep", async () => {
  const result = await evaluate(
    `
      const targetArray = readFile(${JSON.stringify(grepFixture)}).split("\\n");
      const result1 = targetArray.grep("bl");
      const result2 = targetArray.grep("bl", { inverse: true });
      const result3 = targetArray.grep("bl", { details: true });
      const result4 = targetArray.grep("bl", { details: true, inverse: true });
      const result5 = targetArray.grep(/b\\w/, { details: true });

      // non-strings are coerced to strings
      const result6 = [2, "ab2", "b2d", "def", "2at"].grep(/2/i);
      const result7 = [[], {}, new Set()].grep("Object");

      console.log({
        result1,
        result2,
        result3,
        result4,
        result5,
        result6,
        result7,
      });
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     result1: [
       "blah bla"
       "one two bl"
     ]
     result2: [
       "rah rah bb"
       "twot"
       ""
     ]
     result3: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           "bl"
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
         ]
         index: 1
         content: "one two bl"
       }
     ]
     result4: [
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: null
         index: 2
         content: "rah rah bb"
       }
       {
         lineNumber: 4
         lineContent: "twot"
         matches: null
         index: 3
         content: "twot"
       }
       {
         lineNumber: 5
         lineContent: ""
         matches: null
         index: 4
         content: ""
       }
     ]
     result5: [
       {
         lineNumber: 1
         lineContent: "blah bla"
         matches: [
           "bl"
           
           index: 0
           input: "blah bla"
           groups: undefined
         ]
         index: 0
         content: "blah bla"
       }
       {
         lineNumber: 2
         lineContent: "one two bl"
         matches: [
           "bl"
           
           index: 8
           input: "one two bl"
           groups: undefined
         ]
         index: 1
         content: "one two bl"
       }
       {
         lineNumber: 3
         lineContent: "rah rah bb"
         matches: [
           "bb"
           
           index: 8
           input: "rah rah bb"
           groups: undefined
         ]
         index: 2
         content: "rah rah bb"
       }
     ]
     result6: [
       2
       "ab2"
       "b2d"
       "2at"
     ]
     result7: [
       {}
     ]
   }
   ",
   }
  `);
});
