import { Context as QuickJsContext } from "quickjs:context";

type QuickJsContextOptions = typeof QuickJsContext extends {
  new (options?: infer OptsArg): any;
}
  ? OptsArg
  : never;

// deref these now so we can delete them from the global later
const __bytecode_layer1: ArrayBuffer = globalThis.__bytecode_layer1;
const __bytecode_layer2: ArrayBuffer = globalThis.__bytecode_layer2;

export class Context extends QuickJsContext {
  constructor(
    options?: QuickJsContextOptions & {
      yavascriptGlobals?: boolean;
    },
  ) {
    if (options != null && options.yavascriptGlobals !== false) {
      const required = ["date", "promise", "moduleGlobals"] as const;
      for (const option of required) {
        if (options[option] === false) {
          throw new Error(
            `The '${option}' option can't be disabled unless 'yavascriptGlobals' is also false, because the yavascript globals are built using it.`,
          );
        }
      }
    }

    super(options);

    // The engine's Context constructor ignores new.target, so the instance
    // comes back carrying the base class's prototype.
    Object.setPrototypeOf(this, new.target.prototype);

    if (options?.yavascriptGlobals !== false) {
      const Bytecode = this.globalThis.require("quickjs:bytecode");
      this.globalThis.__run_bytecode_layer1 =
        Bytecode.toValue(__bytecode_layer1);
      this.globalThis.__run_bytecode_layer2 =
        Bytecode.toValue(__bytecode_layer2);
      this.eval("__run_bytecode_layer1();");
      this.eval("__run_bytecode_layer2();");
      delete this.globalThis.__run_bytecode_layer1;
      delete this.globalThis.__run_bytecode_layer2;
      // @ts-ignore operand of a delete operator must be optional
      delete this.globalThis.__yavascript_layer1_internals;
      // @ts-ignore operand of a delete operator must be optional
      delete this.globalThis.__yavascript_layer2_internals;
      require("./install-layer3-globals").installLayer3Globals(this.globalThis);
    }
  }
}
