import { expect, test } from "vitest";
import { evaluate, evaluateWithTimeout, HANG_TIMEOUT } from "./test-helpers";

/**
 * vitest's own per-test timeout has to be comfortably above HANG_TIMEOUT, or
 * it fires first and the test reports a timeout instead of the real failure.
 */
const HANG_TEST_TIMEOUT = HANG_TIMEOUT * 4;

test("sleep", async () => {
  const result = await evaluate(
    `
      sleep(10);
      sleep.sync(10);
      sleep.async(10).then(() => console.log('hi'));
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "Promise {}
   hi
   ",
   }
  `);
});

test(
  "sleep - an invalid duration doesn't block forever",
  async () => {
    const calls = [
      "sleep()",
      "sleep(undefined)",
      "sleep(NaN)",
      "sleep(Infinity)",
      `sleep("1s")`,
      "sleep.sync()",
      "sleep.sync(NaN)",
      `sleep.sync("1s")`,
    ];

    // Each call gets its own process, so they can be raced instead of costing
    // HANG_TIMEOUT apiece.
    const results = await Promise.all(
      calls.map((code) => evaluateWithTimeout(code)),
    );

    const hung = calls.filter((_, index) => results[index].timedOut);
    expect(hung).toEqual([]);
  },
  HANG_TEST_TIMEOUT,
);
