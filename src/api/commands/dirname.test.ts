import { evaluate } from "../../test-helpers";

test("dirname", async () => {
  const result = await evaluate(`dirname("/hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "/hi/there
    ",
    }
  `);
});

test("dirname (folder in root dir)", async () => {
  const result = await evaluate(`dirname("/hi")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "/
    ",
    }
  `);
});

test("dirname (windows-style path)", async () => {
  const result = await evaluate(`dirname("C:\\\\Users\\\\Suchipi")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "C:\\Users
    ",
    }
  `);
});
