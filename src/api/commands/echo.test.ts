import { evaluate } from "../../test-helpers";

test("echo string", async () => {
  const result = await evaluate(`echo("hi");`);
  expect(result).toMatchSnapshot();
});

test("echo object", async () => {
  const result = await evaluate(`echo({ hi: true });`);
  expect(result).toMatchSnapshot();
});

test("echo multiple", async () => {
  const result = await evaluate(`echo("hi", { hi: true }, "hi again");`);
  expect(result).toMatchSnapshot();
});
