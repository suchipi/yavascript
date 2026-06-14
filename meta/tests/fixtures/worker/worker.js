console.log("in worker");

Worker.parent.onmessage = (event) => {
  console.log("in worker, received:", inspect(event));
  if (event.data === "try-to-exit") {
    exit(1);
  }
};
