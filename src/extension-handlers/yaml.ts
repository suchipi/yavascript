import { ModuleDelegate } from "quickjs:engine";

const template = (data: any) =>
  `const data = ${JSON.stringify(data, null, 2)};
export default data;

export const __isCjsModule = true;
export const __cjsExports = data;
`;

const compiler = (filename: string, content: string) => {
  const { YAML } = require("../api/yaml");
  const data = YAML.parse(content);
  return template(data);
};

ModuleDelegate.compilers[".yaml"] = compiler;
ModuleDelegate.compilers[".yml"] = compiler;
