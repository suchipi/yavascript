import { evaluate } from "../../../test-helpers";

test("sleep", async () => {
  const result = await evaluate(
    `
      sleep(10);
      sleep.sync(10);
      sleep.async(10).then(() => console.log('hi'));
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Promise {}
    hi
    ",
    }
  `);
});
