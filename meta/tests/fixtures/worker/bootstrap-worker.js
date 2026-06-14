// Used by the yavascript-bootstrap test. Reports that yavascript globals, the
// Worker global, and initialData all work inside a worker spawned from a
// yavascript-bootstrap program.
Worker.parent.postMessage({
  hasEcho: typeof echo === "function",
  hasYavascript: typeof yavascript === "object",
  hasWorker: typeof Worker === "function",
  initialData: Worker.initialData,
});
