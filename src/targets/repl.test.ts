import { spawn } from "first-base";
import { binaryPath } from "../test-helpers";

describe("repl", () => {
  test("basic run", async () => {
    const run = spawn(binaryPath);
    await run.outputContains("> ");
    run.write("2 + 2\n");
    await run.outputContains("4");
    run.kill("SIGINT"); // Ctrl-C
    await run.outputContains("Press Ctrl-C again");
    run.kill("SIGINT");
    await run.completion;
    expect(run.result).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "> 2 + 2
      4
      > 
      (Press Ctrl-C again to quit)
      > 
      ",
      }
    `);
  });
});
