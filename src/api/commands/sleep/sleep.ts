import * as aMimir from "a-mimir";
import { setHelpText } from "../../help";
import sleepHelpText from "./sleep.help.md";
import sleepSyncHelpText from "./sleep_sync.help.md";
import sleepAsyncHelpText from "./sleep_async.help.md";

function sleep(milliseconds: number) {
  aMimir.sleep.sync(milliseconds);
}

const sleep_ = Object.assign(sleep, {
  sync: aMimir.sleep.sync,
  async: aMimir.sleep.async,
});

setHelpText(sleep_, sleepHelpText);
setHelpText(sleep_.sync, sleepSyncHelpText);
setHelpText(sleep_.async, sleepAsyncHelpText);

export { sleep_ as sleep };
