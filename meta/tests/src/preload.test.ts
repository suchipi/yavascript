import { spawn } from "first-base";
import { binaryPath, cleanResult, rootDir } from "./test-helpers";

const loggingFixture = rootDir.concat("meta/tests/fixtures/logging");

describe("file preloading", () => {
  describe("in eval target", () => {
    describe("one file", () => {
      it("loads that file, then evaluates the specified code", async () => {
        const run = spawn(binaryPath, [
          "-r",
          loggingFixture("log-1.js"),
          "-e",
          `console.log("hi")`,
        ]);
        await run.completion;
        expect(run.result).toMatchInlineSnapshot(`
          {
            "code": 0,
            "error": false,
            "stderr": "",
            "stdout": "1
          hi
          ",
          }
        `);
      });
    });

    describe("multiple files", () => {
      it("loads those files in the specified order, then evaluates the specified code", async () => {
        const run = spawn(binaryPath, [
          "-r",
          loggingFixture("log-two.ts"),
          "-r",
          loggingFixture("log-three.coffee"),
          "-r",
          loggingFixture("log-1.js"),
          "-e",
          `console.log("hi")`,
        ]);
        await run.completion;
        expect(run.result).toMatchInlineSnapshot(`
          {
            "code": 0,
            "error": false,
            "stderr": "",
            "stdout": "two
          three
          1
          hi
          ",
          }
        `);
      });
    });
  });

  describe("in repl target", () => {
    describe("one file", () => {
      it("loads that file, then starts the repl", async () => {
        const run = spawn(binaryPath, ["-r", loggingFixture("log-1.js")]);
        await run.outputContains(">");
        run.kill("SIGINT");
        await run.outputContains("Press Ctrl-C again");
        run.kill("SIGINT");
        await run.completion;
        expect(cleanResult(run.result)).toMatchInlineSnapshot(`
          {
            "code": 0,
            "error": false,
            "stderr": "",
            "stdout": "1
          > 
          (Press Ctrl-C again to quit)
          > 
          ",
          }
        `);
      });
    });

    describe("multiple files", () => {
      it("loads those files in the specified order, then starts the repl", async () => {
        const run = spawn(binaryPath, [
          "-r",
          loggingFixture("log-two.ts"),
          "-r",
          loggingFixture("log-three.coffee"),
          "-r",
          loggingFixture("log-1.js"),
        ]);
        await run.outputContains(">");
        run.kill("SIGINT");
        await run.outputContains("Press Ctrl-C again");
        run.kill("SIGINT");
        await run.completion;
        expect(cleanResult(run.result)).toMatchInlineSnapshot(`
          {
            "code": 0,
            "error": false,
            "stderr": "",
            "stdout": "two
          three
          1
          > 
          (Press Ctrl-C again to quit)
          > 
          ",
          }
        `);
      });
    });
  });

  describe("in run-file target", () => {
    describe("one file", () => {
      it("loads that file, then runs the main file", async () => {
        const run = spawn(binaryPath, [
          "-r",
          loggingFixture("log-1.js"),
          loggingFixture("log-two.ts"),
        ]);
        await run.completion;
        expect(run.result).toMatchInlineSnapshot(`
          {
            "code": 0,
            "error": false,
            "stderr": "",
            "stdout": "1
          two
          ",
          }
        `);
      });
    });

    describe("multiple files", () => {
      it("loads those files in the specified order, then runs the main file", async () => {
        const run = spawn(binaryPath, [
          "-r",
          loggingFixture("log-two.ts"),
          "-r",
          loggingFixture("log-three.coffee"),
          loggingFixture("log-1.js"),
        ]);
        await run.completion;
        expect(run.result).toMatchInlineSnapshot(`
          {
            "code": 0,
            "error": false,
            "stderr": "",
            "stdout": "two
          three
          1
          ",
          }
        `);
      });
    });
  });
});
