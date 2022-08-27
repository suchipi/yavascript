///<reference types="@test-it/core/globals" />
import { evaluate } from "../test-helpers";

test("paths.resolve with already-absolute path", async () => {
  const result = await evaluate(`paths.resolve("/hi/there/yeah")`);

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "/hi/there/yeah\n",
  });
});

test("paths.resolve with absolute path with . and ..s in it", async () => {
  const result = await evaluate(`paths.resolve("/hi/./there/yeah/../yup/./")`);

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "/hi/there/yup\n",
  });
});
