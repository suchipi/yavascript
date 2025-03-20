import * as std from "quickjs:std";
import { assert } from "../assert";
import { inspectManyToParts } from "../shared/make-inspect-log";
import { types } from "../types";
import { dim } from "../strings";

type LoggerFunction = (...args: Array<any>) => void;

const noop = () => {};

let _info: LoggerFunction = (...args: Array<any>) => {
  const parts = inspectManyToParts(args);
  const len = parts.length;
  for (let i = 0; i < len; i++) {
    std.err.puts(dim(parts[i]));
  }
  std.err.puts("\n");
};
let _trace: LoggerFunction = noop;

export const logger = {
  get info() {
    return _info;
  },
  set info(newValue: LoggerFunction) {
    assert.type(
      newValue,
      types.anyFunction,
      "'logger.info' must be a function"
    );
    _info = newValue;
  },
  get trace() {
    return _trace;
  },
  set trace(newValue: LoggerFunction) {
    assert.type(
      newValue,
      types.anyFunction,
      "'logger.trace' must be a function"
    );
    _trace = newValue;
  },
};
