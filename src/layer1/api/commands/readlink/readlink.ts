import * as os from "quickjs:os";
import { is } from "../../is";
import { assert } from "../../assert";
import { Path } from "../../path";
import { types } from "../../types";

export function readlink(path: string | Path): Path {
  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    String,
    "'path' argument must be either a string or a Path object",
  );

  if (os.readlink == null) {
    throw new Error(
      `readlink is not yet supported in platform '${os.platform}'`,
    );
  } else {
    return new Path(os.readlink(path));
  }
}
