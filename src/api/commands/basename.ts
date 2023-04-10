import { Path } from "../path";
import { assert } from "../assert";
import { is } from "../is";
import { registerHelp } from "../help";

export function basename(path: string | Path): string {
  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    String,
    "'path' argument must be either a string or a Path object"
  );

  const parts = Path.splitToSegments(path);
  return parts[parts.length - 1];
}

registerHelp(
  basename,
  String.dedent`
    heading«basename» - Return the last component of a path string.
  
    Provides the same functionality as the unix binary of the same name.
  
    comment«// Defined in yavascript/src/api/commands/basename.ts»
    keyword«declare» type«function» func«basename»(param«path»op«:» type«string» op«|» Path)op«:» type«string»;
  `
);
