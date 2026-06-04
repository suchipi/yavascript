import * as os from "quickjs:os";

declare var Worker: typeof os.Worker;

const worker = new Worker("./worker.ts");
worker.onmessage = (event) => {
  console.log("in main, got from worker:", event);
};
worker.postMessage("hi");
