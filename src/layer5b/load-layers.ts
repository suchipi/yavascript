import * as Bytecode from "quickjs:bytecode";

Bytecode.toValue(__bytecode_layer1)();
Bytecode.toValue(__bytecode_layer2)();
Bytecode.toValue(__bytecode_layer3)();
Bytecode.toValue(__bytecode_layer4)();

// @ts-ignore the operand of a delete operation must be optional
delete globalThis.__bytecode_layer1;
// @ts-ignore the operand of a delete operation must be optional
delete globalThis.__bytecode_layer2;
// @ts-ignore the operand of a delete operation must be optional
delete globalThis.__bytecode_layer3;
// @ts-ignore the operand of a delete operation must be optional
delete globalThis.__bytecode_layer4;

const {
  __yavascript_layer4_internals,
}: typeof import("./layer-internals") = require("./layer-internals");

const { getDtsText } = __yavascript_layer4_internals;

yavascript.getTypesDts = getDtsText;
