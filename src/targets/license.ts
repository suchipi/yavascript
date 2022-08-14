import * as std from "std";
import license from "../license-text";

export default function licenseTarget() {
  std.out.puts(license);
  std.exit(0);
}
