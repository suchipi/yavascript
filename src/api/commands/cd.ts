import * as os from "quickjs:os";
import { env } from "../env";
import { assert } from "../assert";
import { is } from "../is";
import type { Path } from "../path";

export function cd(path?: string | Path): void {
  if (path == null) {
    path = env.HOME;
  }
  if (path == null) {
    throw new Error(
      "Please either specify a path (as the first argument) or set the HOME environment variable"
    );
  }

  if (is.Path(path)) {
    path = path.toString();
  }

  assert.string(
    path,
    "'path' argument must be either a string or a Path object"
  );

  os.chdir(path);
}
