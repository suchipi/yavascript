import * as engine from "quickjs:engine";
import * as os from "quickjs:os";

// Note: unlike most files in API, we intentionally avoid importing stuff into
// this bundle and rely on accessing everything via globals instead, so that
// this bundle doesn't duplicate stuff from the primordials bundles (since this
// API is NOT included in the primordials bundles, since it depends on the
// primordial bundles)

declare var yavascript: typeof import("../yavascript").yavascript;
declare var __bytecode_primordials_base: ArrayBuffer;
declare var __bytecode_primordials_hardcoded: ArrayBuffer;

const compilers = yavascript.compilers;

export class Worker extends os.Worker {
  constructor(
    ...args:
      | [modulePath: string | Path]
      | [fakeModuleFilename: string | Path, overrideCode: string]
  ) {
    const requestedModulePath = args[0];

    let absoluteModulePath: Path;
    if (Path.isAbsolute(requestedModulePath)) {
      absoluteModulePath = Path.isPath(requestedModulePath)
        ? requestedModulePath
        : new Path(requestedModulePath);
    } else {
      absoluteModulePath = new Path(
        engine.resolveModule(
          requestedModulePath.toString(),
          engine.getFileNameFromStack(1),
        ),
      );
    }

    let rawCode: string;
    if (args.length === 2) {
      rawCode = args[1];
    } else if (args.length === 1) {
      rawCode = readFile(absoluteModulePath);
    } else {
      throw new Error(
        "Incorrect number of arguments given to Worker constructor",
      );
    }

    const extensionWithDot = absoluteModulePath.extname();
    const compilerForExtension: (typeof compilers)[keyof typeof compilers] =
      compilers[extensionWithDot.replace(/^\./, "").toLowerCase()] ??
      compilers.autodetect;

    const compiledCode = compilerForExtension(rawCode, {
      filename: absoluteModulePath.toString(),
    });

    super(absoluteModulePath.toString(), {
      initialData: {
        __bytecode_primordials_base,
        __bytecode_primordials_hardcoded,
      },
      overrideCode: [
        // We just need Worker.parent to resolve. The yavascript-specific
        // constructor override doesn't matter because Workers aren't allowed to
        // make sub-Workers.
        `globalThis.Worker = require('quickjs:os').Worker;`,
        `require("quickjs:bytecode").toValue(Worker.initialData.__bytecode_primordials_base)();`,
        `require("quickjs:bytecode").toValue(Worker.initialData.__bytecode_primordials_hardcoded)();`,
        compiledCode,
      ].join(" "),
    });
  }
}
