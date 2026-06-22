export function installLayer3Globals(theGlobal: typeof globalThis) {
  theGlobal.Worker = require("./worker").Worker;
  theGlobal.runInWorker = require("./runInWorker").runInWorker;
  theGlobal.Context = require("./context").Context;
}
