import * as std from "quickjs:std";
import { Path } from "../path";
import { pipe } from "../pipe";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { setHelpText } from "../help";
import readFileHelpText from "./readFile.help.md";

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
    return pipe({ path }, ArrayBuffer).target;
  } else {
    return std.loadFile(path);
  }
} as any;

setHelpText(readFile, readFileHelpText);
