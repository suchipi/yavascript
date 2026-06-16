import * as std from "quickjs:std";
import * as cmdline from "quickjs:cmdline";

const { version } = __yavascript_layer2_internals;

export default function versionTarget() {
  std.out.puts(version);
  cmdline.exit(0);
}
