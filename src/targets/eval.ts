import * as std from "quickjs:std";
import * as os from "quickjs:os";
import * as esmToRequire from "../esm-to-require";
import { NOTHING } from "./repl/special";
import { langToCompiler } from "../langs";

export default function evalTarget(inputCode: string, lang: string) {
  let codeToRun: string | null = null;

  const compiler = langToCompiler(lang);
  codeToRun = compiler(inputCode, { expression: true });

  const transformedCode = esmToRequire.transform(codeToRun);
  const filename =
    os.getcwd() + (os.platform === "win32" ? "\\" : "/") + "<evalScript>";

  const result = std.evalScript(transformedCode, {
    backtraceBarrier: true,
    filename,
  });
  if (typeof result !== "undefined" && result !== NOTHING) {
    console.log(result);
  }
}
