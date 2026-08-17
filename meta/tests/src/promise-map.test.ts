import { expect, test } from "vitest";
import { evaluate, runYavascript } from "./test-helpers";

test("Promise.map", async () => {
  const script = `
    const delay = env.CI ? 100 : 10;

    const startTime = Date.now();
    
    Promise.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], (num) => {
      const rawTimeOffset = Date.now() - startTime;
      const rounded = Math.round(rawTimeOffset / delay) * delay;
      console.log(rounded);
      return sleep.async(delay);
    }, {
      concurrency: 3
    }).then(() => {
      console.log("after all");
    });
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": null,
      "stderr": "",
      "stdout": "Promise {}
    0
    0
    0
    10
    10
    10
    20
    20
    20
    30
    30
    30
    after all
    ",
    }
  `);
});
