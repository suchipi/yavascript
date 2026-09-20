import * as std from "quickjs:std";
import compilers from "../compilers";
import { ModuleDelegate } from "quickjs:engine";
import { makeErrorWithProperties } from "../error-with-properties";

const HTTP_RE = /^http:\/\//i;

export function handlesModulePath(modulePath: string) {
  return HTTP_RE.test(modulePath);
}

export function normalizeModulePath(modulePath: string) {
  return modulePath;
}

export function readModule(
  modulePath: string,
  attributes?: { [key: string]: string },
) {
  const { status, response, responseHeaders } = std.urlGet(modulePath, {
    full: true,
  });
  if (status < 200 || status > 299) {
    const err = makeErrorWithProperties(`Failed to load module`, {
      httpStatusCode: status,
      url: modulePath,
    });
    err.httpResponseHeaders = responseHeaders;
    err.httpResponseBody = response;
    throw err;
  }

  const type = attributes?.type;
  if (typeof type === "string") {
    const compilerForType = ModuleDelegate.compilers[type];
    if (typeof compilerForType === "function") {
      return compilerForType(modulePath, response, attributes);
    }
  }

  return compilers.autodetect(response, { filename: modulePath });
}
