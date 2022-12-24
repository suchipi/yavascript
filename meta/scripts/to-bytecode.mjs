#!/usr/bin/env qjs
import * as std from "std";
import * as bytecode from "bytecode";

const [_qjs, _toBytecode, input, output] = scriptArgs;

if (!(input && output)) {
  throw new Error("You must specify an input path and output path.");
}

const bc = bytecode.fromFile(input);

const file = std.open(output, "w");
file.write(bc, 0, bc.byteLength);
file.close();
