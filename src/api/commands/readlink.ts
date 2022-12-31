import * as os from "quickjs:os";

export function readlink(path: string): string {
  if (os.readlink == null) {
    throw new Error(`readlink is not yet supported in ${os.platform}`);
  } else {
    return os.readlink(path);
  }
}
