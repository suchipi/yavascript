export {};

try {
  await runInWorker(undefined, () => {
    throw new Error("worker fn failed");
  });
  console.log("the worker function didn't throw");
} catch (err) {
  console.log("caught: " + err.message);
}

console.log("after");
