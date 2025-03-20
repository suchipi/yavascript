import * as os from "quickjs:os";
import { Path } from "../../path";

export function pwd(): Path {
  return new Path(os.getcwd());
}

const initialPwd = pwd();
Object.freeze(initialPwd);
Object.freeze(initialPwd.segments);

Object.defineProperty(pwd, "initial", {
  configurable: false,
  writable: false,
  enumerable: true,

  value: initialPwd,
});
