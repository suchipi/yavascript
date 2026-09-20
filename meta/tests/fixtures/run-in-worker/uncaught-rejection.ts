export {};

await runInWorker(undefined, () => {
  throw new Error("worker fn failed");
});

console.log("after");
