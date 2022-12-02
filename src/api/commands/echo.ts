import * as std from "std";
import { makeInspectLog } from "../shared/make-inspect-log";

export const echo = makeInspectLog(std.out);
