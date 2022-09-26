import * as std from "std";
import * as CoffeeScript from "coffeescript";

export default function installCoffeeScriptHandlers() {
  Module.searchExtensions.push(".coffee");
  Module.compilers[".coffee"] = (filename: string) => {
    const content = std.loadFile(filename);
    const compiled = CoffeeScript.compile(content, {
      bare: true,
      filename,
    });
    return compiled;
  };
}
