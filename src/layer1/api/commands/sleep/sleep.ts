import * as aMimir from "a-mimir";
import { assert } from "../../assert";
import { types } from "../../types";

// Atomics.wait, which a-mimir uses, treats a NaN timeout as "wait forever".
const millisecondsMessage = "'milliseconds' argument must be a finite number";

function sleep(milliseconds: number) {
  assert.type(milliseconds, types.number, millisecondsMessage);
  aMimir.sleep.sync(milliseconds);
}

const sleep_ = Object.assign(sleep, {
  sync(milliseconds: number) {
    assert.type(milliseconds, types.number, millisecondsMessage);
    aMimir.sleep.sync(milliseconds);
  },
  async(milliseconds: number) {
    try {
      assert.type(milliseconds, types.number, millisecondsMessage);
    } catch (err) {
      return Promise.reject(err);
    }
    return aMimir.sleep.async(milliseconds);
  },
});

export { sleep_ as sleep };
