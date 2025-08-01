import { evaluate, cleanResult } from "./test-helpers";

test("globals", async () => {
  const result = await evaluate(`
    console.log(); // print newline first so inline snapshot is more readable

    const PLACEHOLDER = Symbol("PLACEHOLDER");

    const globalDescriptors = Object.getOwnPropertyDescriptors(globalThis);
    for (const [key, descriptor] of Object.entries(globalDescriptors)) {
      let logLine = key + ":";

      let value;
      try {
        value = globalThis[key];
        logLine += " " + typeof value;
      } catch (err) {
        logLine += " get throws error";
      }

      if ((descriptor.writable || descriptor.set) && key !== "undefined" && key !== "globalThis") {
        try {
          globalThis[key] = PLACEHOLDER;
          if (globalThis[key] !== PLACEHOLDER) {
            logLine += " writable but rejects new value";
          }
        } catch (err) {
          logLine += " set throws error";
        }
        globalThis[key] = value;
      } else {
        logLine += " readonly";
      }

      logLine += " (";
      if (descriptor.get) {
        logLine += "G";
      }
      if (descriptor.set) {
        logLine += "S";
      }
      if (descriptor.configurable) {
        logLine += "C";
      }
      if (descriptor.writable) {
        logLine += "W";
      }
      if (descriptor.enumerable) {
        logLine += "E";
      }
      logLine += ")";
      
      console.log(logLine);
    }
  `);
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: __filename's value cannot be changed
      at somewhere
    ",
      "stdout": "
    Object: function (CW)
    Function: function (CW)
    Error: function (CW)
    EvalError: function (CW)
    RangeError: function (CW)
    ReferenceError: function (CW)
    SyntaxError: function (CW)
    TypeError: function (CW)
    URIError: function (CW)
    InternalError: function (CW)
    AggregateError: function (CW)
    Array: function (CW)
    parseInt: function (CW)
    parseFloat: function (CW)
    isNaN: function (CW)
    isFinite: function (CW)
    decodeURI: function (CW)
    decodeURIComponent: function (CW)
    encodeURI: function (CW)
    encodeURIComponent: function (CW)
    escape: function (CW)
    unescape: function (CW)
    Infinity: number readonly ()
    NaN: number readonly ()
    undefined: undefined readonly ()
    __date_clock: function (CW)
    Number: function (CW)
    Boolean: function (CW)
    String: function (CW)
    Math: object (CW)
    Reflect: object (CW)
    Symbol: function (CW)
    eval: function (CW)
    globalThis: object readonly (CW)
    Date: function (CW)
    RegExp: function (CW)
    JSON: object (CW)
    Proxy: function (CW)
    Map: function (CW)
    Set: function (CW)
    WeakMap: function (CW)
    WeakSet: function (CW)
    ArrayBuffer: function (CW)
    SharedArrayBuffer: function (CW)
    Uint8ClampedArray: function (CW)
    Int8Array: function (CW)
    Uint8Array: function (CW)
    Int16Array: function (CW)
    Uint16Array: function (CW)
    Int32Array: function (CW)
    Uint32Array: function (CW)
    BigInt64Array: function (CW)
    BigUint64Array: function (CW)
    Float32Array: function (CW)
    Float64Array: function (CW)
    DataView: function (CW)
    Atomics: object (CW)
    Promise: function (CW)
    BigInt: function (CW)
    BigFloat: function (CW)
    BigFloatEnv: function (CW)
    BigDecimal: function (CW)
    Operators: function (CW)
    inspect: function (CWE)
    print: function (GSCE)
    console: object (GSCE)
    setInterval: function (CWE)
    clearInterval: function (CWE)
    __qjsbootstrap_offset: number readonly ()
    scriptArgs: object (CWE)
    setTimeout: function (CWE)
    clearTimeout: function (CWE)
    require: function (CWE)
    __kame_instances__: object (CWE)
    std: object (GSCE)
    os: object (GSCE)
    basename: function (GSCE)
    cat: function (GSCE)
    cd: function (GSCE)
    chmod: function (GSCE)
    dirname: function (GSCE)
    echo: function (GSCE)
    exit: function (GSCE)
    extname: function (GSCE)
    ls: function (GSCE)
    mkdir: function (GSCE)
    mkdirp: function (GSCE)
    printf: function (GSCE)
    pwd: function (GSCE)
    readlink: function (GSCE)
    realpath: function (GSCE)
    sleep: function (GSCE)
    touch: function (GSCE)
    which: function (GSCE)
    whoami: function (GSCE)
    ensureDir: get throws error (GSC)
    cp: get throws error (GSC)
    mv: get throws error (GSC)
    ren: get throws error (GSC)
    rm: get throws error (GSC)
    grep: get throws error (GSC)
    man: get throws error (GSC)
    cwd: get throws error (GSC)
    where: get throws error (GSC)
    id: get throws error (GSC)
    openURL: get throws error (GSC)
    FILE: get throws error (GSC)
    env: object (GSCE)
    readEnvBool: function (GSCE)
    exec: function (GSCE)
    $: function (GSCE)
    ChildProcess: function (GSCE)
    exists: function (GSCE)
    isFile: function (GSCE)
    isDir: function (GSCE)
    isLink: function (GSCE)
    readFile: function (GSCE)
    remove: function (GSCE)
    writeFile: function (GSCE)
    copy: function (GSCE)
    rename: function (GSCE)
    isExecutable: function (GSCE)
    isReadable: function (GSCE)
    isWritable: function (GSCE)
    Path: function (GSCE)
    glob: function (GSCE)
    types: object (GSCE)
    is: function (GSCE)
    _is: function (GSCE)
    assert: function (GSCE)
    GitRepo: function (GSCE)
    quote: function (GSCE)
    stripAnsi: function (GSCE)
    bgBlack: function (GSCE)
    bgBlue: function (GSCE)
    bgCyan: function (GSCE)
    bgGreen: function (GSCE)
    bgMagenta: function (GSCE)
    bgRed: function (GSCE)
    bgWhite: function (GSCE)
    bgYellow: function (GSCE)
    black: function (GSCE)
    blue: function (GSCE)
    bold: function (GSCE)
    cyan: function (GSCE)
    dim: function (GSCE)
    gray: function (GSCE)
    green: function (GSCE)
    grey: function (GSCE)
    hidden: function (GSCE)
    inverse: function (GSCE)
    italic: function (GSCE)
    magenta: function (GSCE)
    red: function (GSCE)
    reset: function (GSCE)
    strikethrough: function (GSCE)
    underline: function (GSCE)
    white: function (GSCE)
    yellow: function (GSCE)
    clear: function (GSCE)
    openUrl: function (GSCE)
    bigint: function (GSC)
    boolean: function (GSC)
    number: function (GSC)
    string: function (GSC)
    symbol: function (GSC)
    JSX: object (GSCE)
    CSV: object (GSCE)
    YAML: object (GSCE)
    logger: object (GSCE)
    parseScriptArgs: function (GSCE)
    startRepl: function (GSCE)
    InteractivePrompt: function (GSCE)
    yavascript: object (GSCE)
    help: function (GSCE)
    TOML: object (GSCE)
    ",
    }
  `);
});

test("overriding yavascript api globals works", async () => {
  const result = await evaluate(`glob = true; console.log(glob)`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("overriding yavascript api stubs works", async () => {
  const result = await evaluate(`ensureDir = mkdirp; console.log(ensureDir)`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Function "mkdirp" {}
    ",
    }
  `);
});
