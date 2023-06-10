import * as std from "quickjs:std";
import { makeInspectLog } from "../../shared/make-inspect-log";
import { setHelpText } from "../../help";
import echoHelpText from "./echo.help.md";

export const echo = makeInspectLog(std.out);

setHelpText(echo, echoHelpText);
