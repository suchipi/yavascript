import { setHelpText } from "../../api/help/help";

export function installQuickjsHelpTexts(global: typeof globalThis) {
  setHelpText(global.__date_clock, require("./__date_clock.help.md"));
  setHelpText(global.inspect, require("./inspect.help.md"));
}
