import * as std from "std";
import version from "./VERSION_HARDCODED?evalAtBuildTime";

export default function versionTarget() {
  std.out.puts(version);
  std.exit(0);
}
