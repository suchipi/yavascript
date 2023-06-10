import * as os from "quickjs:os";
import { setHelpText } from "../../help";
import pwdHelpText from "./pwd.help.md";

export function pwd(): string {
  return os.getcwd();
}

setHelpText(pwd, pwdHelpText);
