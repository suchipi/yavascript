import { evaluate, inspect } from "./test-helpers";

test("prints thrown errors to stderr", async () => {
  const result = await evaluate(`blahhhh`);

  expect(result).toEqual({
    code: 1,
    error: false,
    stderr:
      "ReferenceError: 'blahhhh' is not defined\n  at <eval> (<evalScript>)\n",
    stdout: "",
  });
});

test("prints thrown non-errors to stderr", async () => {
  const result = await evaluate(`throw "nope"`);
  expect(result).toEqual({
    code: 1,
    error: false,
    stderr: "Non-error value was thrown: " + inspect("nope") + "\n",
    stdout: "",
  });
});

test("prints extra error properties to stderr", async () => {
  const result = await evaluate(
    `e = new Error('hi'); e.something = true; e.somethingElse = false; throw e;`
  );
  expect(result).toEqual({
    code: 1,
    error: false,
    stderr:
      "Error: hi\n  at <eval> (<evalScript>) " +
      inspect({ something: true, somethingElse: false }) +
      "\n",
    stdout: "",
  });
});
