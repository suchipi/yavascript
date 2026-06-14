const worker = new Worker("./globals-worker.js");
worker.onmessage = (event) => {
  console.log(inspect(event.data));
  worker.terminate();
};
