import { ModuleDelegate } from "quickjs:engine";

// Parsed at module run time instead of module compile time
const compiler = (filename: string, content: string) =>
  `const data = YAML.parse(${JSON.stringify(content)});
export default data;

export const __isCjsModule = true;
export const __cjsExports = data;
`;

ModuleDelegate.compilers[".yaml"] = compiler;
ModuleDelegate.compilers[".yml"] = compiler;

// import attribute version
ModuleDelegate.compilers["yaml"] = compiler;
ModuleDelegate.compilers["yml"] = compiler;
