///<reference types="@test-it/core/globals" />
import { spawn } from "first-base";
import { binaryPath, inspect } from "../test-helpers";

describe("eval target", () => {
  ["-e", "--eval"].forEach((flag) => {
    describe(`via ${flag}`, () => {
      it("evaluates the specified code", async () => {
        const run = spawn(binaryPath, [flag, `console.log("hi")`]);
        await run.completion;
        expect(run.result).toEqual({
          code: 0,
          error: false,
          stdout: "hi\n",
          stderr: "",
        });
      });

      it("prints the result when it's not undefined", async () => {
        const run = spawn(binaryPath, [flag, `24`]);
        await run.completion;
        expect(run.result).toEqual({
          code: 0,
          error: false,
          stdout: inspect(24) + "\n",
          stderr: "",
        });
      });

      it("doesn't print anything when the code results in undefined", async () => {
        const run = spawn(binaryPath, [flag, `void 0`]);
        await run.completion;
        expect(run.result).toEqual({
          code: 0,
          error: false,
          stdout: "",
          stderr: "",
        });
      });

      it("prints non-empty completion value", async () => {
        const run = spawn(binaryPath, [flag, `"hello"; var a = 5;`]);
        await run.completion;
        expect(run.result).toEqual({
          code: 0,
          error: false,
          stdout: "hello\n",
          stderr: "",
        });
      });
    });
  });
});
