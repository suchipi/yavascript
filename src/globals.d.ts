declare var __bytecode_layer1: ArrayBuffer;
declare var __bytecode_layer2: ArrayBuffer;
declare var __bytecode_layer3: ArrayBuffer;
declare var __bytecode_layer4: ArrayBuffer;

declare var __yavascript_layer1_internals: import("./layer1/index").__yavascript_layer1_internals;
declare var __yavascript_layer2_internals: import("./layer2/index").__yavascript_layer2_internals;
declare var __yavascript_layer4_internals: import("./layer4/index").__yavascript_layer4_internals;

// Declared in layer 1 and used downstream
declare var Path: typeof import("./layer1/api/path").Path;
declare type Path = import("./layer1/api/path").Path;
declare var extname: typeof import("./layer1/api/commands/extname").extname;
declare var pwd: typeof import("./layer1/api/commands/pwd").pwd;
declare var realpath: typeof import("./layer1/api/commands/realpath").realpath;
declare var readFile: typeof import("./layer1/api/filesystem").readFile;
declare var bold: typeof import("./layer1/api/strings").bold;
declare var blue: typeof import("./layer1/api/strings").blue;
declare var cyan: typeof import("./layer1/api/strings").cyan;
declare var yellow: typeof import("./layer1/api/strings").yellow;
declare var dim: typeof import("./layer1/api/strings").dim;
declare var underline: typeof import("./layer1/api/strings").underline;
declare var stripAnsi: typeof import("./layer1/api/strings").stripAnsi;
declare var startRepl: typeof import("./layer1/api/repl").startRepl;

// Declared in layer 1, filled in in layer 2. used downstream
declare var yavascript: typeof import("./layer1/api/yavascript").yavascript;

// Declared and assigned in layer 3
declare var Worker: typeof import("./layer3/worker").Worker;
declare var Context: typeof import("./layer3/context").Context;
