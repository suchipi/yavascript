import { evaluate } from "./test-helpers";

test("echo string", async () => {
  const result = await evaluate(`echo("hi");`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "hi
   ",
   }
  `);
});

test("echo object", async () => {
  const result = await evaluate(`echo({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     hi: true
   }
   ",
   }
  `);
});

test("echo multiple", async () => {
  const result = await evaluate(`echo("hi", { hi: true }, "hi again");`);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "hi {
     hi: true
   } hi again
   ",
   }
  `);
});
