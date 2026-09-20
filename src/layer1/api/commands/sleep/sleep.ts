import * as aMimir from "a-mimir";
import { assert } from "../../assert";
import { types } from "../../types";

function validateMilliseconds(milliseconds: number) {
  // Atomics.wait, which a-mimir uses, treats a NaN timeout as "wait forever".
  assert.type(
    milliseconds,
    types.number,
    "'milliseconds' argument must be a finite number",
  );
}

function sleep(milliseconds: number) {
  validateMilliseconds(milliseconds);
  aMimir.sleep.sync(milliseconds);
}

const sleep_ = Object.assign(sleep, {
  sync(milliseconds: number) {
    validateMilliseconds(milliseconds);
    aMimir.sleep.sync(milliseconds);
  },
  async(milliseconds: number) {
    try {
      validateMilliseconds(milliseconds);
    } catch (err) {
      return Promise.reject(err);
    }
    return aMimir.sleep.async(milliseconds);
  },
});

export { sleep_ as sleep };
