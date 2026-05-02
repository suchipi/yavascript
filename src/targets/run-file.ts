import * as engine from "quickjs:engine";
import { langToCompiler } from "../langs";
import { extname } from "../api/commands/extname";
import { Path } from "../api/path";
import { pwd } from "../api/commands/pwd";
import { realpath } from "../api/commands/realpath";

function overrideCompiler(
  fileToRun: string,
  callback: (
    filename: string,
    content: string,
    defaultBehavior: (filename: string, content: string) => string,
  ) => string,
) {
  const extension = extname(fileToRun);

  const defaultBehavior =
    engine.ModuleDelegate.compilers[extension] ||
    ((filename: string, content: string) => content);

  engine.ModuleDelegate.compilers[extension] = (
    filename: string,
    content: string,
  ) => {
    if (filename === fileToRun) {
      return callback(filename, content, defaultBehavior);
    } else {
      return defaultBehavior(filename, content);
    }
  };
}

export default async function runFileTarget(
  fileToRun: string,
  langOverride: string | null,
  asMain: boolean = true,
) {
  let absFileToRun = Path.isAbsolute(fileToRun)
    ? fileToRun
    : fileToRun.match(/^\.{1,2}\//)
      ? engine.resolveModule(fileToRun, "./<cwd>")
      : new Path(pwd(), fileToRun).toString();

  absFileToRun = realpath(absFileToRun).toString();

  if (langOverride != null) {
    const compiler = langToCompiler(langOverride);
    overrideCompiler(absFileToRun, (filename, content) => {
      return compiler(content, { filename });
    });
  }

  if (asMain) {
    engine.setMainModule(absFileToRun);
  }

  await import(absFileToRun);
}
