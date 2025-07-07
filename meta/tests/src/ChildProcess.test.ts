import {
  evaluate,
  binaryPath,
  inspect,
  cleanResult,
  TMP,
} from "./test-helpers";

test("sync stuff", async () => {
  const result = await evaluate(`
    const child = new ChildProcess("true");
    child.start();
    const result = child.waitUntilComplete();
    console.log(result);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      status: 0
      signal: undefined
    }
    ",
    }
  `);
});

test("async stuff", async () => {
  const result = await evaluate(`
    const child = new ChildProcess("sleep 1");
    console.log("before", child.state);
    child.start();
    console.log("immediately after start", child.state);
    sleep(500);
    console.log("during", child.state);
    sleep(1000);
    console.log("after", child.state);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "before {
      id: "UNSTARTED"
    }
    immediately after start {
      id: "STARTED"
      pid: <redacted>
    }
    during {
      id: "STARTED"
      pid: <redacted>
    }
    after {
      id: "EXITED"
      oldPid: <redacted>
      status: 0
    }
    ",
    }
  `);
});
