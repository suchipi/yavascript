import * as Bytecode from "quickjs:bytecode";

declare var __bytecode_primordials_base: ArrayBuffer;
declare var __bytecode_primordials_hardcoded: ArrayBuffer;

Bytecode.toValue(__bytecode_primordials_base)();
Bytecode.toValue(__bytecode_primordials_hardcoded)();

globalThis.Worker = require("../api/worker").Worker;
