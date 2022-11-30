// This file loads all the globals and etc

import installApi from "./api/_installApi";
installApi(globalThis);

import "./extension-handlers/_load-all";
