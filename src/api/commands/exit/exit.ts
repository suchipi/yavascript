import * as std from "quickjs:std";
import { setHelpText } from "../../help";
import exitHelpText from "./exit.help.md";

function exit(code?: number) {
  std.exit(code);
}

Object.defineProperty(exit, "code", {
  get() {
    return std.getExitCode();
  },
  set(newValue: number) {
    std.setExitCode(newValue);
  },
});

setHelpText(exit, exitHelpText);

const exit_: typeof exit & {
  code: number;
} = exit as any;

export { exit_ as exit };
