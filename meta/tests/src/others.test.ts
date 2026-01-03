import { evaluate } from "./test-helpers";

test("global constructor aliases", async () => {
  const result = await evaluate(
    `
      assert(bigint === BigInt);
      assert(boolean === Boolean);
      assert(number === Number);
      assert(string === String);
      assert(symbol === Symbol);
    `,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);
});
