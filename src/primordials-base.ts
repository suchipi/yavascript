// This file loads all the globals and etc

import installApi from "./api/_install-api";
installApi(globalThis);

import "./extension-handlers/_load-all";
