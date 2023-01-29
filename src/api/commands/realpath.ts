import * as os from "quickjs:os";
import { is } from "../is";
import { assert } from "../assert";
import type { Path } from "../path";

export function realpath(path: string | Path): string {
  if (is.Path(path)) {
    path = path.toString();
  }

  assert.string(
    path,
    "'path' argument must be either a string or a Path object"
  );

  return os.realpath(path);
}
