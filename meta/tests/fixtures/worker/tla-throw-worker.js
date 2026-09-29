await Promise.resolve();
throw new Error("thrown after top-level await");
