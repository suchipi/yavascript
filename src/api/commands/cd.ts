import * as os from "quickjs:os";
import { env } from "../env";

export function cd(path?: string): void {
  if (path == null) {
    path = env.HOME;
  }
  if (path == null) {
    throw new Error(
      "Please either specify a path or set the HOME environment variable"
    );
  }
  os.chdir(path);
}
