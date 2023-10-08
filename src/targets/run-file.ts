import * as std from "quickjs:std";
import { langToCompiler } from "../langs";
import compilers from "../compilers";
import { extname } from "../api/commands/extname";
import { Path } from "../api/path";
import { pwd } from "../api/commands/pwd";
import { realpath } from "../api/commands/realpath";

function overrideCompiler(
  fileToRun: string,
  callback: (
    filename: string,
    content: string,
    defaultBehavior: (filename: string, content: string) => string
  ) => string
) {
  const extension = extname(fileToRun);

  const defaultBehavior =
    Module.compilers[extension] ||
    ((filename: string, content: string) => content);

  Module.compilers[extension] = (filename: string, content: string) => {
    if (filename === fileToRun) {
      return callback(filename, content, defaultBehavior);
    } else {
      return defaultBehavior(filename, content);
    }
  };
}

export default async function runFileTarget(
  fileToRun: string,
  langOverride: string | null
) {
  let absFileToRun = Path.isAbsolute(fileToRun)
    ? fileToRun
    : fileToRun.match(/^\.{1,2}\//)
    ? std.resolveModule(fileToRun, "./<cwd>")
    : Path.join(pwd(), fileToRun).toString();

  absFileToRun = realpath(absFileToRun).toString();

  if (langOverride != null) {
    const compiler = langToCompiler(langOverride);
    overrideCompiler(absFileToRun, (filename, content) => {
      return compiler(content, { filename });
    });
  }

  try {
    std.importModule(absFileToRun, "./<cwd>");
  } catch (err: any) {
    if (
      typeof err === "object" &&
      err != null &&
      err.name === "SyntaxError" &&
      err.message === "unexpected 'await' keyword"
    ) {
      overrideCompiler(absFileToRun, (filename, content, defaultBehavior) => {
        const asJs = defaultBehavior(filename, content);
        const asCjs = compilers.esmToCjs(asJs, { filename });
        return `export const __toplevel_await_promise__ = (async function topLevelAwaitWrapper() { ${asCjs} }).call(this);`;
      });

      let result: any;
      try {
        const exp = std.importModule(absFileToRun, "./<cwd>");
        result = exp.__toplevel_await_promise__;
      } catch (err: any) {
        if (
          typeof err === "object" &&
          err != null &&
          err.name === "SyntaxError" &&
          err.message === "unsupported keyword: export"
        ) {
          const err: any = new Error(
            `You cannot use toplevel await and export in the same file. Either remove the toplevel await (by wrapping stuff with an immediately-invoked async function) or remove the exports.`
          );
          err.filename = absFileToRun;
          throw err;
        } else {
          throw err;
        }
      }

      await result;
    } else {
      throw err;
    }
  }
}
