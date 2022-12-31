import * as std from "quickjs:std";
import { makeInspectLog } from "../shared/make-inspect-log";

export const echo = makeInspectLog(std.out);
