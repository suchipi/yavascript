import { evaluate } from "./test-helpers";

test("prints thrown errors to stderr", async () => {
  const result = await evaluate(`blahhhh`);
  expect(result).toMatchSnapshot();
});

test("prints thrown non-errors to stderr", async () => {
  const result = await evaluate(`throw "nope"`);
  expect(result).toMatchSnapshot();
});

test("prints extra error properties to stderr", async () => {
  const result = await evaluate(
    `e = new Error('hi'); e.something = true; e.somethingElse = false; throw e;`
  );
  expect(result).toMatchSnapshot();
});
