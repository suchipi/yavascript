import * as std from "quickjs:std";
import * as cmdline from "quickjs:cmdline";

// @ts-ignore cannot find module
import dtsText from "../../dist/yavascript.d.ts?contentString";

export default function printTypesTarget() {
  std.out.puts(dtsText);
  cmdline.exit(0);
}
