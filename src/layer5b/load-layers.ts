import * as Bytecode from "quickjs:bytecode";

Bytecode.toValue(__bytecode_layer1)();
Bytecode.toValue(__bytecode_layer2)();
Bytecode.toValue(__bytecode_layer3)();
Bytecode.toValue(__bytecode_layer4)();

// delete globalThis.__bytecode_layer1;
// delete globalThis.__bytecode_layer2;
// delete globalThis.__bytecode_layer3;
// delete globalThis.__bytecode_layer4;

const { getDtsText } = __yavascript_layer4_internals;

yavascript.getTypesDts = getDtsText;

// delete globalThis.__yavascript_layer1_internals;
// delete globalThis.__yavascript_layer2_internals;
// delete globalThis.__yavascript_layer4_internals;
