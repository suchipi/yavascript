/**
 * Make a web request synchronously using the system libcurl library.
 *
 * Although most of yavascript is statically-linked, libcurl is not, because it
 * changes often and relies on your system's TLS libraries. To keep its
 * functionality secure and reliable, it's loaded dynamically on demand.
 *
 * On macOS, we attempt to load "libcurl.dylib". On Windows, we attempt to load
 * "libcurl.dll" or "libcurl-4.dll". On other platforms, we attempt to load
 * "libcurl.so.4" or "libcurl.so".
 *
 * To make a web request asynchronously, use curl within {@link runInWorker}.
 *
 * @param url - The web request url.
 * @param options - Request options. See {@link CurlOptions}.
 * @returns - A {@link CurlResponse} with the response data.
 */
declare function curl(url: string, options?: CurlOptions): CurlResponse;

/** Options for {@link curl}. */
declare type CurlOptions = {
  /**
   * HTTP request method. Defaults to "GET".
   *
   * Input values get uppercased.
   */
  method?: string;
  /** HTTP request body. */
  body?: string | ArrayBuffer | undefined;
  /** HTTP request headers. */
  headers?: Record<string, string | number | bigint>;
  /**
   * Redirect-following behavior. The default value is "follow", meaning
   * redirects will be followed.
   */
  redirect?: "follow" | "error" | "manual" | undefined;
};

/**
 * The response object returned by {@link curl}.
 *
 * Although it resembles the standard web `Response` object, note that its
 * methods aren't async (and neither is {@link curl}).
 */
declare class CurlResponse {
  /** The status code, eg. 200, 404, etc. */
  status: number;
  /**
   * The response headers, **with lowercase header names**.
   *
   * The value is an array of strings because headers such as "Set-Cookie" can
   * be specified more than once.
   */
  headers: {
    [name: string]: string[] | undefined;
  };
  /** A boolean indicating whether the status code is >= 200 and <= 299. */
  ok: boolean;

  /** Returns the response body as an ArrayBuffer. */
  arrayBuffer(): ArrayBuffer;
  /** Returns the response body as a Uint8Array. */
  bytes(): Uint8Array;
  /** Returns the response body as UTF-8 text passed through JSON.parse. */
  json(): unknown;
  /** Returns the response body as UTF-8 text. */
  text(): string;

  constructor(result: {
    status: number;
    response: ArrayBuffer;
    responseHeaders: {
      [name: string]: string[] | undefined;
    };
  });

  /** The raw response data. */
  protected _response: ArrayBuffer;
}
