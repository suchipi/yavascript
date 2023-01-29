import * as os from "quickjs:os";
import { version as ysVersion, arch as ysArch } from "../hardcoded";

export function installNodeCompat(global: any) {
  global.global = global;

  global.process = {
    // This version supports approximately the same syntax features as we do
    version: "v16.19.0",
    versions: {
      node: "16.19.0",
      yavascript: ysVersion,
      unicode: "14.0",
    },
    arch: ysArch === "x86_64" ? "x64" : ysArch,
    get env() {
      return (require("./env") as typeof import("./env")).env;
    },
    get argv() {
      return scriptArgs;
    },
    get argv0() {
      return scriptArgs[0];
    },
    get execPath() {
      return os.realpath(os.execPath());
    },
  };
}
