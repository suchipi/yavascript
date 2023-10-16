import * as os from "quickjs:os";
import { version as ysVersion, arch as ysArch } from "../../hardcoded";

export function installNodeCompat(global: any) {
  Object.defineProperty(global, "global", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: global,
  });

  const process = {
    // This version supports approximately the same syntax features as we do
    version: "v16.19.0",
    versions: {
      node: "16.19.0",
      yavascript: ysVersion,
      unicode: "14.0",
    },
    arch: ysArch === "x86_64" ? "x64" : ysArch,
    get env() {
      return (require("../env") as typeof import("../env")).env;
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
    get exitCode() {
      return std.getExitCode();
    },
    set exitCode(value: number) {
      std.setExitCode(value);
    },
    exit(code?: number | null | undefined) {
      // TODO: process.on("exit", ...)

      if (code != null) {
        std.exit(code);
      } else {
        std.exit();
      }
    },
  };

  Object.defineProperty(global, "process", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: process,
  });
}
