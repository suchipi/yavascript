const worker = new Worker("./initial-data-worker.js", {
  initialData: { greeting: "hello", count: 3, nested: { ok: true } },
});
worker.onmessage = (event) => {
  console.log(inspect(event.data));
  worker.terminate();
};
