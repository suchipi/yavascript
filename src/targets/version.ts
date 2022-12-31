import * as std from "quickjs:std";
import { version } from "../hardcoded";

export default function versionTarget() {
  std.out.puts(version);
  std.exit(0);
}
