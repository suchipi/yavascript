// Send back whatever the parent provided as initialData.
Worker.parent.postMessage({ initialData: Worker.initialData });
