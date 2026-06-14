// This is the worker module's real code. When the Worker is constructed with an
// `overrideCode` option, this code should NOT run; the override should run
// instead.
Worker.parent.postMessage("original worker code ran");
