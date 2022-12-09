import { spawn } from "first-base";
import { binaryPath, inspect } from "../test-helpers";

describe("eval target", () => {
  ["-e", "--eval"].forEach((flag) => {
    describe(`via ${flag}`, () => {
      it("evaluates the specified code", async () => {
        const run = spawn(binaryPath, [flag, `console.log("hi")`]);
        await run.completion;
        expect(run.result).toMatchSnapshot();
      });

      it("prints the result when it's not undefined", async () => {
        const run = spawn(binaryPath, [flag, `24`]);
        await run.completion;
        expect(run.result).toMatchSnapshot();
      });

      it("doesn't print anything when the code results in undefined", async () => {
        const run = spawn(binaryPath, [flag, `void 0`]);
        await run.completion;
        expect(run.result).toMatchSnapshot();
      });

      it("prints non-empty completion value", async () => {
        const run = spawn(binaryPath, [flag, `"hello"; var a = 5;`]);
        await run.completion;
        expect(run.result).toMatchSnapshot();
      });

      it("can evaluate coffeescript", async () => {
        const run = spawn(binaryPath, [
          flag,
          `console.log "hi"`,
          "--lang",
          "coffeescript",
        ]);
        await run.completion;
        expect(run.result).toMatchSnapshot();
      });

      it("can evaluate jsx", async () => {
        const run = spawn(binaryPath, [
          flag,
          `<div><a key="hi" href="#" /><></></div>`,
          "--lang",
          "jsx",
        ]);
        await run.completion;
        expect(run.result).toMatchSnapshot();
      });

      ["ts", "typescript"].forEach((lang) => {
        it(`can evaluate typescript (via --lang ${lang})`, async () => {
          const run = spawn(binaryPath, [
            flag,
            `(function something<T>(blah: number): T { return 5 as any; }).name`,
            "--lang",
            lang,
          ]);
          await run.completion;
          expect(run.result).toMatchSnapshot();
        });
      });

      it("can evaluate tsx", async () => {
        const run = spawn(binaryPath, [
          flag,
          `(function something(blah: number) { return <div><a key="hi" href="#" /><></></div> })()`,
          "--lang",
          "tsx",
        ]);

        await run.completion;
        expect(run.result).toMatchSnapshot();
      });
    });
  });
});
