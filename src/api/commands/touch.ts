import * as std from "quickjs:std";
import * as os from "quickjs:os";

export function touch(path: string) {
  let exists = false;
  try {
    os.access(path, os.F_OK);
    exists = true;
  } catch (err) {
    // ignored
  }

  if (!exists) {
    const file = std.open(path, "w");
    file.close();
  } else {
    os.utimes(path, Date.now(), Date.now());
  }
}
