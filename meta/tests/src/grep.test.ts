import { evaluate, rootDir } from "./test-helpers";

const grepFixture = rootDir("meta/tests/fixtures/grep/stuff.txt");

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
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
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
        }
        {
          lineNumber: 2
          lineContent: "one two bl"
          matches: [
            "bl"
          ]
        }
      ]
      result4: [
        {
          lineNumber: 3
          lineContent: "rah rah bb"
          matches: null
        }
        {
          lineNumber: 4
          lineContent: "twot"
          matches: null
        }
        {
          lineNumber: 5
          lineContent: ""
          matches: null
        }
      ]
      result5: [
        {
          lineNumber: 1
          lineContent: "blah bla"
          matches: [
            "bl"
            
            groups: undefined
            index: 0
            input: "blah bla"
          ]
        }
        {
          lineNumber: 2
          lineContent: "one two bl"
          matches: [
            "bl"
            
            groups: undefined
            index: 8
            input: "one two bl"
          ]
        }
        {
          lineNumber: 3
          lineContent: "rah rah bb"
          matches: [
            "bb"
            
            groups: undefined
            index: 8
            input: "rah rah bb"
          ]
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
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
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
        }
        {
          lineNumber: 2
          lineContent: "one two bl"
          matches: [
            "bl"
          ]
        }
      ]
      result4: [
        {
          lineNumber: 3
          lineContent: "rah rah bb"
          matches: null
        }
        {
          lineNumber: 4
          lineContent: "twot"
          matches: null
        }
        {
          lineNumber: 5
          lineContent: ""
          matches: null
        }
      ]
      result5: [
        {
          lineNumber: 1
          lineContent: "blah bla"
          matches: [
            "bl"
            
            groups: undefined
            index: 0
            input: "blah bla"
          ]
        }
        {
          lineNumber: 2
          lineContent: "one two bl"
          matches: [
            "bl"
            
            groups: undefined
            index: 8
            input: "one two bl"
          ]
        }
        {
          lineNumber: 3
          lineContent: "rah rah bb"
          matches: [
            "bb"
            
            groups: undefined
            index: 8
            input: "rah rah bb"
          ]
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
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
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
        }
        {
          lineNumber: 2
          lineContent: "one two bl"
          matches: [
            "bl"
          ]
        }
      ]
      result4: [
        {
          lineNumber: 3
          lineContent: "rah rah bb"
          matches: null
        }
        {
          lineNumber: 4
          lineContent: "twot"
          matches: null
        }
        {
          lineNumber: 5
          lineContent: ""
          matches: null
        }
      ]
      result5: [
        {
          lineNumber: 1
          lineContent: "blah bla"
          matches: [
            "bl"
            
            groups: undefined
            index: 0
            input: "blah bla"
          ]
        }
        {
          lineNumber: 2
          lineContent: "one two bl"
          matches: [
            "bl"
            
            groups: undefined
            index: 8
            input: "one two bl"
          ]
        }
        {
          lineNumber: 3
          lineContent: "rah rah bb"
          matches: [
            "bb"
            
            groups: undefined
            index: 8
            input: "rah rah bb"
          ]
        }
      ]
    }
    ",
    }
  `);
});
