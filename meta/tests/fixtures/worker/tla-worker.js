const message = await Promise.resolve("top-level await worker ok");
Worker.parent.postMessage(message);
