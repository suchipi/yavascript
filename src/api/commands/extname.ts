import { basename } from "./basename";
import { is } from "../is";
import { assert } from "../assert";
import type { Path } from "../path";

export function extname(
  pathOrFilename: string | Path,
  options: { full?: boolean } = {}
): string {
  if (is(pathOrFilename, types.Path)) {
    pathOrFilename = pathOrFilename.toString();
  }

  assert.type(
    pathOrFilename,
    String,
    "'pathOrFilename' argument must be either a string or a Path object"
  );

  const filename = basename(pathOrFilename);
  const parts = filename.split(".");

  if (parts.length === 1) {
    return "";
  }

  assert.type(
    options,
    Object,
    "'options' argument must be either an object or undefined"
  );

  if (options.full) {
    return "." + parts.slice(1).join(".");
  } else {
    return "." + parts[parts.length - 1];
  }
}
