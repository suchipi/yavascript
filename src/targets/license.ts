import * as std from "quickjs:std";
import license from "../license-text";

export default function licenseTarget() {
  std.out.puts(license);
  std.exit(0);
}
