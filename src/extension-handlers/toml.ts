import { ModuleDelegate } from "quickjs:engine";

const template = (data: any) =>
  `const data = ${JSON.stringify(data, null, 2)};
export default data;

export const __isCjsModule = true;
export const __cjsExports = data;
`;

ModuleDelegate.compilers[".toml"] = (filename: string, content: string) => {
  const { TOML } = require("../api/toml");
  const data = TOML.parse(content);
  return template(data);
};
