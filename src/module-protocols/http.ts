import * as std from "quickjs:std";
import compilers from "../compilers";

const HTTP_RE = /^http:\/\//i;

export function handlesModulePath(modulePath: string) {
  return HTTP_RE.test(modulePath);
}

export function normalizeModulePath(modulePath: string) {
  return modulePath;
}

export function readModule(modulePath: string) {
  const content = std.urlGet(modulePath);
  return compilers.autodetect(content, { filename: modulePath });
}
