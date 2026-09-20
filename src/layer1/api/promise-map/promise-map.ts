import { runJobs, setDebug } from "@parallel-park/run-jobs";
import { logger } from "../logger";
import { assert } from "../assert";
import { types } from "../types";

export function map<T, U>(
  inputs: Iterable<T | Promise<T>> | AsyncIterable<T | Promise<T>>,
  mapper: (input: T, index: number, length: number) => Promise<U>,
  options?: {
    concurrency?: number;
  },
): Promise<Array<U>> {
  // runJobs compares concurrency with "<", which is false for NaN, so it
  // starts no jobs at all and resolves with an array of holes.
  if (options != null && options.concurrency != null) {
    assert.type(
      options.concurrency,
      types.or(types.number, types.Infinity),
      "when present, 'concurrency' option must be a number",
    );
  }

  setDebug(logger.trace);
  return runJobs(inputs, mapper, options);
}

export function install(_Promise: any) {
  Object.defineProperty(_Promise, "map", {
    enumerable: false,
    writable: true,
    configurable: true,
    value: map,
  });
}
