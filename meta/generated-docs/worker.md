- [Worker (class)](#worker-class)
  - [Worker (constructor)](#worker-constructor)
  - [Worker.initialData (static StructuredClonable property)](#workerinitialdata-static-structuredclonable-property)
  - [Worker.parent (static object property)](#workerparent-static-object-property)
  - [Worker.prototype.postMessage (method)](#workerprototypepostmessage-method)
  - [Worker.prototype.onmessage (property)](#workerprototypeonmessage-property)
  - [Worker.prototype.onerror (property)](#workerprototypeonerror-property)
  - [Worker.prototype.terminate (method)](#workerprototypeterminate-method)
- [StructuredClonable (type)](#structuredclonable-type)

# Worker (class)

Workers can be used for multi-threaded, concurrent work.

YavaScript's global `Worker` class is a subclass of the QuickJS's
[os.Worker](/meta/generated-docs/os.md#quickjsosworker-exported-class) which loads all of the YavaScript API globals into the
Worker's global context.

It behaves similar to [Web
Workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker).

```ts
declare class Worker {
  constructor(
    moduleFilename: string,
    options?: {
      overrideCode?: string;
      initialData?: StructuredClonable;
    },
  );
  static initialData: StructuredClonable;
  static parent: {
    postMessage(msg: StructuredClonable): void;
    onmessage: null | ((event: { data: StructuredClonable }) => void);
  };
  postMessage(msg: StructuredClonable): void;
  onmessage: null | ((event: { data: StructuredClonable }) => void);
  onerror:
    | null
    | ((event: {
        message: string;
        filename: string;
        lineno: number;
        error: Error | null;
      }) => void);
  terminate(): void;
}
```

## Worker (constructor)

Create a Worker which runs the module at `moduleFilename`.

If `options.overrideCode` is present, the Worker instead runs a synthetic
module with filename `moduleFilename` and source code
`options.overrideCode` (JS source code string). In this case,
`moduleFilename` is not read from disk and is only used as the module's
assigned filename for import.meta, module resolution, etc.

If `options.initialData` is present, it'll be available within the worker
as the static `initialData` property on the Worker constructor.

```ts
constructor(moduleFilename: string, options?: {
  overrideCode?: string;
  initialData?: StructuredClonable;
});
```

## Worker.initialData (static StructuredClonable property)

If accessed within a Worker, and the Worker was constructed with
non-undefined `initialData`, then this will be a structured clone of that
initial data.

Outside of a worker, this is always `undefined`.

```ts
static initialData: StructuredClonable;
```

## Worker.parent (static object property)

Worker-side communication channel back to the parent context that invoked
it (ie. the main thread).

```ts
static parent: {
  postMessage(msg: StructuredClonable): void;
  onmessage: null | ((event: {
    data: StructuredClonable;
  }) => void);
};
```

## Worker.prototype.postMessage (method)

Send a message from the main thread to the worker.

```ts
postMessage(msg: StructuredClonable): void;
```

## Worker.prototype.onmessage (property)

This function is called when a message arrives from the Worker. You may
override this property with your own function.

```ts
onmessage: null | ((event: {
  data: StructuredClonable;
}) => void);
```

## Worker.prototype.onerror (property)

If an unhandled Error is thrown in the Worker or an unhandled Promise is
rejected in the worker, this `onerror` function will be run.

When `onerror` is unset, errors print to stderr.

```ts
onerror: null | ((event: {
  message: string;
  filename: string;
  lineno: number;
  error: Error | null;
}) => void);
```

## Worker.prototype.terminate (method)

Terminate the worker thread. Equivalent to setting `onmessage` to `null`.

```ts
terminate(): void;
```

# StructuredClonable (type)

Types which can be sent to/from Workers.

```ts
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
  | {
      [key: string | number]: StructuredClonable;
    };
```
