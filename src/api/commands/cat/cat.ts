import * as os from "quickjs:os";
import * as encoding from "quickjs:encoding";
import { assert } from "../../assert";
import { is } from "../../is";
import { TypeValidator, types } from "../../types";
import type { Path } from "../../path";
import { setHelpText } from "../../help";
import catHelp from "./cat.help.md";
import { ResizableBuffer } from "../../../resizable-buffer";

let pathsArgType: TypeValidator<string | Path | Array<string | Path>> | null =
  null;

export function cat(
  paths: string | Path | Array<string | Path>,
  options: { binary?: boolean } = {}
): string | ArrayBuffer {
  if (pathsArgType == null) {
    pathsArgType = types.or(
      types.string,
      types.Path,
      types.arrayOf(types.or(types.string, types.Path))
    );
  }
  assert.type(
    paths,
    pathsArgType,
    "'paths' argument must be either a string, a Path object, or an Array of strings/Path objects"
  );
  assert.type(
    options,
    types.object,
    "when present, 'options' argument must be an object"
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

  const content = new ResizableBuffer(0);
  let offset = 0;

  for (let path of paths) {
    if (is(path, types.Path)) {
      path = path.toString();
    }
    assert.type(
      path,
      String,
      "'path' argument must be either a string or a Path object"
    );

    const stats = os.stat(path);
    content.resizeBy(stats.size);
    const file = std.open(path, "rb");
    offset += file.read(content.buffer, offset, stats.size);
    file.close();
  }

  if (options.binary) {
    return content.buffer;
  } else {
    return encoding.toUtf8(content.buffer);
  }
}

setHelpText(cat, catHelp);
