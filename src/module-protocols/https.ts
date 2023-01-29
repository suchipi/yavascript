import * as std from "quickjs:std";
import compilers from "../compilers";

const HTTPS_RE = /^https:\/\//i;

export function handlesModulePath(modulePath: string) {
  return HTTPS_RE.test(modulePath);
}

export function normalizeModulePath(modulePath: string) {
  return modulePath;
}

export function readModule(modulePath: string) {
  const content = std.urlGet(modulePath);
  return compilers.autodetect(content, { filename: modulePath });
}
