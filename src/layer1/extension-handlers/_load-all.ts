// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar
import { ModuleDelegate } from "quickjs:engine";

import "./civet";
import "./coffee";
import "./empty";
import "./js";
import "./json";
import "./jsx";
import "./toml";
import "./ts";
import "./tsx";
import "./yaml";

ModuleDelegate.searchExtensions = [
  ".civet",
  ".ts",
  ".tsx",
  ".coffee",
  ".jsx",
  ".js",
];

// The engine picks a compiler by matching /(\.[^.]+)$/ against the whole
// module path, so a dot anywhere in a directory name (~/.local/bin,
// node_modules/.bin, v1.2/) yields a key like ".bin/script" and a file with no
// extension of its own is never compiled. An explicit type takes precedence
// over that lookup, so one is supplied when the basename has no extension.
const readWithoutExtensionFix = ModuleDelegate.read;
ModuleDelegate.read = (moduleName: string, attributes?: any) => {
  if (attributes == null || typeof attributes.type !== "string") {
    const basename = moduleName.split(/[/\\]/).pop() ?? "";
    if (!basename.includes(".")) {
      attributes = { ...attributes, type: "" };
    }
  }
  return readWithoutExtensionFix(moduleName, attributes);
};
