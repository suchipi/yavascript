import * as os from "quickjs:os";

console.log("in main");
const w = new os.Worker("./worker.js");

setTimeout(() => {
  console.log("in main, sending try-to-exit");
  w.postMessage("try-to-exit");
}, 10);
