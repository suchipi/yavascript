import { evaluate, rootDir, binaryPath } from "./test-helpers";

const runInWorkerFixturesDir = rootDir.concat(
  "meta/tests/fixtures/run-in-worker",
);

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

test("function rejects", async () => {
  const result = await evaluate(`
    void runInWorker(undefined, () => {
      throw new TypeError("oopsie!");
    }).then(console.log, console.error);
  `);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "TypeError: oopsie!
       at somewhere

   ",
     "stdout": "",
   }
  `);
});

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
