import { evaluate } from "../../../test-helpers";

test("dirname", async () => {
  const result = await evaluate(`dirname("/hi/there/yeah")`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path {
      segments: [
        ""
        "hi"
        "there"
      ]
      separator: "/"
    }
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
      "stdout": "Path {
      segments: [
        ""
      ]
      separator: "/"
    }
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
      "stdout": "Path {
      segments: [
        "C:"
        "Users"
      ]
      separator: "\\\\"
    }
    ",
    }
  `);
});
