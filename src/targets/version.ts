import * as std from "std";
import version from "./VERSION?evalAtBuildTime";

export default function versionTarget() {
  std.out.puts(version);
  std.exit(0);
}
