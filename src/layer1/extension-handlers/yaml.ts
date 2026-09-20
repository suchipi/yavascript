import { ModuleDelegate } from "quickjs:engine";

// Parsed when the module runs, not at compile time; see the note in toml.ts.
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
