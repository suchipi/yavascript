import { spawn } from "first-base";
import { binaryPath } from "../test-helpers";
import { sleep } from "a-mimir";

describe("repl", () => {
  test("basic run", async () => {
    const run = spawn(binaryPath);
    await run.outputContains("> ");
    run.write("2 + 2\n");
    await run.outputContains("4");
    // TODO: it's annoying that you have to hit Ctrl+C more than once
    {
      run.kill("SIGINT");
      await sleep.async(10);
      run.kill("SIGINT");
    }
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
