import * as std from "std";
import * as esmToRequire from "../esm-to-require";
import { NOTHING } from "./repl/special";
import { langToCompiler } from "../langs";

export default function evalTarget(inputCode: string, lang: string) {
  let codeToRun: string | null = null;

  const compiler = langToCompiler(lang);
  codeToRun = compiler(inputCode, { expression: true });

  const transformedCode = esmToRequire.transform(codeToRun);
  const result = std.evalScript(transformedCode, { backtraceBarrier: true });
  if (typeof result !== "undefined" && result !== NOTHING) {
    console.log(result);
  }
}
