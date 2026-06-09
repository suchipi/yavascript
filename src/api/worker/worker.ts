import * as engine from "quickjs:engine";
import * as os from "quickjs:os";
import { readFile } from "../filesystem";
import compilers from "../../compilers";
import { Path } from "../path";

import primordialsBundleCode from "../../../dist/bundles/primordials-base.min.js?contentString";

declare var yavascript: typeof import("../yavascript").yavascript;

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
      [
        primordialsBundleCode,
        // We just need Worker.parent to resolve. The yavascript-specific
        // constructor override doesn't matter because Workers aren't allowed to
        // make sub-Workers.
        `;globalThis.Worker = require('quickjs:os').Worker;`,
        `globalThis.yavascript.version = ${JSON.stringify(yavascript.version)};`,
        `globalThis.yavascript.arch = ${JSON.stringify(yavascript.arch)};`,
        compiledCode,
      ].join("\n"),
    );
  }
}
