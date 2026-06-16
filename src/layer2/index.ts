import { version, arch } from "./hardcoded";

(globalThis as any).yavascript.version = version;
(globalThis as any).yavascript.arch = arch;

const __yavascript_layer2_internals = {
  version,
  arch,
};

export type __yavascript_layer2_internals =
  typeof __yavascript_layer2_internals;

globalThis.__yavascript_layer2_internals = __yavascript_layer2_internals;
