import * as os from "quickjs:os";
import { is } from "../../is";
import { assert } from "../../assert";
import type { Path } from "../../path";
import { setHelpText } from "../../help";
import realpathHelpText from "./realpath.help.md";

export function realpath(path: string | Path): string {
  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    String,
    "'path' argument must be either a string or a Path object"
  );

  return os.realpath(path);
}

setHelpText(realpath, realpathHelpText);
