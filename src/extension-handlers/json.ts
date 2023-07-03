import * as std from "quickjs:std";

const template = (data: any) =>
  `
const data = ${JSON.stringify(data, null, 2)};
export default data;

/* to make 'require' of json behave like in node */
export const __isCjsModule = true;
export const __cjsExports = data;
`.trim();

Module.compilers[".json"] = (filename: string, content: string) => {
  const data = std.parseExtJSON(content);
  return template(data);
};
