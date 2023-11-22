// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar
import { ModuleDelegate } from "quickjs:engine";

import "./civet";
import "./coffee";
import "./empty";
import "./js";
import "./json";
import "./jsx";
import "./ts";
import "./tsx";

ModuleDelegate.searchExtensions = [
  ".civet",
  ".ts",
  ".tsx",
  ".coffee",
  ".jsx",
  ".js",
];
