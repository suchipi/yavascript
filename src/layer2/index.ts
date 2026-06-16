import { version, arch } from "./hardcoded";

yavascript.version = version;
yavascript.arch = arch as typeof yavascript.arch;

const __yavascript_layer2_internals = {
  version,
  arch,
};

export type __yavascript_layer2_internals =
  typeof __yavascript_layer2_internals;

globalThis.__yavascript_layer2_internals = __yavascript_layer2_internals;
