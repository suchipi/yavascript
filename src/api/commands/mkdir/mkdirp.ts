import { mkdir } from "./mkdir";
import { setHelpText } from "../../help";
import mkdirpHelpText from "./mkdirp.help.md";

export function mkdirp(path: string | Path, options?: { mode?: number }): void {
  mkdir(path, { ...options, recursive: true });
}

setHelpText(mkdirp, mkdirpHelpText);
