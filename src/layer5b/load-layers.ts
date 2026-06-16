import * as Bytecode from "quickjs:bytecode";

declare var __bytecode_layer1: ArrayBuffer;
declare var __bytecode_layer2: ArrayBuffer;
declare var __bytecode_layer3: ArrayBuffer;
declare var __bytecode_layer4: ArrayBuffer;

Bytecode.toValue(__bytecode_layer1)();
Bytecode.toValue(__bytecode_layer2)();
Bytecode.toValue(__bytecode_layer3)();
Bytecode.toValue(__bytecode_layer4)();

// delete globalThis.__bytecode_layer1;
// delete globalThis.__bytecode_layer2;
// delete globalThis.__bytecode_layer3;
// delete globalThis.__bytecode_layer4;

declare var __yavascript_layer4_internals: import("../layer4/index").__yavascript_layer4_internals;
const { getDtsText } = __yavascript_layer4_internals;

yavascript.getTypesDts = getDtsText;

// delete globalThis.__yavascript_layer1_internals;
// delete globalThis.__yavascript_layer2_internals;
// delete globalThis.__yavascript_layer4_internals;
