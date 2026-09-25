import * as std from "quickjs:std";
import { ModuleDelegate } from "quickjs:engine";

const template = (data: any) =>
  `const data = ${JSON.stringify(data, null, 2)};
export default data;

/* to make 'require' of json behave like in node */
export const __isCjsModule = true;
export const __cjsExports = data;
`;

const compiler = (filename: string, content: string) => {
  // Note: JSON files are loaded as JSON5
  const data = std.parseExtJSON(content);
  return template(data);
};

ModuleDelegate.compilers[".json"] = compiler;
ModuleDelegate.compilers[".json5"] = compiler;

// The engine registers these too, but its versions emit only a default
// export, which require() can't tell apart from an ES module that happens to
// have one.
ModuleDelegate.compilers["json"] = compiler;
ModuleDelegate.compilers["json5"] = compiler;
