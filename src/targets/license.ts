import * as std from "quickjs:std";
import * as cmdline from "quickjs:cmdline";
import license from "../license-text";

export default function licenseTarget() {
  std.out.puts(license);
  cmdline.exit(0);
}
