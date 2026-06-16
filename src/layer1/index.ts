// This file loads all the globals and etc except Worker

import installApi from "./api/_install-api";
installApi(globalThis);

import "./extension-handlers/_load-all";

import * as esmToRequire from "./esm-to-require";
import { NOTHING } from "./api/repl/special";
import { LANGS, langToCompiler } from "./langs";
import { hasColors } from "./has-colors";
import printError from "./print-error";

const __yavascript_layer1_internals = {
  esmToRequire,
  NOTHING,
  langToCompiler,
  hasColors,
  printError,
  LANGS,
  startRepl,
};

export type __yavascript_layer1_internals =
  typeof __yavascript_layer1_internals;

globalThis.__yavascript_layer1_internals = __yavascript_layer1_internals;
