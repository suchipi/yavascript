import { expect, test } from "vitest";
import { evaluate, evaluateWithTimeout, HANG_TIMEOUT } from "./test-helpers";

const HANG_TEST_TIMEOUT = HANG_TIMEOUT * 4;

test("Promise.map runs at most `concurrency` jobs at a time", async () => {
  const script = `
    const started = [];
    const pendingResolvers = [];
    let active = 0;
    let maxActive = 0;

    const all = Promise.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], (num) => {
      started.push(num);
      active++;
      if (active > maxActive) maxActive = active;
      return new Promise((resolve) => {
        pendingResolvers.push(() => {
          active--;
          resolve(num * 10);
        });
      });
    }, {
      concurrency: 3
    });

    // Promise.map can't advance on its own here: jobs only settle when we resolve one.
    function drainMicrotasks() {
      return new Promise((resolve) => setTimeout(resolve, 0));
    }

    async function main() {
      await drainMicrotasks();
      console.log(\`start: started=[\${started}] active=\${active}\`);

      let step = 0;
      while (pendingResolvers.length > 0) {
        step++;
        pendingResolvers.shift()();
        await drainMicrotasks();
        console.log(\`resolve #\${step}: started=[\${started}] active=\${active}\`);
      }

      console.log("results:", (await all).join(","));
      console.log("maxActive:", maxActive);
    }

    main();
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": null,
      "stderr": "",
      "stdout": "Promise {}
    start: started=[1,2,3] active=3
    resolve #1: started=[1,2,3,4] active=3
    resolve #2: started=[1,2,3,4,5] active=3
    resolve #3: started=[1,2,3,4,5,6] active=3
    resolve #4: started=[1,2,3,4,5,6,7] active=3
    resolve #5: started=[1,2,3,4,5,6,7,8] active=3
    resolve #6: started=[1,2,3,4,5,6,7,8,9] active=3
    resolve #7: started=[1,2,3,4,5,6,7,8,9,10] active=3
    resolve #8: started=[1,2,3,4,5,6,7,8,9,10,11] active=3
    resolve #9: started=[1,2,3,4,5,6,7,8,9,10,11,12] active=3
    resolve #10: started=[1,2,3,4,5,6,7,8,9,10,11,12] active=2
    resolve #11: started=[1,2,3,4,5,6,7,8,9,10,11,12] active=1
    resolve #12: started=[1,2,3,4,5,6,7,8,9,10,11,12] active=0
    results: 10,20,30,40,50,60,70,80,90,100,110,120
    maxActive: 3
    ",
    }
  `);
});

test(
  "Promise.map never resolves without running the mapper",
  async () => {
    const script = `
    async function attempt(concurrency) {
      const calls = [];
      try {
        const result = await Promise.map([1, 2, 3], async (value) => {
          calls.push(value);
          return value;
        }, { concurrency });
        return { settled: "resolved", calls, result };
      } catch (err) {
        return { settled: "rejected", calls };
      }
    }

    Promise.all([attempt(NaN), attempt("abc")]).then(([nan, nonNumericString]) => {
      console.log(JSON.stringify({ nan, nonNumericString }));
    });
    undefined;
  `;

    const result = await evaluateWithTimeout(script);
    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({ code: 0, stderr: "" });

    const outcomes: Record<string, { settled: string; calls: Array<number> }> =
      JSON.parse(result.stdout);
    // Rejecting is fine, and so is falling back to a default concurrency.
    // Resolving with an array the mapper never saw is not.
    const resolvedWithoutMapping = Object.entries(outcomes).filter(
      ([, outcome]) =>
        outcome.settled === "resolved" && outcome.calls.length !== 3,
    );
    expect(resolvedWithoutMapping).toEqual([]);
  },
  HANG_TEST_TIMEOUT,
);

test("Promise.map is non-enumerable", async () => {
  const result = await evaluate(
    `JSON.stringify(Object.getOwnPropertyDescriptor(Promise, "map").enumerable)`,
  );
  expect(result).toMatchObject({ code: 0, stderr: "", stdout: "false\n" });
});
