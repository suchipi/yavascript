console.log("in main");
const w = new Worker("./worker.js");

w.onmessage = (event) => {
  console.log("message from worker", event);
};

setTimeout(() => {
  console.log("in main, sending try-to-exit");
  w.postMessage("try-to-exit");
}, 10);

setTimeout(() => {
  w.onmessage = null;
}, 20);
