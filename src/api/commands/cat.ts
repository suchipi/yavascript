import * as std from "quickjs:std";
import { assert } from "../assert";
import { is } from "../is";
import type { Path } from "../path";
import { registerHelp } from "../help";

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

registerHelp(
  cat,
  String.dedent`
    heading«cat» - Read the contents of one of more files from disk as one UTF-8 string, print
    that string to stdout, then return it.
  
    dim«// Defined in yavascript/src/api/commands/cat.ts»
    
    red«declare» cyan«italic«function»» green«bold«cat»»(red«...»italic«paths»red«:» Arrayred«<»cyan«italic«string»» red«|» Pathred«>»)red«:» cyan«italic«string»»;
  `
);
