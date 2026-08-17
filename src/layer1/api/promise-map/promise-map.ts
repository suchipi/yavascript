import { runJobs, setDebug } from "@parallel-park/run-jobs";
import { logger } from "../logger";

export function map<T, U>(
  inputs: Iterable<T | Promise<T>> | AsyncIterable<T | Promise<T>>,
  mapper: (input: T, index: number, length: number) => Promise<U>,
  options?: {
    concurrency?: number;
  },
): Promise<Array<U>> {
  setDebug(logger.trace);
  return runJobs(inputs, mapper, options);
}

export function install(_Promise: any) {
  _Promise.map = map;
}
