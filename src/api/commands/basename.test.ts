import { evaluate } from "../../test-helpers";

test("basename", async () => {
  const result = await evaluate(`basename("/hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "yeah
    ",
    }
  `);
});

test("basename (windows-style path)", async () => {
  const result = await evaluate(`basename("C:\\\\Users\\\\Suchipi")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Suchipi
    ",
    }
  `);
});
