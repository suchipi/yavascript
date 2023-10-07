import * as os from "quickjs:os";
import { Path } from "../../path";
import { setHelpText } from "../../help";
import pwdHelpText from "./pwd.help.md";

export function pwd(): Path {
  return new Path(os.getcwd());
}

setHelpText(pwd, pwdHelpText);
