import { evaluate, cleanResult } from "./test-helpers";

test("globals", async () => {
  const result = await evaluate(`
    console.log(); // print newline first so inline snapshot is more readable

    const globalDescriptors = Object.getOwnPropertyDescriptors(globalThis);
    for (const [key, descriptor] of Object.entries(globalDescriptors)) {
      try {
        const value = globalThis[key];
        const hasHelpText = help.getHelpText(value) !== null;
        console.log((hasHelpText ? "[x] " : "[ ] ") + key + ":", typeof value);
      } catch (err) {
        console.log("[-] " + key, "throws error")
      }
    }
  `);
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "
    [x] Object: function
    [x] Function: function
    [x] Error: function
    [x] EvalError: function
    [x] RangeError: function
    [x] ReferenceError: function
    [x] SyntaxError: function
    [x] TypeError: function
    [x] URIError: function
    [x] InternalError: function
    [x] AggregateError: function
    [x] Array: function
    [x] parseInt: function
    [x] parseFloat: function
    [x] isNaN: function
    [x] isFinite: function
    [x] decodeURI: function
    [x] decodeURIComponent: function
    [x] encodeURI: function
    [x] encodeURIComponent: function
    [x] escape: function
    [x] unescape: function
    [x] Infinity: number
    [x] NaN: number
    [x] undefined: undefined
    [x] __date_clock: function
    [x] Number: function
    [x] Boolean: function
    [x] String: function
    [x] Math: object
    [x] Reflect: object
    [x] Symbol: function
    [x] eval: function
    [x] globalThis: object
    [x] Date: function
    [x] RegExp: function
    [x] JSON: object
    [x] Proxy: function
    [x] Map: function
    [x] Set: function
    [x] WeakMap: function
    [x] WeakSet: function
    [x] ArrayBuffer: function
    [x] SharedArrayBuffer: function
    [x] Uint8ClampedArray: function
    [x] Int8Array: function
    [x] Uint8Array: function
    [x] Int16Array: function
    [x] Uint16Array: function
    [x] Int32Array: function
    [x] Uint32Array: function
    [x] BigInt64Array: function
    [x] BigUint64Array: function
    [x] Float32Array: function
    [x] Float64Array: function
    [x] DataView: function
    [x] Atomics: object
    [x] Promise: function
    [x] BigInt: function
    [x] BigFloat: function
    [x] BigFloatEnv: function
    [x] BigDecimal: function
    [x] Operators: function
    [x] inspect: function
    [ ] __qjsbootstrap_offset: number
    [x] console: object
    [x] print: function
    [x] scriptArgs: object
    [ ] setTimeout: function
    [ ] clearTimeout: function
    [ ] setInterval: function
    [ ] clearInterval: function
    [ ] require: function
    [ ] std: object
    [ ] os: object
    [x] basename: function
    [x] cat: function
    [x] cd: function
    [x] chmod: function
    [x] dirname: function
    [x] echo: function
    [x] exit: function
    [x] extname: function
    [x] ls: function
    [x] printf: function
    [x] pwd: function
    [x] readlink: function
    [x] realpath: function
    [x] sleep: function
    [x] touch: function
    [x] which: function
    [-] mkdir throws error
    [-] mkdirp throws error
    [-] cp throws error
    [-] mv throws error
    [-] ren throws error
    [-] rm throws error
    [-] grep throws error
    [-] man throws error
    [-] cwd throws error
    [-] where throws error
    [-] FILE throws error
    [x] env: object
    [x] exec: function
    [x] $: function
    [x] ChildProcess: function
    [x] exists: function
    [x] isFile: function
    [x] isDir: function
    [x] isLink: function
    [x] readFile: function
    [x] remove: function
    [x] writeFile: function
    [x] ensureDir: function
    [x] copy: function
    [x] rename: function
    [x] isExecutable: function
    [x] isReadable: function
    [x] isWritable: function
    [x] Path: function
    [x] glob: function
    [x] types: object
    [x] is: function
    [x] _is: function
    [x] assert: function
    [x] GitRepo: function
    [x] quote: function
    [x] stripAnsi: function
    [x] bgBlack: function
    [x] bgBlue: function
    [x] bgCyan: function
    [x] bgGreen: function
    [x] bgMagenta: function
    [x] bgRed: function
    [x] bgWhite: function
    [x] bgYellow: function
    [x] black: function
    [x] blue: function
    [x] bold: function
    [x] cyan: function
    [x] dim: function
    [x] gray: function
    [x] green: function
    [x] grey: function
    [x] hidden: function
    [x] inverse: function
    [x] italic: function
    [x] magenta: function
    [x] red: function
    [x] reset: function
    [x] strikethrough: function
    [x] underline: function
    [x] white: function
    [x] yellow: function
    [x] clear: function
    [x] bigint: function
    [x] boolean: function
    [x] number: function
    [x] string: function
    [x] symbol: function
    [x] JSX: object
    [x] CSV: object
    [x] YAML: object
    [x] logger: object
    [x] parseScriptArgs: function
    [ ] startRepl: function
    [ ] InteractivePrompt: function
    [x] yavascript: object
    [x] help: function
    [x] TOML: object
    [x] __filename: string
    [x] __dirname: string
    [x] grepFile: function
    [x] grepString: function
    [x] global: object
    [x] process: object
    ",
    }
  `);
});
