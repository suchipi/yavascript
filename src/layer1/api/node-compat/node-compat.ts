import * as os from "quickjs:os";
import * as engine from "quickjs:engine";
import * as cmdline from "quickjs:cmdline";

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
      get yavascript() {
        // filled in in layer 2
        return yavascript.version;
      },
      unicode: "14.0",
    },
    get arch() {
      // filled in in layer 2
      const ysArch = yavascript.arch;
      return ysArch === "x86_64" ? "x64" : ysArch;
    },
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
      return cmdline.getExitCode();
    },
    set exitCode(value: number) {
      cmdline.setExitCode(value);
    },
    exit(code?: number | null | undefined) {
      // TODO: process.on("exit", ...)

      if (code != null) {
        cmdline.exit(code);
      } else {
        cmdline.exit();
      }
    },
  };

  Object.defineProperty(global, "process", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: process,
  });

  const processMod = {
    __isCjsModule: true,
    __cjsExports: process,
    default: process,
  };
  engine.defineBuiltinModule("process", processMod);
  engine.defineBuiltinModule("node:process", processMod);
}
