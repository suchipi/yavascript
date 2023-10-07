import * as os from "quickjs:os";
import { Path } from "../../path";
import { setHelpText } from "../../help";
import pwdHelpText from "./pwd.help.md";
import pwdInitialHelpText from "./pwd_initial.help.md";

export function pwd(): Path {
  return new Path(os.getcwd());
}

const initialPwd = pwd();
Object.freeze(initialPwd);
Object.freeze(initialPwd.segments);
Object.defineProperty(initialPwd, "separator", {
  configurable: false,
  writable: false,
  enumerable: true,

  value: initialPwd.separator,
});

Object.defineProperty(pwd, "initial", {
  configurable: false,
  writable: false,
  enumerable: true,

  value: initialPwd,
});

setHelpText(pwd, pwdHelpText);
setHelpText((pwd as any).initial, pwdInitialHelpText);
