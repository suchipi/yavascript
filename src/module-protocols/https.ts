import * as http from "./http";

const HTTPS_RE = /^https:\/\//i;

export function handlesModulePath(modulePath: string) {
  return HTTPS_RE.test(modulePath);
}

export function normalizeModulePath(modulePath: string) {
  return modulePath;
}

export function readModule(modulePath: string) {
  return http.readModule(modulePath);
}
