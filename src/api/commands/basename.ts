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
    dim「Defined in yavascript/src/api/commands/basename.ts」
    bold「basename」 - Return the last component of a path string.

    Provides the same functionality as the unix binary of the same name.

    red「declare」 blue.italic「function」 green.bold「basename」yellow「(」white「path」red「:」 blue「string」 red「|」 white「Path」yellow「)」red「:」 blue「string」;
  `
);
