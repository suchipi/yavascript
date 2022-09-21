import * as std from "std";

// @ts-ignore cannot find module
import dtsText from "../../dist/yavascript.d.ts?contentString";

export default function printTypesTarget() {
  std.out.puts(dtsText);
  std.exit(0);
}
