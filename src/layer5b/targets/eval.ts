import * as engine from "quickjs:engine";
import * as os from "quickjs:os";

declare var __yavascript_layer1_internals: import("../../layer1/index").__yavascript_layer1_internals;
const { esmToRequire, NOTHING, langToCompiler } = __yavascript_layer1_internals;

export default function evalTarget(inputCode: string, lang: string) {
  let codeToRun: string | null = null;

  const compiler = langToCompiler(lang);
  codeToRun = compiler(inputCode, { expression: true });

  const transformedCode = esmToRequire.transform(codeToRun);
  const filename =
    os.getcwd() + (os.platform === "win32" ? "\\" : "/") + "<evalScript>";

  const result = engine.evalScript(transformedCode, {
    backtraceBarrier: true,
    filename,
  });
  if (typeof result !== "undefined" && result !== NOTHING) {
    console.log(result);
  }
}
