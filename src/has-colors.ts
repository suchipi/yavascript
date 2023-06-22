import * as std from "quickjs:std";
import * as os from "quickjs:os";

// See https://bixense.com/clicolors/
export function hasColors(): boolean {
  const CLICOLOR = std.getenv("CLICOLOR");
  const CLICOLOR_FORCE = std.getenv("CLICOLOR_FORCE");

  if (CLICOLOR_FORCE != null && CLICOLOR_FORCE !== "0") {
    return true;
  }

  if (CLICOLOR === "0") {
    return false;
  }

  return os.isatty(std.out.fileno());
}
