import * as os from "quickjs:os";

export function pwd(): string {
  return os.getcwd();
}
