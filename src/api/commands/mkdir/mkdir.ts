import * as os from "quickjs:os";
import { Path } from "../../path";
import { assert } from "../../assert";
import { is } from "../../is";
import { types } from "../../types";
import { _getPathInfo } from "../../filesystem/_getPathInfo";
import { dirname } from "../dirname";
import { appendSlashIfWindowsDriveLetter } from "../../path/_win32Helpers";
import { setHelpText } from "../../help";
import mkdirHelp from "./mkdir.help.md";

export function mkdir(
  path: string | Path,
  options?: { recursive?: boolean; mode?: number }
): void {
  if (is(path, types.string)) {
    path = new Path(path);
  }

  assert.type(
    path,
    types.Path,
    "'path' argument must be either a string or a Path object"
  );

  assert.type(
    options?.recursive,
    types.or(types.boolean, types.undefined),
    "when present, 'options.recursive' must be a boolean"
  );

  const mode = options?.mode ?? 0o775;
  assert.type(
    mode,
    types.or(types.undefined, types.number),
    "when present, 'options.mode' must be a number"
  );

  if (options?.recursive) {
    const components = path.segments;

    for (let i = 0; i < components.length; i++) {
      const componentsSoFar = components.slice(0, i + 1);
      let pathSoFar = componentsSoFar.join(Path.OS_SEGMENT_SEPARATOR);
      if (pathSoFar === ".") continue;
      if (pathSoFar === "") continue;

      pathSoFar = appendSlashIfWindowsDriveLetter(pathSoFar);

      const info = _getPathInfo(pathSoFar);
      switch (info) {
        case "nonexistent": {
          os.mkdir(pathSoFar, mode);
          break;
        }
        case "dir": {
          break;
        }
        case "file": {
          if (i === 0) {
            throw new Error(
              `Cannot use mkdir to create directory '${path}' because there is an existing file with that name.`,
              { path }
            );
          } else {
            throw new Error(
              `Cannot use mkdir to create directory '${path}' because '${pathSoFar}' is a file, not a directory.`,
              { path, pathSoFar: new Path(pathSoFar) }
            );
          }
        }
      }
    }
  } else {
    if (path.isAbsolute() && path.segments.length === 1) {
      const segment = path.segments[0];
      const kind = /^[a-zA-Z]:/.test(segment) ? "drive" : "dir";
      throw new Error(
        `Cannot use mkdir to create root ${kind} '${path.toString()}'. Maybe you wanted to pass '{ recursive: true }'?`,
        { path }
      );
    }

    const parentPath = dirname(path);
    const parentPathInfo = _getPathInfo(parentPath.toString());
    switch (parentPathInfo) {
      case "nonexistent": {
        throw new Error(
          `Cannot use mkdir to create directory '${path}' because its parent '${parentPath}' does not exist. If you want to create the path and all its non-existent parents, pass the '{ recursive: true }' option to mkdir.`,
          { path, parentPath }
        );
      }
      case "file": {
        throw new Error(
          `Cannot use mkdir to create directory '${path}' because its parent '${parentPath}' exists but is not a directory.`,
          { path, parentPath }
        );
      }
    }

    const ownPathInfo = _getPathInfo(path.toString());
    switch (ownPathInfo) {
      case "nonexistent": {
        // this is ok
        os.mkdir(path.toString(), mode);
        break;
      }
      case "dir": {
        throw new Error(
          `Cannot use mkdir to create directory '${path}' because that directory already exists. If you don't want an error to be thrown when attempting to create a directory which already exists, pass the '{ recursive: true }' option.`,
          { path }
        );
      }
      case "file": {
        throw new Error(
          `Cannot use mkdir to create directory '${path}' because there is an existing file with that name.`,
          { path }
        );
      }
    }
  }
}

setHelpText(mkdir, mkdirHelp);
