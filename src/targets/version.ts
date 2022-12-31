import * as std from "quickjs:std";
import version from "./VERSION_HARDCODED?evalAtBuildTime";

export default function versionTarget() {
  std.out.puts(version);
  std.exit(0);
}
