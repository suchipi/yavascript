import * as std from "quickjs:std";

const NPM_PROTO_RE = /^npm:/i;
const SKYPACK_URL = "https://cdn.skypack.dev";
// HACK: looks like all of skypack's sub-import paths start with /-/.
// Rely on that to identify sub-modules from skypack.
const SKYPACK_SUBMODULE_RE = /^\/\-\//;

export function handlesModulePath(modulePath: string) {
  return (
    modulePath.startsWith(SKYPACK_URL) ||
    NPM_PROTO_RE.test(modulePath) ||
    SKYPACK_SUBMODULE_RE.test(modulePath)
  );
}

export function normalizeModulePath(modulePath: string) {
  if (NPM_PROTO_RE.test(modulePath)) {
    return modulePath.replace(NPM_PROTO_RE, SKYPACK_URL + "/");
  }

  if (SKYPACK_SUBMODULE_RE.test(modulePath)) {
    return SKYPACK_URL + modulePath;
  }

  return modulePath;
}

export function readModule(modulePath: string) {
  return std.urlGet(modulePath);
}
