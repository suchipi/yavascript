const worker = new Worker("./worker.ts");
worker.onmessage = (event) => {
  console.log("in main, got from worker:", event);
};
worker.postMessage("hi");
