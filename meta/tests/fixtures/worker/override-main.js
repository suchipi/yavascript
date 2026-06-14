const worker = new Worker("./override-worker.js", {
  overrideCode: `Worker.parent.postMessage("override code ran; typeof echo is " + typeof echo);`,
});
worker.onmessage = (event) => {
  console.log(event.data);
  worker.terminate();
};
