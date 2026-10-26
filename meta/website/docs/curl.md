---
hide_title: true
---
## curl (function)

Make a web request synchronously using the system libcurl library.

Although most of yavascript is statically-linked, libcurl is not, because it
changes often and relies on your system's TLS libraries. To keep its
functionality secure and reliable, it's loaded dynamically on demand.

On macOS, we attempt to load "libcurl.dylib". On Windows, we attempt to load
"libcurl.dll" or "libcurl-4.dll". On other platforms, we attempt to load
"libcurl.so.4" or "libcurl.so".

To make a web request asynchronously, use curl within [runInWorker](./runInWorker.md).

- `@param` _url_ — The web request url.
- `@param` _options_ — Request options. See [CurlOptions](./curl.md#curloptions-type).
- `@returns` - A [CurlResponse](./curl.md#curlresponse-class) with the response data.

```ts
declare function curl(url: string, options?: CurlOptions): CurlResponse;
```

## CurlOptions (type)

Options for [curl](./curl.md#curl-function).

```ts
declare type CurlOptions = {
  method?: string;
  body?: string | ArrayBuffer | undefined;
  headers?: Record<string, string | number | bigint>;
  redirect?: "follow" | "error" | "manual" | undefined;
};
```

### CurlOptions.method (string property)

HTTP request method. Defaults to "GET".

Input values get uppercased.

```ts
method?: string;
```

### CurlOptions.body (property)

HTTP request body.

```ts
body?: string | ArrayBuffer | undefined;
```

### CurlOptions.headers (property)

HTTP request headers.

```ts
headers?: Record<string, string | number | bigint>;
```

### CurlOptions.redirect (property)

Redirect-following behavior. The default value is "follow", meaning
redirects will be followed.

```ts
redirect?: "follow" | "error" | "manual" | undefined;
```

## CurlResponse (class)

The response object returned by [curl](./curl.md#curl-function).

Although it resembles the standard web `Response` object, note that its
methods aren't async (and neither is [curl](./curl.md#curl-function)).

```ts
declare class CurlResponse {
  status: number;
  headers: {
    [name: string]: string[] | undefined;
  };
  ok: boolean;
  arrayBuffer(): ArrayBuffer;
  bytes(): Uint8Array;
  json(): unknown;
  text(): string;
  constructor(result: {
    status: number;
    response: ArrayBuffer;
    responseHeaders: {
      [name: string]: string[] | undefined;
    };
  });
  protected _response: ArrayBuffer;
}
```

### CurlResponse.prototype.status (number property)

The status code, eg. 200, 404, etc.

```ts
status: number;
```

### CurlResponse.prototype.headers (object property)

The response headers, **with lowercase header names**.

The value is an array of strings because headers such as "Set-Cookie" can
be specified more than once.

```ts
headers: {
  [name: string]: string[] | undefined;
};
```

### CurlResponse.prototype.ok (boolean property)

A boolean indicating whether the status code is >= 200 and <= 299.

```ts
ok: boolean;
```

### CurlResponse.prototype.arrayBuffer (method)

Returns the response body as an ArrayBuffer.

```ts
arrayBuffer(): ArrayBuffer;
```

### CurlResponse.prototype.bytes (method)

Returns the response body as a Uint8Array.

```ts
bytes(): Uint8Array;
```

### CurlResponse.prototype.json (method)

Returns the response body as UTF-8 text passed through JSON.parse.

```ts
json(): unknown;
```

### CurlResponse.prototype.text (method)

Returns the response body as UTF-8 text.

```ts
text(): string;
```

### CurlResponse (constructor)

```ts
constructor(result: {
  status: number;
  response: ArrayBuffer;
  responseHeaders: {
    [name: string]: string[] | undefined;
  };
});
```

### CurlResponse.prototype._response (ArrayBuffer property)

The raw response data.

```ts
protected _response: ArrayBuffer;
```
