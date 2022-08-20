///<reference types="@test-it/core/globals" />
import path from "path";
import { evaluate } from "../test-helpers";
import { inspect } from "./inspect";

// TODO: this test is incomplete and is failing
test("sample glob", async () => {
  const dir = path.join(__dirname, "test_fixtures/glob 1");
  const patterns = ["**/*"];

  const result = await evaluate(
    `glob(${JSON.stringify(dir)}, ${JSON.stringify(patterns)})`
  );

  const expected = [];

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect(expected.map((filename) => path.join(dir, filename))) + "\n",
  });
});
