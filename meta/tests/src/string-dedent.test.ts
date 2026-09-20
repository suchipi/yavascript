import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

test("String.dedent handles a hex escape directly before an interpolation", async () => {
  const code = [
    "JSON.stringify(String.dedent`",
    '    A=\\x41${"!"}',
    "  `)",
  ].join("\n");

  const result = await evaluate(code);
  expect(result).toMatchObject({
    code: 0,
    stderr: "",
    stdout: `"A=A!"\n`,
  });
});

test("String.dedent is non-enumerable", async () => {
  const result = await evaluate(
    `JSON.stringify(Object.getOwnPropertyDescriptor(String, "dedent").enumerable)`,
  );
  expect(result).toMatchObject({ code: 0, stderr: "", stdout: "false\n" });
});
