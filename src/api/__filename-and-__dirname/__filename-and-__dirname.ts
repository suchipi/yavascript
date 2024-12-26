import * as os from "quickjs:os";
import * as engine from "quickjs:engine";
import { dirname } from "../commands/dirname";
import { wrappedStringLazy } from "../help";

// Not public API; exported for __filename, which *is* a public API
export function get__filename(depth: number): string {
  let ret = engine.getFileNameFromStack(depth);
  try {
    ret = os.realpath(ret);
  } catch (err) {
    // ignored
  }

  return wrappedStringLazy(ret, () => require("./__filename.help.md"));
}

// Not public API; exported for __dirname, which *is* a public API
export function get__dirname(depth: number): string {
  let filename = engine.getFileNameFromStack(depth);
  try {
    filename = os.realpath(filename);
  } catch (err) {
    // ignored
  }

  const ret = dirname(filename);
  return wrappedStringLazy(ret.toString(), () =>
    require("./__dirname.help.md")
  );
}
