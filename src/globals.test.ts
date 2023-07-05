import { evaluate, cleanResult } from "./test-helpers";

test("globals", async () => {
  const result = await evaluate(`
    const globalDescriptors = Object.getOwnPropertyDescriptors(globalThis);
    for (const [key, descriptor] of Object.entries(globalDescriptors)) {
      try {
        const value = globalThis[key];
        console.log(key, typeof value);
      } catch (err) {
        console.log(key, "throws error")
      }
    }
  `);
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Object function
    Function function
    Error function
    EvalError function
    RangeError function
    ReferenceError function
    SyntaxError function
    TypeError function
    URIError function
    InternalError function
    AggregateError function
    Array function
    parseInt function
    parseFloat function
    isNaN function
    isFinite function
    decodeURI function
    decodeURIComponent function
    encodeURI function
    encodeURIComponent function
    escape function
    unescape function
    Infinity number
    NaN number
    undefined undefined
    __date_clock function
    Number function
    Boolean function
    String function
    Math object
    Reflect object
    Symbol function
    eval function
    globalThis object
    Date function
    RegExp function
    JSON object
    Proxy function
    Map function
    Set function
    WeakMap function
    WeakSet function
    ArrayBuffer function
    SharedArrayBuffer function
    Uint8ClampedArray function
    Int8Array function
    Uint8Array function
    Int16Array function
    Uint16Array function
    Int32Array function
    Uint32Array function
    BigInt64Array function
    BigUint64Array function
    Float32Array function
    Float64Array function
    DataView function
    Atomics object
    Promise function
    BigInt function
    BigFloat function
    BigFloatEnv function
    BigDecimal function
    Operators function
    inspect function
    __qjsbootstrap_offset number
    console object
    print function
    scriptArgs object
    require function
    Module object
    setTimeout function
    clearTimeout function
    setInterval function
    clearInterval function
    std object
    os object
    basename function
    cat function
    cd function
    chmod function
    dirname function
    echo function
    extname function
    ls function
    printf function
    pwd function
    readlink function
    realpath function
    touch function
    mkdir throws error
    cp throws error
    mv throws error
    ren throws error
    rm throws error
    grep throws error
    man throws error
    FILE throws error
    env object
    exec function
    $ function
    ChildProcess function
    exists function
    isDir function
    isLink function
    readFile function
    remove function
    writeFile function
    ensureDir function
    copy function
    rename function
    Path function
    glob function
    types object
    is function
    assert function
    GitRepo function
    quote function
    stripAnsi function
    bgBlack function
    bgBlue function
    bgCyan function
    bgGreen function
    bgMagenta function
    bgRed function
    bgWhite function
    bgYellow function
    black function
    blue function
    bold function
    cyan function
    dim function
    gray function
    green function
    grey function
    hidden function
    inverse function
    italic function
    magenta function
    red function
    reset function
    strikethrough function
    underline function
    white function
    yellow function
    clear function
    pipe function
    bigint function
    boolean function
    number function
    string function
    symbol function
    JSX object
    CSV object
    YAML object
    traceAll function
    parseScriptArgs function
    startRepl function
    InteractivePrompt function
    yavascript object
    help function
    __filename string
    __dirname string
    grepFile function
    grepString function
    global object
    process object
    ",
    }
  `);
});
