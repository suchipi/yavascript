import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { dirname } from "./commands/dirname";
import { setHelpText } from "./help";
import filenameHelp from "./__filename.help.md";
import dirnameHelp from "./__dirname.help.md";

function wrappedString(str: string, helpText: string): string {
  const ret = new String(str) as any;
  ret[Symbol.typeofValue] = () => "string";
  setHelpText(str, helpText);
  return ret;
}

// Not public API; exported for __filename, which *is* a public API
export function get__filename(depth: number): string {
  let ret = std.getFileNameFromStack(depth);
  try {
    ret = os.realpath(ret);
  } catch (err) {
    // ignored
  }

  return wrappedString(ret, filenameHelp);
}

// Not public API; exported for __dirname, which *is* a public API
export function get__dirname(depth: number): string {
  let filename = std.getFileNameFromStack(depth);
  try {
    filename = os.realpath(filename);
  } catch (err) {
    // ignored
  }

  const ret = dirname(filename);
  return wrappedString(ret, dirnameHelp);
}
