import { Path } from "../path";
import { assert } from "../assert";
import { is } from "../is";
import { registerHelp } from "../help";
import basenameHelp from "../../../meta/docs/compiled/basename.glow.txt";

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

registerHelp(basename, basenameHelp);
