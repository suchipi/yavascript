import * as os from "quickjs:os";
import { is } from "../is";
import { assert } from "../assert";
import type { Path } from "../path";

export function readlink(path: string | Path): string {
  if (is.Path(path)) {
    path = path.toString();
  }

  assert.string(
    path,
    "'path' argument must be either a string or a Path object"
  );

  if (os.readlink == null) {
    throw new Error(
      `readlink is not yet supported in platform '${os.platform}'`
    );
  } else {
    return os.readlink(path);
  }
}
