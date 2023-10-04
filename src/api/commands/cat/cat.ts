import * as std from "quickjs:std";
import { assert } from "../../assert";
import { is } from "../../is";
import type { Path } from "../../path";
import { setHelpText } from "../../help";
import catHelp from "./cat.help.md";

export function cat(...paths: Array<string | Path>): string {
  let content = "";
  for (let path of paths) {
    if (is(path, types.Path)) {
      path = path.toString();
    }

    assert.type(
      path,
      String,
      "'path' argument must be either a string or a Path object"
    );

    const newContent = std.loadFile(path);
    content += newContent;
  }
  return content;
}

setHelpText(cat, catHelp);

// TODO: ArrayBuffer return value. `cat.raw()`?
