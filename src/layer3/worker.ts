import * as engine from "quickjs:engine";
import * as os from "quickjs:os";

declare var yavascript: typeof import("../layer1/api/yavascript").yavascript;

// deref these now so we can delete them from the global later
const __bytecode_layer1: ArrayBuffer = globalThis.__bytecode_layer1;
const __bytecode_layer2: ArrayBuffer = globalThis.__bytecode_layer2;

const compilers = yavascript.compilers;

export class Worker extends os.Worker {
  constructor(
    ...args:
      | [modulePath: string | Path]
      | [
          fakeModuleFilename: string | Path,
          options: {
            overrideCode?: string;
            initialData?: import("quickjs:os").StructuredClonable;
          },
        ]
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
    let initialData: import("quickjs:os").StructuredClonable | undefined;
    if (args.length === 2) {
      if (args[1].overrideCode) {
        rawCode = args[1].overrideCode;
      } else {
        rawCode = readFile(absoluteModulePath);
      }

      if ("initialData" in args[1]) {
        initialData = args[1].initialData;
      } else {
        initialData = undefined;
      }
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
        __bytecode_layer1,
        __bytecode_layer2,
        userInitialData: initialData,
      },
      overrideCode: [
        `globalThis.Worker = require('quickjs:os').Worker;`,
        `require("quickjs:bytecode").toValue(Worker.initialData.__bytecode_layer1)();`,
        `require("quickjs:bytecode").toValue(Worker.initialData.__bytecode_layer2)();`,
        // Placeholder for layer 3: We just need Worker.parent to resolve. The
        // yavascript-specific constructor override doesn't matter because
        // Workers aren't allowed to make sub-Workers.
        `Object.defineProperty(Worker, "initialData", { value: Worker.initialData.userInitialData });`,
        compiledCode,
      ].join(" "),
    });
  }
}
