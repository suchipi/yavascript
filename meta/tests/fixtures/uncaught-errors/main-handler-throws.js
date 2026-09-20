const worker = new Worker("./post-once-worker.js");
worker.onmessage = () => {
  // Drop the worker first, so that the only thing keeping the process alive
  // after the throw is the throw itself.
  worker.onmessage = null;
  throw new Error("main-side handler threw");
};
