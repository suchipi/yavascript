// See https://github.com/tc39/proposal-regex-escaping
import { setHelpText } from "../help";
import regexpEscapeHelpText from "./regexp-escape.help.md";

export function escape(s: any): string {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}

setHelpText(escape, regexpEscapeHelpText);

export function install(_RegExp: any) {
  _RegExp.escape = escape;
}
