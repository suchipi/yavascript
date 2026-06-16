import * as std from "quickjs:std";
import * as cmdline from "quickjs:cmdline";

export default function printTypesTarget() {
  std.out.puts(yavascript.getTypesDts());
  cmdline.exit(0);
}
