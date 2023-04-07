// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar
import { makeGetterPropertyDescriptorMap } from "../lazy-load";

import { grepFile, grepString, installToStringProto } from "./grep";
import { install as installRegexpEscape } from "./regexp-escape";
import { installModuleHooks } from "../module-hooks";
import { installNodeCompat } from "./node-compat";
import { patchRequire } from "../cjs-interop";

const quickjsBuiltinsProps = makeGetterPropertyDescriptorMap({
  std: () => require("quickjs:std"),
  os: () => require("quickjs:os"),
});

import commandsProps from "./commands/_all";
import stubsProps from "./commands/_stubs";

const FILEstubProps = makeGetterPropertyDescriptorMap(
  {
    FILE() {
      throw new Error(
        "'FILE', as a global constructor, is not defined. To create a FILE, use functions from the 'quickjs:std' module. To check if a value is a FILE, use `is(something, types.FILE)`."
      );
    },
  },
  false
);

const envProps = makeGetterPropertyDescriptorMap({
  env: () => require("./env").env,
});

const execProps = makeGetterPropertyDescriptorMap({
  exec: () => require("./exec").exec,
  $: () => require("./exec").$,
});

const filesystemProps = makeGetterPropertyDescriptorMap({
  exists: () => require("./filesystem").exists,
  isDir: () => require("./filesystem").isDir,
  isLink: () => require("./filesystem").isLink,
  readFile: () => require("./filesystem").readFile,
  remove: () => require("./filesystem").remove,
  writeFile: () => require("./filesystem").writeFile,
  ensureDir: () => require("./filesystem").ensureDir,
  copy: () => require("./filesystem").copy,
});

const pathProps = makeGetterPropertyDescriptorMap({
  Path: () => require("./path").Path,
});

const gitRepoProps = makeGetterPropertyDescriptorMap({
  GitRepo: () => require("./git-repo").GitRepo,
});

const globProps = makeGetterPropertyDescriptorMap({
  glob: () => require("./glob").glob,
});

const typesProps = makeGetterPropertyDescriptorMap({
  types: () => require("./types").types,
});

const isProps = makeGetterPropertyDescriptorMap({
  is: () => require("./is").is,
});

const assertProps = makeGetterPropertyDescriptorMap({
  assert: () => require("./assert").assert,
});

const stringsProps = makeGetterPropertyDescriptorMap({
  quote: () => require("./strings").quote,
  clear: () => require("./strings").clear,
  stripAnsi: () => require("./strings").stripAnsi,
  bgBlack: () => require("./strings").bgBlack,
  bgBlue: () => require("./strings").bgBlue,
  bgCyan: () => require("./strings").bgCyan,
  bgGreen: () => require("./strings").bgGreen,
  bgMagenta: () => require("./strings").bgMagenta,
  bgRed: () => require("./strings").bgRed,
  bgWhite: () => require("./strings").bgWhite,
  bgYellow: () => require("./strings").bgYellow,
  black: () => require("./strings").black,
  blue: () => require("./strings").blue,
  bold: () => require("./strings").bold,
  cyan: () => require("./strings").cyan,
  dim: () => require("./strings").dim,
  gray: () => require("./strings").gray,
  green: () => require("./strings").green,
  grey: () => require("./strings").grey,
  hidden: () => require("./strings").hidden,
  inverse: () => require("./strings").inverse,
  italic: () => require("./strings").italic,
  magenta: () => require("./strings").magenta,
  red: () => require("./strings").red,
  reset: () => require("./strings").reset,
  strikethrough: () => require("./strings").strikethrough,
  underline: () => require("./strings").underline,
  white: () => require("./strings").white,
  yellow: () => require("./strings").yellow,
});

const consoleProps = makeGetterPropertyDescriptorMap({
  console: () => require("./console").console,
  print: () => require("./console").print,
});

const pipeProps = makeGetterPropertyDescriptorMap({
  pipe: () => require("./pipe").pipe,
});

const othersProps = makeGetterPropertyDescriptorMap(
  {
    bigint: () => require("./others").bigint,
    boolean: () => require("./others").boolean,
    number: () => require("./others").number,
    string: () => require("./others").string,
    symbol: () => require("./others").symbol,
  },
  false
);

const jsxProps = makeGetterPropertyDescriptorMap({
  JSX: () => require("./jsx").JSX,
});

const csvProps = makeGetterPropertyDescriptorMap({
  CSV: () => require("./csv").CSV,
});

const yamlProps = makeGetterPropertyDescriptorMap({
  YAML: () => require("./yaml").YAML,
});

const traceAllProps = makeGetterPropertyDescriptorMap({
  traceAll: () => require("./traceAll").default,
});

const parseScriptArgsProps = makeGetterPropertyDescriptorMap({
  parseScriptArgs: () => require("./parse-script-args").default,
});

const startReplProps = makeGetterPropertyDescriptorMap({
  startRepl: () => require("./start-repl").startRepl,
});

const yavascriptProps = makeGetterPropertyDescriptorMap({
  yavascript: () => require("./yavascript").yavascript,
});

import { get__filename, get__dirname } from "./__filename-and-__dirname";

export default function installApi(target: typeof globalThis) {
  Object.defineProperties(target, {
    ...quickjsBuiltinsProps,
    ...commandsProps,
    ...stubsProps,
    ...FILEstubProps,
    ...envProps,
    ...execProps,
    ...filesystemProps,
    ...pathProps,
    ...globProps,
    ...typesProps,
    ...isProps,
    ...assertProps,
    ...gitRepoProps,
    ...stringsProps,
    ...consoleProps,
    ...pipeProps,
    ...othersProps,
    ...jsxProps,
    ...csvProps,
    ...yamlProps,
    ...traceAllProps,
    ...parseScriptArgsProps,
    ...startReplProps,
    ...yavascriptProps,

    __filename: {
      get() {
        return get__filename(2);
      },
    },
    __dirname: {
      get() {
        return get__dirname(2);
      },
    },
  });

  Object.assign(target, {
    grepFile,
    grepString,
  });

  installToStringProto(target.String.prototype);
  installRegexpEscape(target.RegExp);
  installModuleHooks((target as any).Module);
  installNodeCompat(target);
  patchRequire(target);
}
