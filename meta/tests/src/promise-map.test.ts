import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

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
