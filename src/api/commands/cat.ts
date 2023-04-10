import * as std from "quickjs:std";
import { assert } from "../assert";
import { is } from "../is";
import type { Path } from "../path";
import { registerHelp } from "../help";
import catHelp from "../../../meta/docs/compiled/cat.glow.txt";

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
    std.out.puts(newContent);
  }
  return content;
}

registerHelp(cat, catHelp);
