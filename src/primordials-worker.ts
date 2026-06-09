// Worker isn't part of primordials-base because Worker depends on primordials-base
globalThis.Worker = require("./api/worker").Worker;
