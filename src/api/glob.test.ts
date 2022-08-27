///<reference types="@test-it/core/globals" />
import path from "path";
import { evaluate, inspect } from "../test-helpers";

test("sample glob", async () => {
  const dir = path.join(__dirname, "test_fixtures/glob 1");
  const patterns = ["**/*"];

  const result = await evaluate(
    `glob(${JSON.stringify(dir)}, ${JSON.stringify(patterns)})`
  );

  const expected = [
    "potato",
    "potato/banana",
    "potato/banana/yo.txt",
    "potato/banana/yo.js",
    "potato/eggplant",
    "hi.js",
    "hi.txt",
    "cabana",
    "hi",
    "hi/there.txt",
  ];

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      inspect(expected.map((filename) => path.join(dir, filename))) + "\n",
  });
});
