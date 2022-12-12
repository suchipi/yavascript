import * as std from "std";
import { langToCompiler } from "../langs";
import { extname } from "../api/commands/extname";

export default function runFileTarget(
  fileToRun: string,
  langOverride: string | null
) {
  if (langOverride != null) {
    const compiler = langToCompiler(langOverride);
    const extension = extname(fileToRun);

    const existingExtensionHandler = Module.compilers[extension];
    Module.compilers[extension] = (filename: string, content: string) => {
      if (filename === fileToRun) {
        return compiler(content, { filename });
      } else if (existingExtensionHandler != null) {
        return existingExtensionHandler(filename, content);
      } else {
        return content;
      }
    };
  }

  std.importModule(fileToRun, "./<cwd>");
}
