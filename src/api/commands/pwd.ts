import * as os from "os";

export function pwd(): string {
  return os.getcwd();
}
