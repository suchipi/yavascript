import { evaluate, inspect } from "../../test-helpers";

test("echo string", async () => {
  const result = await evaluate(`echo("hi");`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "hi\n",
  });
});

test("echo object", async () => {
  const result = await evaluate(`echo({ hi: true });`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect({ hi: true }) + "\n",
  });
});

test("echo multiple", async () => {
  const result = await evaluate(`echo("hi", { hi: true }, "hi again");`);
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "hi " + inspect({ hi: true }) + " hi again\n",
  });
});
