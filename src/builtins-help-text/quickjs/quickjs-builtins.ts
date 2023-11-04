import { setHelpText } from "../../api/help/help";

export function installQuickjsHelpTexts(global: typeof globalThis) {
  setHelpText(global.__date_clock, require("./__date_clock.help.md"));
  setHelpText(global.BigDecimal, require("./BigDecimal.help.md"));
  setHelpText(global.BigFloat, require("./BigFloat.help.md"));
  setHelpText(global.BigFloatEnv, require("./BigFloatEnv.help.md"));
  setHelpText(global.inspect, require("./inspect.help.md"));
  setHelpText(global.Operators, require("./Operators.help.md"));
  setHelpText(global.scriptArgs, require("./scriptArgs.help.md"));
}
