import * as os from "quickjs:os";
import { is } from "../../is";
import { assert } from "../../assert";
import { Path } from "../../path";
import { setHelpText } from "../../help";
import realpathHelpText from "./realpath.help.md";
import { appendSlashIfWindowsDriveLetter } from "../../path/_win32Helpers";

export function realpath(path: string | Path): Path {
  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    String,
    "'path' argument must be either a string or a Path object"
  );

  path = appendSlashIfWindowsDriveLetter(path);

  const result = os.realpath(path);
  return new Path(result);
}

setHelpText(realpath, realpathHelpText);
