- [runInWorker (function)](#runinworker-function)

# runInWorker (function)

Run the following function inside of a [Worker](/meta/generated-docs/worker.md) (ie another thread).

- `@param` _inputs_ — Values to clone across to the worker and pass into the function.
- `@param` _workerFunction_ — Sync or async function to run on the worker side, which receives `inputs` as its first argument.
- `@returns` A Promise which resolves to `workerFunction(inputs)` (evaluated in the worker thread).

> NOTE: `workerFunction` gets turned into a source code string which gets
> evaluated in the other thread. Therefore, it can't access any closure
> variables. To pass data into the function, use the `inputs` parameter.

Example:

```ts
const someName = "bob";
// By passing `someName` as a property of `inputs` and destructuring it from
// the first parameter to `workerFunction`, we can reference it with the same
// name it uses outside of `workerFunction`. It's not a true closure, but it
// feels like one.
const uppercased = runInWorker({ someName }, ({ someName }) => {
  return someName.toUpperCase();
});
console.log(uppercased); // "BOB"
```

If you need to access imports inside the worker, use [require](/meta/generated-docs/modulesys.md#requirefunction-call-signature).

> NOTE: Because `inputs` and the return value of `workerFunction` must cross
> the thread boundary, the data is cloned and re-created on the other side.
> Not all types can be cloned. The types which can be cloned are: `string`,
> `number`, `boolean`, `null`, `undefined`, Arrays, Objects, `Date`,
> `RegExp`, `ArrayBuffer`, Typed arrays, `DataView`, and instances of native
> Error constructors (`Error`, `TypeError`, etc).
>
> SharedArrayBuffer can also be used to shared live data across the worker
> and main thread.

```ts
declare function runInWorker<
  Inputs extends import("quickjs:os").StructuredClonable,
  Output extends import("quickjs:os").StructuredClonable,
>(
  inputs: Inputs,
  workerFunction: (inputs: Inputs) => Promise<Output>,
): Promise<Output>;
```
