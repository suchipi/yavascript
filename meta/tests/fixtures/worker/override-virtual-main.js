// With overrideCode, moduleFilename is never read from disk, so a relative
// name for a file that doesn't exist has to work the same as an absolute one.
const worker = new Worker("./does-not-exist-on-disk.js", {
  overrideCode: `Worker.parent.postMessage("override ran with a virtual filename");`,
});
worker.onmessage = (event) => {
  console.log(event.data);
  worker.terminate();
};
