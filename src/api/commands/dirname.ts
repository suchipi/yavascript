import { Path } from "../path";
import { is } from "../is";
import { assert } from "../assert";

export function dirname(path: string | Path) {
  if (is.Path(path)) {
    path = path.toString();
  }

  assert.string(
    path,
    "'path' argument must be either a string or a Path object"
  );

  const separator = Path.detectSeparator(path);
  return Path.splitToSegments(path).slice(0, -1).join(separator);
}
