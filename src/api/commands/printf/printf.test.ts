import { evaluate } from "../../../test-helpers";

test("printf", async () => {
  const result = await evaluate(
    `
      printf("bla %s blah %03d yeah 0x%04x", "hi", 9, 100);
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "bla hi blah 009 yeah 0x0064",
    }
  `);
});
