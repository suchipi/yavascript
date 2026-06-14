/**
 * Workers can be used for multi-threaded, concurrent work.
 *
 * YavaScript's global `Worker` class is a subclass of the QuickJS's
 * {@link os.Worker} which loads all of the YavaScript API globals into the
 * Worker's global context.
 *
 * It behaves similar to [Web
 * Workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker).
 */
declare class Worker {
  /**
   * Create a Worker which runs the module at `moduleFilename`.
   *
   * If `options.overrideCode` is present, the Worker instead runs a synthetic
   * module with filename `moduleFilename` and source code
   * `options.overrideCode` (JS source code string). In this case,
   * `moduleFilename` is not read from disk and is only used as the module's
   * assigned filename for import.meta, module resolution, etc.
   *
   * If `options.initialData` is present, it'll be available within the worker
   * as the static `initialData` property on the Worker constructor.
   */
  constructor(
    moduleFilename: string,
    options?: {
      overrideCode?: string;
      initialData?: StructuredClonable;
    },
  );

  /**
   * If accessed within a Worker, and the Worker was constructed with
   * non-undefined `initialData`, then this will be a structured clone of that
   * initial data.
   *
   * Outside of a worker, this is always `undefined`.
   */
  static initialData: StructuredClonable;

  /**
   * Worker-side communication channel back to the parent context that invoked
   * it (ie. the main thread).
   */
  static parent: {
    /** Send a message from the worker back to the main thread. */
    postMessage(msg: StructuredClonable): void;

    /**
     * This function is called when a message arrives from the parent. You may
     * override this property with your own function.
     */
    onmessage: null | ((event: { data: StructuredClonable }) => void);
  };

  /** Send a message from the main thread to the worker. */
  postMessage(msg: StructuredClonable): void;

  /**
   * This function is called when a message arrives from the Worker. You may
   * override this property with your own function.
   */
  onmessage: null | ((event: { data: StructuredClonable }) => void);

  /**
   * If an unhandled Error is thrown in the Worker or an unhandled Promise is
   * rejected in the worker, this `onerror` function will be run.
   *
   * When `onerror` is unset, errors print to stderr.
   */
  onerror:
    | null
    | ((event: {
        message: string;
        filename: string;
        lineno: number;
        error: Error | null;
      }) => void);

  /**
   * Terminate the worker thread. Equivalent to setting `onmessage` to `null`.
   */
  terminate(): void;
}

/** Types which can be sent to/from Workers. */
declare type StructuredClonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Boolean
  | String
  | Date
  | RegExp
  | ArrayBuffer
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
  | DataView
  | Array<StructuredClonable>
  | SharedArrayBuffer
  | { [key: string | number]: StructuredClonable };
