import * as std from "quickjs:std";
import * as os from "quickjs:os";
import * as encoding from "quickjs:encoding";
import { assert } from "../../assert";
import { is } from "../../is";
import { TypeValidator, types } from "../../types";
import type { Path } from "../../path";
import { readWholeFile } from "../../../read-whole-file";

let pathsArgType: TypeValidator<string | Path | Array<string | Path>> | null =
  null;

export function cat(
  paths: string | Path | Array<string | Path>,
  options: { binary?: boolean } = {},
): string | ArrayBuffer {
  if (pathsArgType == null) {
    pathsArgType = types.or(
      types.string,
      types.Path,
      types.arrayOf(types.or(types.string, types.Path)),
    );
  }
  assert.type(
    paths,
    pathsArgType,
    "'paths' argument must be either a string, a Path object, or an Array of strings/Path objects",
  );
  assert.type(
    options,
    types.object,
    "when present, 'options' argument must be an object",
  );

  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  if (paths.length === 0) {
    if (options.binary) {
      return new ArrayBuffer(0);
    } else {
      return "";
    }
  }

  const fileContents: Array<ArrayBuffer> = [];

  for (let path of paths) {
    if (is(path, types.Path)) {
      path = path.toString();
    }
    assert.type(
      path,
      String,
      "'path' argument must be either a string or a Path object",
    );

    fileContents.push(readWholeFile(path));
  }

  let content: ArrayBuffer;
  if (fileContents.length === 1) {
    content = fileContents[0];
  } else {
    const totalLength = fileContents.reduce(
      (total, buffer) => total + buffer.byteLength,
      0,
    );
    content = new ArrayBuffer(totalLength);
    const view = new Uint8Array(content);
    let offset = 0;
    for (const buffer of fileContents) {
      view.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }
  }

  if (options.binary) {
    return content;
  } else {
    return encoding.toUtf8(content);
  }
}
