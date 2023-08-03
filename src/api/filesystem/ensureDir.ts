import * as os from "quickjs:os";
import { Path } from "../path";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { _getPathInfo } from "./_getPathInfo";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";
import { setHelpText } from "../help";
import ensureDirHelpText from "./ensureDir.help.md";

export function ensureDir(path: string | Path) {
  assert.type(
    path,
    types.or(types.string, types.Path),
    "'path' argument must be either a string or a Path object"
  );

  if (is(path, types.Path)) {
    path = path.toString();
  }

  const components = Path.splitToSegments(path);

  for (let i = 0; i < components.length; i++) {
    const componentsSoFar = components.slice(0, i + 1);
    let pathSoFar = componentsSoFar.join(Path.OS_SEGMENT_SEPARATOR);
    if (pathSoFar === ".") continue;
    if (pathSoFar === "") continue;

    pathSoFar = appendSlashIfWindowsDriveLetter(pathSoFar);

    const info = _getPathInfo(pathSoFar);
    switch (info) {
      case "nonexistent": {
        os.mkdir(pathSoFar, 0o775);
        break;
      }
      case "dir": {
        break;
      }
      case "file": {
        throw new Error(
          `Wanted to ensure that the directory path ${path} existed, but ${pathSoFar} was a file, not a directory`
        );
      }
    }
  }
}

setHelpText(ensureDir, ensureDirHelpText);
