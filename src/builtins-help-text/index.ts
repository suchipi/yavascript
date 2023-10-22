import { installGlobalHelpTexts } from "./globals";
import { installArrayMethodsHelpTexts } from "./array-methods";
import { installQuickjsHelpTexts } from "./quickjs/quickjs-builtins";

export function installBuiltinsHelpText(global: typeof globalThis) {
  installGlobalHelpTexts(global);
  installArrayMethodsHelpTexts(global);
  installQuickjsHelpTexts(global);
}
