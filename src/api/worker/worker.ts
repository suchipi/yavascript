import * as engine from "quickjs:engine";
import * as os from "quickjs:os";
import { readFile } from "../filesystem";
import compilers from "../../compilers";

export class Worker extends os.Worker {
  constructor(
    ...args:
      | [modulePath: string]
      | [fakeModuleFilename: string, overrideCode: string]
  ) {
    if (args.length === 2) {
      super(...args);
    } else if (args.length === 1) {
      const [modulePath] = args;

      const absModulePath = engine.resolveModule(
        modulePath,
        engine.getFileNameFromStack(1),
      );
      const rawCode = readFile(absModulePath);
      const compiledCode = compilers.autodetect(rawCode, {
        filename: absModulePath,
      });
      super(
        absModulePath,
        compiledCode + ";\nglobalThis.Worker = require('quickjs:os').Worker",
      );
    } else {
      throw new Error(
        "Incorrect number of arguments given to Worker constructor",
      );
    }
  }
}
