import * as aMimir from "a-mimir";

function sleep(milliseconds: number) {
  aMimir.sleep.sync(milliseconds);
}

const sleep_ = Object.assign(sleep, {
  sync: aMimir.sleep.sync,
  async: aMimir.sleep.async,
});

export { sleep_ as sleep };
