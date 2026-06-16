export {};

const result = await runInWorker(undefined, () => {
  const sample = require("./sample-module");
  // Note: can't return module namespace object directly as it isn't supported
  // by structured clone algorithm.
  return { ...sample };
});

console.log(result);
