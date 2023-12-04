import * as std from "quickjs:std";
import { readFile } from "../../api/filesystem";
import { Path } from "../../api/path";
import { getConfigDir } from "../../config-dir";
import { touch } from "../../api/commands/touch";
import { mkdir } from "../commands/mkdir";

export class HistoryFile {
  path: Path | null;

  constructor(filename: string) {
    const configDir = getConfigDir();
    if (!configDir) {
      this.path = null;
      return;
    }

    mkdir(configDir, { recursive: true });

    const path = new Path(configDir, filename);
    // create it if it doesn't  exist
    touch(path);

    this.path = path;
  }

  load() {
    if (this.path == null) return [];

    const content = readFile(this.path).trimEnd();
    const lines = content.split("\n");
    return lines;
  }

  fileForAppend: FILE | null = null;

  append(line: string) {
    if (this.path == null) return;

    if (this.fileForAppend == null) {
      this.fileForAppend = std.open(this.path?.toString(), "a");
    }

    this.fileForAppend.puts(line + "\n");
  }
}
