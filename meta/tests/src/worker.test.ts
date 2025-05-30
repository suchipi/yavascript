import { runYavascript, cleanResult, rootDir } from "./test-helpers";

const workerFixturesDir = rootDir.concat("meta/tests/fixtures/worker");

// TODO: Change to use yavascript `exit` instead of quickjs `std.exit`, once
// workers get the yavascript globals
test("worker cannot call std.exit", async () => {
  const result = await runYavascript([workerFixturesDir("main.js")]);

  // Note that the Error in the worker doesn't cause the main thread to exit
  // with a nonzero status code.
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "Error: std.exit can only be called from the main thread
      at somewhere

    ",
      "stdout": "in main
    in worker
    in main, sending try-to-exit
    in worker, received: {
    	data: "try-to-exit"
    }
    ",
    }
  `);
});
