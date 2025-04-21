import { evaluate } from "./test-helpers";

test("__filename and __dirname", async () => {
  const result = await evaluate(
    `
    echo(__filename);
    echo(__dirname);
  `,
    { cwd: __dirname }
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "<rootDir>/meta/tests/src/<evalScript>
    <rootDir>/meta/tests/src
    ",
    }
  `);
});
