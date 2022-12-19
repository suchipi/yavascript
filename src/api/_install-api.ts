// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar
import { makeGetterPropertyDescriptorMap } from "../lazy-load";

const quickjsBuiltinsProps = makeGetterPropertyDescriptorMap({
  std: () => require("std"),
  os: () => require("os"),
});

import commandsProps from "./commands/_all";
import stubsProps from "./commands/_stubs";

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

const pathsProps = makeGetterPropertyDescriptorMap({
  paths: () => require("./paths").paths,
});

const globProps = makeGetterPropertyDescriptorMap({
  glob: () => require("./glob").glob,
});

const isProps = makeGetterPropertyDescriptorMap({
  is: () => require("./is").is,
});

const repoProps = makeGetterPropertyDescriptorMap({
  isGitignored: () => require("./repo").isGitignored,
  repoRoot: () => require("./repo").repoRoot,
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

const othersProps = makeGetterPropertyDescriptorMap({
  bigint: () => require("./others").bigint,
  boolean: () => require("./others").boolean,
  number: () => require("./others").number,
  string: () => require("./others").string,
  symbol: () => require("./others").symbol,
});

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
  traceAll: () => require("./traceAll").traceAll,
});

const parseScriptArgsProps = makeGetterPropertyDescriptorMap({
  parseScriptArgs: () => require("./parse-script-args").default,
});

const startReplProps = makeGetterPropertyDescriptorMap({
  startRepl: () => require("./start-repl").startRepl,
});

const nodeCompatProps = makeGetterPropertyDescriptorMap({
  process: () => require("./node-compat").process,
});

import { get__filename, get__dirname } from "./__filename-and-__dirname";

export default function installApi(target: typeof globalThis) {
  Object.defineProperties(target, {
    ...quickjsBuiltinsProps,
    ...commandsProps,
    ...stubsProps,
    ...envProps,
    ...execProps,
    ...filesystemProps,
    ...pathsProps,
    ...globProps,
    ...isProps,
    ...repoProps,
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
    ...nodeCompatProps,

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
}
