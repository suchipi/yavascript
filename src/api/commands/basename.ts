import { Path } from "../path";
import { assert } from "../assert";
import { is } from "../is";

export function basename(path: string | Path): string {
  if (is.Path(path)) {
    path = path.toString();
  }

  assert.string(
    path,
    "'path' argument must be either a string or a Path object"
  );

  const parts = Path.splitToSegments(path);
  return parts[parts.length - 1];
}
