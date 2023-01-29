import * as std from "quickjs:std";
import compilers from "../compilers";
import { makeErrorWithProperties } from "../error-with-properties";

const HTTP_RE = /^http:\/\//i;

export function handlesModulePath(modulePath: string) {
  return HTTP_RE.test(modulePath);
}

export function normalizeModulePath(modulePath: string) {
  return modulePath;
}

export function readModule(modulePath: string) {
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

  return compilers.autodetect(response, { filename: modulePath });
}
