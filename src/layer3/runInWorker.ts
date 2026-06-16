import * as engine from "quickjs:engine";
import { Worker } from "./worker";
import { StructuredClonable } from "quickjs:os";

let runInWorkerDynamicFilenamePart = 0;

// Need to prevent worker GC until it's all done.
const activeWorkers = new Set<Worker>();

export function runInWorker<
  Inputs extends StructuredClonable,
  Output extends StructuredClonable,
>(
  inputs: Inputs,
  workerFunction: (inputs: Inputs) => Promise<Output>,
): Promise<Output> {
  const callerFilename = new Path(engine.getFileNameFromStack(1));
  const workerFilename = callerFilename
    .dirname()
    .concat(`runInWorker-virtual-module-${runInWorkerDynamicFilenamePart++}`);
  const worker = new Worker(workerFilename, {
    overrideCode: `Promise.resolve((${workerFunction.toString()})(Worker.initialData))
      .then((result) => Worker.parent.postMessage({ type: "resolve", value: result }))
      .catch((err) => Worker.parent.postMessage({ type: "reject", value: err }));`,
    initialData: inputs,
  });
  activeWorkers.add(worker);

  const cleanup = () => {
    worker.terminate();
    activeWorkers.delete(worker);
  };

  return new Promise((resolve, reject) => {
    worker.onmessage = ((event: {
      data:
        | { type: "resolve"; value: Output }
        | { type: "reject"; value: Error };
    }) => {
      switch (event.data.type) {
        case "resolve": {
          cleanup();
          resolve(event.data.value);
          return;
        }
        case "reject": {
          cleanup();
          reject(event.data.value);
          return;
        }
        default: {
          cleanup();
          reject(
            Object.assign(
              new Error(
                "Unexpected message from worker; see 'event' property for more info",
              ),
              { event },
            ),
          );
        }
      }
    }) as typeof worker.onmessage;
  });
}
