// A worker's static imports have to go through yavascript's loader, the same
// way a main script's do, so that a .ts file gets compiled instead of parsed
// as JS.
import { fromTs } from "./static-import-lib.ts";

Worker.parent.postMessage(fromTs);
