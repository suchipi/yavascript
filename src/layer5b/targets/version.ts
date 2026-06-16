import * as std from "quickjs:std";
import * as cmdline from "quickjs:cmdline";

declare var __yavascript_layer2_internals: import("../../layer2/index").__yavascript_layer2_internals;
const { version } = __yavascript_layer2_internals;

export default function versionTarget() {
  std.out.puts(version);
  cmdline.exit(0);
}
