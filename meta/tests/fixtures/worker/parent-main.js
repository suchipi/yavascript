const worker = new Worker("./parent-worker.js");
worker.onmessage = (event) => {
  console.log("main received: " + event.data);
  worker.terminate();
};
worker.postMessage("hello from main");
