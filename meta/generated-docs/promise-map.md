- [PromiseConstructor (interface)](#promiseconstructor-interface)
  - [PromiseConstructor.map (method)](#promiseconstructormap-method)

# PromiseConstructor (interface)

```ts
interface PromiseConstructor {
  map<T, U>(
    inputs: Iterable<T | Promise<T>> | AsyncIterable<T | Promise<T>>,
    mapper: (input: T, index: number, length: number) => Promise<U>,
    {
      concurrency,
    }?: {
      concurrency?: number;
    },
  ): Promise<Array<U>>;
}
```

## PromiseConstructor.map (method)

Like Promise.all, but instead of running everything at once, it'll only run
a few Promises at a time (you can choose how many to run at once). It's
inspired by [Bluebird's Promise.map
function](https://bluebirdjs.com/docs/api/promise.map.html).

To use it, you pass in an iterable (array, set, generator function, etc) of
inputs and a mapper function that transforms each input into a Promise. You
can also optionally specify the maximum number of Promises to wait on at a
time by passing an object with a concurrency property, which is a number.
The concurrency defaults to 8.

When using an iterable, if the iterable yields a Promise (ie.
iterable.next() returns { done: false, value: Promise }), then the yielded
Promise will be awaited before being passed into your mapper function.
Additionally, async iterables are supported; if iterable.next() returns a
Promise, it will be awaited.

```ts
map<T, U>(inputs: Iterable<T | Promise<T>> | AsyncIterable<T | Promise<T>>, mapper: (input: T, index: number, length: number) => Promise<U>, {
  concurrency
}?: {
  concurrency?: number;
}): Promise<Array<U>>;
```
