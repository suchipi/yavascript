import { ModuleDelegate } from "quickjs:engine";

// The source is parsed when the module runs rather than at compile time,
// because embedding the parsed data means routing it through JSON, which
// turns Dates into strings, Infinity and NaN into null, Sets into {}, and
// refuses BigInts outright.
const compiler = (filename: string, content: string) =>
  `const data = TOML.parse(${JSON.stringify(content)});
export default data;

export const __isCjsModule = true;
export const __cjsExports = data;
`;

ModuleDelegate.compilers[".toml"] = compiler;
// import attribute version
ModuleDelegate.compilers["toml"] = compiler;
