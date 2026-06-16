import * as std from "quickjs:std";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";

export function writeFile(
  path: string | Path,
  data: string | ArrayBuffer,
): void {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object",
  );

  assert.type(
    data,
    types.or(types.string, types.ArrayBuffer),
    "'data' argument must be either a string or an ArrayBuffer",
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  const file = std.open(path, "w");
  try {
    if (typeof data === "string") {
      file.puts(data);
    } else {
      file.write(data, 0, data.byteLength);
    }
  } finally {
    file.close();
  }
}
