import * as os from "quickjs:os";
import { env } from "../../env";
import { assert } from "../../assert";
import { is } from "../../is";
import type { Path } from "../../path";
import { setHelpText } from "../../help";
import cdHelpText from "./cd.help.md";
import { appendSlashIfWindowsDriveLetter } from "../../path/_win32Helpers";

export function cd(path?: string | Path): void {
  if (path == null) {
    path = env.HOME;
  }
  if (path == null) {
    throw new Error(
      "Please either specify a path (as the first argument) or set the HOME environment variable"
    );
  }

  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    String,
    "'path' argument must be either a string or a Path object"
  );

  path = appendSlashIfWindowsDriveLetter(path);

  os.chdir(path);
}

setHelpText(cd, cdHelpText);
