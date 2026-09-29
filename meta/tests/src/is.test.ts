import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

test("is - returns a boolean", async () => {
  const script = `
    JSON.stringify([
      typeof is(1, (value) => "yes"),
      typeof is(1, async (value) => false),
      typeof is(1, types.arrayOf),
    ]);
  `;

  const result = await evaluate(script);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '["boolean","boolean","boolean"]\n',
  });
});
