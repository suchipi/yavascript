import * as engine from "quickjs:engine";
import { Worker } from "./worker";
import { StructuredClonable } from "quickjs:os";

let runInWorkerDynamicFilenamePart = 0;

// Need to prevent worker GC until it's all done.
const activeWorkers = new Set<Worker>();

type FailureDescription = {
  name: string | null;
  message: string | null;
  stack: string | null;
  text: string;
};

// Method shorthand (`foo() {}`) only parses inside an object literal, so it
// can't be wrapped in parens the way a function or arrow expression can.
function sourceAsExpression(fn: Function): string {
  const source = fn.toString();
  const isArrow = /^(?:async\s*)?(?:\([^)]*\)|[\w$]+)\s*=>/.test(source);
  const isMethodShorthand =
    !isArrow &&
    !/^(?:async\s+)?function\b/.test(source) &&
    /^(?:async\s+)?\*?\s*[\w$]+\s*\(/.test(source);

  return isMethodShorthand
    ? `Object.values({ ${source} })[0]`
    : `(${source})`;
}

function failureToError(description: FailureDescription): Error {
  const err = new Error(description.message ?? description.text);
  if (description.name != null) err.name = description.name;
  if (description.stack != null) err.stack = description.stack;
  return err;
}

export function runInWorker<
  Inputs extends StructuredClonable,
  Output extends StructuredClonable,
>(
  inputs: Inputs,
  workerFunction: (inputs: Inputs) => Output | Promise<Output>,
): Promise<Output> {
  const callerFilename = new Path(engine.getFileNameFromStack(1));
  const workerFilename = callerFilename
    .dirname()
    .concat(`runInWorker-virtual-module-${runInWorkerDynamicFilenamePart++}`);

  const worker = new Worker(workerFilename, {
    // The call is inside the try so that a synchronous throw is reported the
    // same way a rejection is, and failures are posted as a plain description
    // when the value itself can't be cloned out of the worker.
    overrideCode: `
      (async () => {
        const post = (message) => Worker.parent.postMessage(message);
        const describe = (err) => ({
          name: err != null && err.name != null ? String(err.name) : null,
          message: err != null && err.message != null ? String(err.message) : null,
          stack: err != null && err.stack != null ? String(err.stack) : null,
          text: String(err),
        });
        const fail = (err) => {
          try {
            post({ type: "reject", cloned: true, value: err });
          } catch (_) {
            post({ type: "reject", cloned: false, value: describe(err) });
          }
        };

        try {
          const result = await ${sourceAsExpression(workerFunction)}(Worker.initialData);
          try {
            post({ type: "resolve", value: result });
          } catch (err) {
            fail(new Error("runInWorker: the worker function's return value could not be transferred out of the worker: " + String(err && err.message || err)));
          }
        } catch (err) {
          fail(err);
        }
      })();
    `,
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
        | { type: "reject"; cloned: true; value: any }
        | { type: "reject"; cloned: false; value: FailureDescription };
    }) => {
      const data = event.data;
      cleanup();

      switch (data.type) {
        case "resolve": {
          resolve(data.value);
          return;
        }
        case "reject": {
          reject(data.cloned ? data.value : failureToError(data.value));
          return;
        }
        default: {
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

    // Without this, a worker that fails before it can post anything (a bad
    // function source, a missing closure variable) leaves this pending.
    worker.onerror = (event) => {
      cleanup();
      reject(event.error ?? new Error(event.message));
    };
  });
}
