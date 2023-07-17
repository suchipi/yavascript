import { installGlobalHelpTexts } from "./globals";
import { installArrayMethodsHelpTexts } from "./array-methods";

export function installBuiltinsHelpText(global: typeof globalThis) {
  installGlobalHelpTexts(global);
  installArrayMethodsHelpTexts(global);
}
