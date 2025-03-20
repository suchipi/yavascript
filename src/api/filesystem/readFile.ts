import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";

type ReadFile = {
  (path: string | Path): string;
  (path: string | Path, options: {}): string;
  (path: string | Path, options: { binary: false }): string;
  (path: string | Path, options: { binary: true }): ArrayBuffer;
};

export const readFile: ReadFile = function readFile(
  path: string | Path,
  options: { binary?: boolean } = {}
): string | ArrayBuffer {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  assert.type(
    options,
    types.or(types.undefined, types.anyObject),
    "when present, 'options' argument must be an object"
  );

  assert.type(
    options.binary,
    types.or(types.undefined, types.boolean),
    "when present, 'binary' options must be a boolean"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  if (options.binary) {
    const stats = os.stat(path);
    const buffer = new ArrayBuffer(stats.size);
    const file = std.open(path, "rb");
    try {
      file.read(buffer, 0, stats.size);
    } finally {
      file.close();
    }
    return buffer;
  } else {
    return std.loadFile(path);
  }
} as any;
