import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

const parseToJson = (input: string) =>
  evaluate(`console.log(JSON.stringify(CSV.parse(${JSON.stringify(input)})))`);

const printed = (json: string) => ({
  code: 0,
  error: null,
  stderr: "",
  stdout: json + "\n",
});

test("CSV", async () => {
  const result = await evaluate(
    `
      const table = [
        ["a", "b", "c"],
        ["d", "e", "f"]
      ];

      const csv = CSV.stringify(table);
      const reparsed = CSV.parse(csv);

      console.log({
        table,
        csv,
        reparsed
      })
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     table: [
       [
         "a"
         "b"
         "c"
       ]
       [
         "d"
         "e"
         "f"
       ]
     ]
     csv: "a,b,c\\r\\nd,e,f"
     reparsed: [
       [
         "a"
         "b"
         "c"
       ]
       [
         "d"
         "e"
         "f"
       ]
     ]
   }
   ",
   }
  `);
});

test("CSV.parse - a trailing newline doesn't add a row", async () => {
  expect(await parseToJson("a,b\nc,d\n")).toEqual(
    printed('[["a","b"],["c","d"]]'),
  );
  expect(await parseToJson("a,b,c\nd,e,f\n")).toEqual(
    printed('[["a","b","c"],["d","e","f"]]'),
  );
});

test("CSV.parse - single-column input", async () => {
  expect(await parseToJson("a\nb")).toEqual(printed('[["a"],["b"]]'));
  expect(await parseToJson("a\nb\n")).toEqual(printed('[["a"],["b"]]'));
});

test("CSV.parse - empty input has no rows", async () => {
  expect(await parseToJson("")).toEqual(printed("[]"));
});

test("CSV.parse - a blank line in the middle is an empty row", async () => {
  expect(await parseToJson("a,b\n\nc,d")).toEqual(
    printed('[["a","b"],[""],["c","d"]]'),
  );
});

test("CSV.parse - the number of rows in the input doesn't change how it parses", async () => {
  const result = await evaluate(`
    for (const rowCount of [5, 12]) {
      const parsed = CSV.parse("a,b\\n".repeat(rowCount));
      console.log(rowCount, parsed.length, JSON.stringify(parsed[parsed.length - 1]));
    }
  `);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '5 5 ["a","b"]\n12 12 ["a","b"]\n',
  });
});

test("CSV.parse - round-trips CSV.stringify output", async () => {
  const result = await evaluate(`
    const tables = [
      [["a"], ["b"]],
      [],
      [["a", "b"], [""], ["c", "d"]],
    ];
    for (const table of tables) {
      console.log(JSON.stringify(CSV.parse(CSV.stringify(table))));
    }
  `);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '[["a"],["b"]]\n[]\n[["a","b"],[""],["c","d"]]\n',
  });
});

test("CSV.parse - only commas separate fields", async () => {
  expect(await parseToJson("a;b;c\nd;e;f")).toEqual(
    printed('[["a;b;c"],["d;e;f"]]'),
  );
  expect(await parseToJson("a\tb\tc\nd\te\tf")).toEqual(
    printed('[["a\\tb\\tc"],["d\\te\\tf"]]'),
  );
  expect(await parseToJson("a|b|c\nd|e|f")).toEqual(
    printed('[["a|b|c"],["d|e|f"]]'),
  );
});

test("CSV.parse - round-trips fields containing other delimiter characters", async () => {
  const result = await evaluate(`
    console.log(JSON.stringify(CSV.parse(CSV.stringify([["a;b"], ["c;d"]]))));
  `);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '[["a;b"],["c;d"]]\n',
  });
});
