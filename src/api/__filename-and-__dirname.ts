import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { dirname } from "./commands/dirname";
import { registerHelpProvider } from "./help";
import filenameHelp from "../../meta/docs/compiled/__filename.glow.txt";
import dirnameHelp from "../../meta/docs/compiled/__filename.glow.txt";

export const IS_FILENAME = Symbol("is __filename");
export const IS_DIRNAME = Symbol("is __dirname");

registerHelpProvider((value) => {
  if (typeof value !== "string") {
    return null;
  }

  if (value[IS_FILENAME]) {
    return filenameHelp;
  } else if (value[IS_DIRNAME]) {
    return dirnameHelp;
  } else {
    return null;
  }
});

function wrappedString(str: string, sym: symbol): string {
  const ret = new String(str) as any;
  ret[sym] = true;
  ret[Symbol.typeofValue] = () => "string";
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

  return wrappedString(ret, IS_FILENAME);
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
  return wrappedString(ret, IS_DIRNAME);
}
