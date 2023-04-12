import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { env } from "./api/env";

// See https://bixense.com/clicolors/
export function hasColors(): boolean {
  if (env.CLICOLOR_FORCE != null && env.CLICOLOR_FORCE !== "0") {
    return true;
  }

  if (env.CLICOLOR === "0") {
    return false;
  }

  return os.isatty(std.out.fileno());
}
