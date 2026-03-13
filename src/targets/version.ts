import * as std from "quickjs:std";
import * as cmdline from "quickjs:cmdline";
import { version } from "../hardcoded";

export default function versionTarget() {
  std.out.puts(version);
  cmdline.exit(0);
}
