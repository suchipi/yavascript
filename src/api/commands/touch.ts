import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { is } from "../is";
import { assert } from "../assert";
import type { Path } from "../path";

// cause everytime we touch, I get this feeling
export function touch(path: string | Path) {
  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    String,
    "'path' argument must be either a string or a Path object"
  );

  let exists = false;
  try {
    os.access(path, os.F_OK);
    exists = true;
  } catch (err) {
    // ignored
  }

  if (!exists) {
    const file = std.open(path, "w");
    file.close();
  } else {
    os.utimes(path, Date.now(), Date.now());
  }
}
