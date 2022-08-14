import * as std from "std";
import * as pkg from "../../package.json";

export default function versionTarget() {
  std.out.puts(pkg.version);
  std.exit(0);
}
