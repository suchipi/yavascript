// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar
import { makeGetterPropertyDescriptorMap } from "../lazy-load";

// TODO: query cpu count, max memory, free memory?

import {
  grepFile,
  grepString,
  installToStringProto as installGrepToStringProto,
} from "./grep";
import { install as installRegexpEscape } from "./regexp-escape";
import { install as installStringDedent } from "./string-dedent";
import { installModuleHooks } from "../module-hooks";
import { installNodeCompat } from "./node-compat/node-compat";
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
  readEnvBool: () => require("./env").readEnvBool,
});

const execProps = makeGetterPropertyDescriptorMap({
  exec: () => require("./exec").exec,
  $: () => require("./exec").$,
  ChildProcess: () => require("./exec").ChildProcess,
});

const filesystemProps = makeGetterPropertyDescriptorMap({
  exists: () => require("./filesystem").exists,
  isFile: () => require("./filesystem").isFile,
  isDir: () => require("./filesystem").isDir,
  isLink: () => require("./filesystem").isLink,
  readFile: () => require("./filesystem").readFile,
  remove: () => require("./filesystem").remove,
  writeFile: () => require("./filesystem").writeFile,
  copy: () => require("./filesystem").copy,
  rename: () => require("./filesystem").rename,
  isExecutable: () => require("./filesystem").isExecutable,
  isReadable: () => require("./filesystem").isReadable,
  isWritable: () => require("./filesystem").isWritable,
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
  // Alias `_is` to `is` for Civet, because `is` is a reserved keyword in Civet.
  _is: () => require("./is").is,
});

const assertProps = makeGetterPropertyDescriptorMap({
  assert: () => require("./assert").assert,
});

const stringsProps = makeGetterPropertyDescriptorMap({
  quote: () => require("./strings").quote,
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
  clear: () => require("./console").clear,
});

const openUrlProps = makeGetterPropertyDescriptorMap({
  openUrl: () => require("./open-url").openUrl,
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

const loggerProps = makeGetterPropertyDescriptorMap({
  logger: () => require("./logger").logger,
});

const parseScriptArgsProps = makeGetterPropertyDescriptorMap({
  parseScriptArgs: () => require("./parse-script-args").parseScriptArgs,
});

const replProps = makeGetterPropertyDescriptorMap({
  startRepl: () => require("./repl").startRepl,
  InteractivePrompt: () => require("./repl").InteractivePrompt,
});

const yavascriptProps = makeGetterPropertyDescriptorMap({
  yavascript: () => require("./yavascript").yavascript,
});

const helpProps = makeGetterPropertyDescriptorMap({
  help: () => require("./help").help,
});

const tomlProps = makeGetterPropertyDescriptorMap({
  TOML: () => require("./toml").TOML,
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
    ...openUrlProps,
    ...othersProps,
    ...jsxProps,
    ...csvProps,
    ...yamlProps,
    ...loggerProps,
    ...parseScriptArgsProps,
    ...replProps,
    ...yavascriptProps,
    ...helpProps,
    ...tomlProps,

    __filename: {
      get() {
        return get__filename(2);
      },
      set(_newValue) {
        throw new Error("__filename's value cannot be changed");
      },
    },
    __dirname: {
      get() {
        return get__dirname(2);
      },
      set(_newValue) {
        throw new Error("__dirname's value cannot be changed");
      },
    },
  });

  Object.assign(target, {
    grepFile,
    grepString,
  });

  installGrepToStringProto(target.String.prototype);
  installRegexpEscape(target.RegExp);
  installStringDedent(target.String);
  installModuleHooks();
  installNodeCompat(target);
  patchRequire(target);
}
