import { expect, test } from "vitest";
import {
  evaluate,
  evaluateWithTimeout,
  runYavascriptWithTimeout,
  rootDir,
  binaryPath,
  HANG_TIMEOUT,
} from "./test-helpers";

const runInWorkerFixturesDir = rootDir.concat(
  "meta/tests/fixtures/run-in-worker",
);

/**
 * vitest's own per-test timeout has to be comfortably above HANG_TIMEOUT, or
 * it fires first and the test reports a timeout instead of the real failure.
 */
const HANG_TEST_TIMEOUT = HANG_TIMEOUT * 4;

test("basic functionality", async () => {
  const result = await evaluate(`
    void runInWorker(2, function addThree(i) {
      return i + 3;
    }).then(console.log, console.error);
  `);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "5
   ",
   }
  `);
});

test("async", async () => {
  const result = await evaluate(`
    void runInWorker(2, function addThree(i) {
      return Promise.resolve(i + 3);
    }).then(console.log, console.error);
  `);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "5
   ",
   }
  `);
});

test(
  "a worker function that throws a string rejects with that string",
  async () => {
    const result = await evaluateWithTimeout(`
    void runInWorker(undefined, () => {
      throw "a string";
    }).then(
      (value) => console.log("resolved: " + value),
      (err) => console.log("rejected: " + err),
    );
  `);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "rejected: a string\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "a worker function that throws an Error rejects with that error",
  async () => {
    const result = await evaluateWithTimeout(`
    void runInWorker(undefined, () => {
      throw new TypeError("oopsie!");
    }).then(
      (value) => console.log("resolved: " + value),
      (err) => console.log("rejected: " + err.name + ": " + err.message),
    );
  `);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "rejected: TypeError: oopsie!\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "an async worker function that rejects with an Error rejects the returned promise",
  async () => {
    const result = await evaluateWithTimeout(`
    void runInWorker(undefined, async () => {
      throw new TypeError("async oopsie!");
    }).then(
      (value) => console.log("resolved: " + value),
      (err) => console.log("rejected: " + err.name + ": " + err.message),
    );
  `);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "rejected: TypeError: async oopsie!\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "a worker function that returns a non-clonable value rejects",
  async () => {
    const result = await evaluateWithTimeout(`
    void runInWorker(undefined, () => {
      return function notClonable() {};
    }).then(
      () => console.log("resolved"),
      () => console.log("rejected"),
    );
  `);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "rejected\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "a worker function that reads a closure variable rejects",
  async () => {
    const result = await evaluateWithTimeout(`
    const secret = 42;
    void runInWorker(undefined, () => secret).then(
      (value) => console.log("resolved: " + value),
      (err) => console.log("rejected: " + err.name),
    );
  `);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "rejected: ReferenceError\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "a worker function written with method shorthand syntax runs",
  async () => {
    const result = await evaluateWithTimeout(`
    const obj = {
      addThree(i) {
        return i + 3;
      },
    };
    void runInWorker(2, obj.addThree).then(
      (value) => console.log("resolved: " + value),
      (err) => console.log("rejected: " + err.name + ": " + err.message),
    );
  `);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "resolved: 5\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "a bound worker function rejects",
  async () => {
    const result = await evaluateWithTimeout(`
    const bound = function addThree(i) {
      return i + 3;
    }.bind(null);
    void runInWorker(2, bound).then(
      () => console.log("resolved"),
      () => console.log("rejected"),
    );
  `);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "rejected\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "a rejection can be caught by the caller, and code after the await runs",
  async () => {
    const result = await runYavascriptWithTimeout([
      runInWorkerFixturesDir("caught-rejection.ts"),
    ]);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "caught: worker fn failed\nafter\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "an uncaught rejection from an awaited call makes the process exit nonzero",
  async () => {
    const result = await runYavascriptWithTimeout([
      runInWorkerFixturesDir("uncaught-rejection.ts"),
    ]);

    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 1,
      stdout: "",
    });
  },
  HANG_TEST_TIMEOUT,
);

test("loading a module from a worker", async () => {
  const result = await evaluate(`
    void import(${JSON.stringify(runInWorkerFixturesDir("require-from-worker-function.ts"))});
  `);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     chunky: "bacon"
   }
   ",
   }
  `);
});
