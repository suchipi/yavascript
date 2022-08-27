///<reference types="@test-it/core/globals" />
import { evaluate, inspect } from "../test-helpers";

test("console.log string", async () => {
  const result = await evaluate(`console.log("hi");`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "hi\n",
  });
});

test("console.info string", async () => {
  const result = await evaluate(`console.info("hi");`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "hi\n",
  });
});

test("console.warn string", async () => {
  const result = await evaluate(`console.warn("hi");`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "hi\n",
    stdout: "",
  });
});

test("console.error string", async () => {
  const result = await evaluate(`console.error("hi");`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "hi\n",
    stdout: "",
  });
});

test("console.log object", async () => {
  const result = await evaluate(`console.log({ hi: true });`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect({ hi: true }) + "\n",
  });
});

test("console.info object", async () => {
  const result = await evaluate(`console.info({ hi: true });`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect({ hi: true }) + "\n",
  });
});

test("console.warn object", async () => {
  const result = await evaluate(`console.warn({ hi: true });`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: inspect({ hi: true }) + "\n",
    stdout: "",
  });
});

test("console.error object", async () => {
  const result = await evaluate(`console.error({ hi: true });`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: inspect({ hi: true }) + "\n",
    stdout: "",
  });
});

test("console.log multiple", async () => {
  const result = await evaluate(`console.log("hi", { hi: true }, "hi again");`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "hi " + inspect({ hi: true }) + " hi again\n",
  });
});

test("console.info multiple", async () => {
  const result = await evaluate(
    `console.info("hi", { hi: true }, "hi again");`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "hi " + inspect({ hi: true }) + " hi again\n",
  });
});

test("console.warn multiple", async () => {
  const result = await evaluate(
    `console.warn("hi", { hi: true }, "hi again");`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "hi " + inspect({ hi: true }) + " hi again\n",
    stdout: "",
  });
});

test("console.error multiple", async () => {
  const result = await evaluate(
    `console.error("hi", { hi: true }, "hi again");`
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "hi " + inspect({ hi: true }) + " hi again\n",
    stdout: "",
  });
});
