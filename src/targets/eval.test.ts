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

      it("can evaluate coffeescript", async () => {
        const run = spawn(binaryPath, [
          flag,
          `console.log "hi"`,
          "--lang",
          "coffeescript",
        ]);
        await run.completion;
        expect(run.result).toEqual({
          code: 0,
          error: false,
          stdout: "hi\n",
          stderr: "",
        });
      });

      it("can evaluate jsx", async () => {
        const run = spawn(binaryPath, [
          flag,
          `<div><a key="hi" href="#" /><></></div>`,
          "--lang",
          "jsx",
        ]);

        const Element = Symbol("JSX.Element");
        const Fragment = Symbol("JSX.Fragment");

        await run.completion;
        expect(run.result).toEqual({
          code: 0,
          error: false,
          stdout:
            inspect({
              $$typeof: Element,
              type: "div",
              props: {
                children: [
                  {
                    $$typeof: Element,
                    type: "a",
                    props: {
                      key: "hi",
                      href: "#",
                    },
                    key: "hi",
                  },
                  {
                    $$typeof: Element,
                    type: Fragment,
                    props: null,
                    key: null,
                  },
                ],
              },
              key: null,
            }) + "\n",
          stderr: "",
        });
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
          expect(run.result).toEqual({
            code: 0,
            error: false,
            stdout: "something\n",
            stderr: "",
          });
        });
      });

      it("can evaluate tsx", async () => {
        const run = spawn(binaryPath, [
          flag,
          `(function something(blah: number) { return <div><a key="hi" href="#" /><></></div> })()`,
          "--lang",
          "tsx",
        ]);

        const Element = Symbol("JSX.Element");
        const Fragment = Symbol("JSX.Fragment");

        await run.completion;
        expect(run.result).toEqual({
          code: 0,
          error: false,
          stdout:
            inspect({
              $$typeof: Element,
              type: "div",
              props: {
                children: [
                  {
                    $$typeof: Element,
                    type: "a",
                    props: {
                      key: "hi",
                      href: "#",
                    },
                    key: "hi",
                  },
                  {
                    $$typeof: Element,
                    type: Fragment,
                    props: null,
                    key: null,
                  },
                ],
              },
              key: null,
            }) + "\n",
          stderr: "",
        });
      });
    });
  });
});
