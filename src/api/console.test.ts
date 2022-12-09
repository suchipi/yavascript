import { evaluate, inspect } from "../test-helpers";

test("console.log string", async () => {
  const result = await evaluate(`console.log("hi");`);
  expect(result).toMatchSnapshot();
});

test("console.info string", async () => {
  const result = await evaluate(`console.info("hi");`);
  expect(result).toMatchSnapshot();
});

test("console.warn string", async () => {
  const result = await evaluate(`console.warn("hi");`);
  expect(result).toMatchSnapshot();
});

test("console.error string", async () => {
  const result = await evaluate(`console.error("hi");`);
  expect(result).toMatchSnapshot();
});

test("console.log object", async () => {
  const result = await evaluate(`console.log({ hi: true });`);
  expect(result).toMatchSnapshot();
});

test("console.info object", async () => {
  const result = await evaluate(`console.info({ hi: true });`);
  expect(result).toMatchSnapshot();
});

test("console.warn object", async () => {
  const result = await evaluate(`console.warn({ hi: true });`);
  expect(result).toMatchSnapshot();
});

test("console.error object", async () => {
  const result = await evaluate(`console.error({ hi: true });`);
  expect(result).toMatchSnapshot();
});

test("console.log multiple", async () => {
  const result = await evaluate(`console.log("hi", { hi: true }, "hi again");`);
  expect(result).toMatchSnapshot();
});

test("console.info multiple", async () => {
  const result = await evaluate(
    `console.info("hi", { hi: true }, "hi again");`
  );
  expect(result).toMatchSnapshot();
});

test("console.warn multiple", async () => {
  const result = await evaluate(
    `console.warn("hi", { hi: true }, "hi again");`
  );
  expect(result).toMatchSnapshot();
});

test("console.error multiple", async () => {
  const result = await evaluate(
    `console.error("hi", { hi: true }, "hi again");`
  );
  expect(result).toMatchSnapshot();
});
