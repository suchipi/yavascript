// Echo messages from the parent back to the parent, proving bidirectional
// communication via Worker.parent works.
Worker.parent.onmessage = (event) => {
  Worker.parent.postMessage("worker received: " + event.data);
};
