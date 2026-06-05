import * as engine from "quickjs:engine";
import * as os from "quickjs:os";
import { readFile } from "../filesystem";
import compilers from "../../compilers";
import { Path } from "../path";

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
    super(
      absoluteModulePath.toString(),
      // TODO: other YS APIs
      "globalThis.Worker = require('quickjs:os').Worker;" + compiledCode,
    );
  }
}
