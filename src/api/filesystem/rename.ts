import * as os from "quickjs:os";
import { Path } from "../path";
import { types } from "../types";
import { assert } from "../assert";
import { setHelpText } from "../help";
import renameHelpText from "./rename.help.md";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";

export function rename(from: string | Path, to: string | Path): void {
  assert.type(
    from,
    types.or(types.string, types.Path),
    "'from' argument must be either a string or a Path object"
  );

  assert.type(
    to,
    types.or(types.string, types.Path),
    "'to' argument must be either a string or a Path object"
  );

  from = Path.resolve(from).toString();
  to = Path.resolve(to).toString();

  from = appendSlashIfWindowsDriveLetter(from);
  to = appendSlashIfWindowsDriveLetter(to);

  try {
    os.rename(from, to);
  } catch (err) {
    Object.assign(err as any, {
      operation: "rename",
      from,
      to,
    });
    throw err;
  }
}

setHelpText(rename, renameHelpText);
