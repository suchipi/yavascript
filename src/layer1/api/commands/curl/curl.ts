import * as quickjsCurl from "quickjs:curl";
import * as encoding from "quickjs:encoding";

export type CurlOptions = {
  method?: string;
  body?: string | ArrayBuffer | undefined;
  headers?: Record<string, string | number | bigint>;
  redirect?: "follow" | "error" | "manual" | undefined;
};

export class CurlResponse {
  status: number;
  headers: {
    [name: string]: string[] | undefined;
  };
  ok: boolean;

  protected _response: ArrayBuffer;

  constructor(result: {
    status: number;
    response: ArrayBuffer;
    responseHeaders: {
      [name: string]: string[] | undefined;
    };
  }) {
    this.status = result.status;
    this.headers = result.responseHeaders;
    this.ok = result.status >= 200 && result.status <= 299;
    this._response = result.response;
  }

  arrayBuffer() {
    return this._response;
  }
  bytes() {
    return new Uint8Array(this._response);
  }
  json() {
    return JSON.parse(encoding.toUtf8(this._response));
  }
  text() {
    return encoding.toUtf8(this._response);
  }
}

export function curl(url: string, options: CurlOptions = {}): CurlResponse {
  const method = options.method?.toUpperCase() ?? "GET";

  const { body, headers, redirect } = options;
  const result = quickjsCurl.urlRequest(method, url, {
    binary: true,
    body,
    headers,
    redirect,
  });

  return new CurlResponse(result);
}
