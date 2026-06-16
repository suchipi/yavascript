import * as os from "quickjs:os";
import { exec } from "../exec";
import type { Path } from "../path";

export function openUrl(urlOrFilePath: string | Path): void {
  switch (os.platform) {
    case "darwin": {
      exec(["open", urlOrFilePath], { block: false });
      break;
    }
    case "win32": {
      exec(["rundll32.exe", "url.dll,OpenURL", urlOrFilePath], {
        block: false,
      });
      break;
    }
    default: {
      exec(["xdg-open", urlOrFilePath], { block: false });
      break;
    }
  }
}
