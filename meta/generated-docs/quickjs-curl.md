- ["quickjs:curl" (namespace)](#quickjscurl-namespace)
  - ["quickjs:curl".UrlGetOptions (exported interface)](#quickjscurlurlgetoptions-exported-interface)
    - [UrlGetOptions.binary (boolean property)](#urlgetoptionsbinary-boolean-property)
    - [UrlGetOptions.full (boolean property)](#urlgetoptionsfull-boolean-property)
    - [UrlGetOptions.headers (property)](#urlgetoptionsheaders-property)
  - ["quickjs:curl".UrlGet (exported interface)](#quickjscurlurlget-exported-interface)
    - [UrlGet(...) (call signature)](#urlget-call-signature)
    - [UrlGet(...) (call signature)](#urlget-call-signature-1)
    - [UrlGet(...) (call signature)](#urlget-call-signature-2)
    - [UrlGet(...) (call signature)](#urlget-call-signature-3)
    - [UrlGet(...) (call signature)](#urlget-call-signature-4)
    - [UrlGet(...) (call signature)](#urlget-call-signature-5)
    - [UrlGet(...) (call signature)](#urlget-call-signature-6)
    - [UrlGet(...) (call signature)](#urlget-call-signature-7)
    - [UrlGet(...) (call signature)](#urlget-call-signature-8)
    - [UrlGet(...) (call signature)](#urlget-call-signature-9)
    - [UrlGet(...) (call signature)](#urlget-call-signature-10)
  - ["quickjs:curl".urlGet (exported UrlGet)](#quickjscurlurlget-exported-urlget)
  - ["quickjs:curl".UrlRequestOptions (exported interface)](#quickjscurlurlrequestoptions-exported-interface)
    - [UrlRequestOptions.body (property)](#urlrequestoptionsbody-property)
    - [UrlRequestOptions.redirect (property)](#urlrequestoptionsredirect-property)
  - ["quickjs:curl".UrlRequest (exported interface)](#quickjscurlurlrequest-exported-interface)
    - [UrlRequest(...) (call signature)](#urlrequest-call-signature)
    - [UrlRequest(...) (call signature)](#urlrequest-call-signature-1)
    - [UrlRequest(...) (call signature)](#urlrequest-call-signature-2)
    - [UrlRequest(...) (call signature)](#urlrequest-call-signature-3)
  - ["quickjs:curl".urlRequest (exported UrlRequest)](#quickjscurlurlrequest-exported-urlrequest)

# "quickjs:curl" (namespace)

The `"quickjs:curl"` module provides networking functions implemented with
libcurl, which is loaded dynamically at runtime.

```ts
declare module "quickjs:curl" {
  export interface UrlGetOptions {
    binary?: boolean;
    full?: boolean;
    headers?: Record<string, string | number | bigint>;
  }
  export interface UrlGet {
    (url: string): string;
    (
      url: string,
      options: UrlGetOptions & {
        full: true;
        binary: true;
      },
    ): {
      status: number;
      response: ArrayBuffer;
      responseHeaders: string;
    };
    (
      url: string,
      options: UrlGetOptions & {
        full: true;
      },
    ): {
      status: number;
      response: string;
      responseHeaders: string;
    };
    (
      url: string,
      options: UrlGetOptions & {
        full: true;
        binary: false;
      },
    ): {
      status: number;
      response: string;
      responseHeaders: string;
    };
    (
      url: string,
      options: UrlGetOptions & {
        binary: true;
      },
    ): ArrayBuffer;
    (
      url: string,
      options: UrlGetOptions & {
        binary: true;
        full: false;
      },
    ): ArrayBuffer;
    (
      url: string,
      options: UrlGetOptions & {
        binary: false;
      },
    ): string;
    (
      url: string,
      options: UrlGetOptions & {
        full: false;
      },
    ): string;
    (
      url: string,
      options: UrlGetOptions & {
        binary: false;
        full: false;
      },
    ): string;
    (
      url: string,
      options: UrlGetOptions & {
        binary?: false;
        full?: false;
      },
    ): string;
    (
      url: string,
      options: UrlGetOptions,
    ):
      | string
      | ArrayBuffer
      | {
          status: number;
          response: string | ArrayBuffer;
          responseHeaders: string;
        };
  }
  export var urlGet: UrlGet;
  export interface UrlRequestOptions extends Omit<UrlGetOptions, "full"> {
    body?: string | ArrayBuffer;
    redirect?: "follow" | "error" | "manual";
  }
  export interface UrlRequest {
    (
      method: string,
      url: string,
    ): {
      status: number;
      response: string;
      responseHeaders: {
        [name: string]: Array<string> | undefined;
      };
    };
    (
      method: string,
      url: string,
      options: UrlRequestOptions & {
        binary: true;
      },
    ): {
      status: number;
      response: ArrayBuffer;
      responseHeaders: {
        [name: string]: Array<string> | undefined;
      };
    };
    (
      method: string,
      url: string,
      options: UrlRequestOptions & {
        binary?: false;
      },
    ): {
      status: number;
      response: string;
      responseHeaders: {
        [name: string]: Array<string> | undefined;
      };
    };
    (
      method: string,
      url: string,
      options: UrlRequestOptions,
    ): {
      status: number;
      response: string | ArrayBuffer;
      responseHeaders: {
        [name: string]: Array<string> | undefined;
      };
    };
  }
  export var urlRequest: UrlRequest;
}
```

## "quickjs:curl".UrlGetOptions (exported interface)

Options for [urlGet](/meta/generated-docs/quickjs-curl.md#quickjscurlurlget-exported-urlget).

```ts
interface UrlGetOptions {
  binary?: boolean;
  full?: boolean;
  headers?: Record<string, string | number | bigint>;
}
```

### UrlGetOptions.binary (boolean property)

When true, the response body is returned as an ArrayBuffer instead of a
string. Defaults to false.

```ts
binary?: boolean;
```

### UrlGetOptions.full (boolean property)

When true, `urlGet` returns an object with `response`, `responseHeaders`,
and `status` properties instead of only the response body, and it
doesn't throw when the http status code is outside 200-299. Defaults to
false.

```ts
full?: boolean;
```

### UrlGetOptions.headers (property)

Request headers to send, as an object whose keys are header names and
whose values are header values. Numbers and bigints get converted to
strings. An empty string sends the header with no value.

Be aware that libcurl may also add other headers, such as `Accept` or
`Host`. That said, the header values you specify will take precedence
over values added by libcurl.

```ts
headers?: Record<string, string | number | bigint>;
```

## "quickjs:curl".UrlGet (exported interface)

```ts
interface UrlGet {
  (url: string): string;
  (
    url: string,
    options: UrlGetOptions & {
      full: true;
      binary: true;
    },
  ): {
    status: number;
    response: ArrayBuffer;
    responseHeaders: string;
  };
  (
    url: string,
    options: UrlGetOptions & {
      full: true;
    },
  ): {
    status: number;
    response: string;
    responseHeaders: string;
  };
  (
    url: string,
    options: UrlGetOptions & {
      full: true;
      binary: false;
    },
  ): {
    status: number;
    response: string;
    responseHeaders: string;
  };
  (
    url: string,
    options: UrlGetOptions & {
      binary: true;
    },
  ): ArrayBuffer;
  (
    url: string,
    options: UrlGetOptions & {
      binary: true;
      full: false;
    },
  ): ArrayBuffer;
  (
    url: string,
    options: UrlGetOptions & {
      binary: false;
    },
  ): string;
  (
    url: string,
    options: UrlGetOptions & {
      full: false;
    },
  ): string;
  (
    url: string,
    options: UrlGetOptions & {
      binary: false;
      full: false;
    },
  ): string;
  (
    url: string,
    options: UrlGetOptions & {
      binary?: false;
      full?: false;
    },
  ): string;
  (
    url: string,
    options: UrlGetOptions,
  ):
    | string
    | ArrayBuffer
    | {
        status: number;
        response: string | ArrayBuffer;
        responseHeaders: string;
      };
}
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded). Returns string when
the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get response
headers and status code. See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string): string;
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded).

Returns an object with three properties:

- `response`: response body content (ArrayBuffer)
- `responseHeaders`: headers separated by CRLF (string)
- `status`: status code (number)

See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  full: true;
  binary: true;
}): {
  status: number;
  response: ArrayBuffer;
  responseHeaders: string;
};
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded).

Returns an object with three properties:

- `response`: response body content (string)
- `responseHeaders`: headers separated by CRLF (string)
- `status`: status code (number)

See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  full: true;
}): {
  status: number;
  response: string;
  responseHeaders: string;
};
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded).

Returns an object with three properties:

- `response`: response body content (string)
- `responseHeaders`: headers separated by CRLF (string)
- `status`: status code (number)

See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  full: true;
  binary: false;
}): {
  status: number;
  response: string;
  responseHeaders: string;
};
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded). Returns ArrayBuffer
when the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get response
headers and status code. See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  binary: true;
}): ArrayBuffer;
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded). Returns ArrayBuffer
when the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get response
headers and status code. See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  binary: true;
  full: false;
}): ArrayBuffer;
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded). Returns string when
the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get response
headers and status code. See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  binary: false;
}): string;
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded). Returns string when
the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get response
headers and status code. See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  full: false;
}): string;
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded). Returns string when
the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get response
headers and status code. See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  binary: false;
  full: false;
}): string;
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded). Returns string when
the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get response
headers and status code. See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions & {
  binary?: false;
  full?: false;
}): string;
```

### UrlGet(...) (call signature)

Download `url` using libcurl (dynamically loaded).

When the `full` option is true, returns an object with three
properties:

- `response`: response body content (ArrayBuffer when the `binary`
  option is true, string otherwise)
- `responseHeaders`: headers separated by CRLF (string)
- `status`: status code (number)

Otherwise, returns the response body (ArrayBuffer when the `binary`
option is true, string otherwise) when the http status code is between
200 and 299, and throws otherwise.

See [UrlGetOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlgetoptions-exported-interface) for all options.

```ts
(url: string, options: UrlGetOptions): string | ArrayBuffer | {
  status: number;
  response: string | ArrayBuffer;
  responseHeaders: string;
};
```

## "quickjs:curl".urlGet (exported UrlGet)

```ts
var urlGet: UrlGet;
```

## "quickjs:curl".UrlRequestOptions (exported interface)

Options for [urlRequest](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequest-exported-urlrequest).

```ts
interface UrlRequestOptions extends Omit<UrlGetOptions, "full"> {
  body?: string | ArrayBuffer;
  redirect?: "follow" | "error" | "manual";
}
```

### UrlRequestOptions.body (property)

The request body. Strings are sent as UTF-8.

When omitted, the request has no body, except that a POST request sends
an empty one.

When a body is sent, libcurl adds the header
`Content-Type: application/x-www-form-urlencoded`, unless you specify a
`Content-Type` in `headers`.

Passing a body with the HEAD method throws a TypeError.

```ts
body?: string | ArrayBuffer;
```

### UrlRequestOptions.redirect (property)

What to do when the server responds with a redirect. Defaults to `"follow"`.

- `"follow"`: Follow any 3xx response that has a `Location` header. See [UrlRequest](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequest-exported-interface) for how redirects affect the method and body.
- `"error"`: Throw an Error for any response that `"follow"` would follow, which is any 3xx response that has a `Location` header. A 3xx response without a `Location` header is returned as-is.
- `"manual"`: Don't follow the redirect. `urlRequest` returns the redirect response itself, with its status, headers (including `location`), and body.

```ts
redirect?: "follow" | "error" | "manual";
```

## "quickjs:curl".UrlRequest (exported interface)

The type of [urlRequest](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequest-exported-urlrequest).

By default, `urlRequest` follows redirects, which affect the request like
this:

- After a 301, 302, or 303 redirect, a POST becomes a GET without a body,
  like in browsers.
- A 303 redirect also drops the body of any other method, but keeps the
  method.
- Otherwise, the method and body are both kept.

Use the `redirect` option to throw on redirects or to get the redirect
response instead. See [UrlRequestOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequestoptions-exported-interface).

```ts
interface UrlRequest {
  (
    method: string,
    url: string,
  ): {
    status: number;
    response: string;
    responseHeaders: {
      [name: string]: Array<string> | undefined;
    };
  };
  (
    method: string,
    url: string,
    options: UrlRequestOptions & {
      binary: true;
    },
  ): {
    status: number;
    response: ArrayBuffer;
    responseHeaders: {
      [name: string]: Array<string> | undefined;
    };
  };
  (
    method: string,
    url: string,
    options: UrlRequestOptions & {
      binary?: false;
    },
  ): {
    status: number;
    response: string;
    responseHeaders: {
      [name: string]: Array<string> | undefined;
    };
  };
  (
    method: string,
    url: string,
    options: UrlRequestOptions,
  ): {
    status: number;
    response: string | ArrayBuffer;
    responseHeaders: {
      [name: string]: Array<string> | undefined;
    };
  };
}
```

### UrlRequest(...) (call signature)

Send a request to `url` using libcurl (dynamically loaded).

Returns an object with three properties:

- `response`: response body content (string)
- `responseHeaders`: an object whose keys are lowercased header names and whose values are arrays of header values (it's an array in case the header is specified more than once)
- `status`: status code (number)

Unlike [urlGet](/meta/generated-docs/quickjs-curl.md#quickjscurlurlget-exported-urlget), this doesn't throw when the http status code is
outside 200-299. Redirects are followed unless the `redirect` option
says otherwise; see [UrlRequest](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequest-exported-interface) for how they affect the method
and body.

- `@param` _method_ — The request method, such as `"GET"`, `"POST"`, `"PUT"`, or `"DELETE"`. It's sent exactly as written, so it's case-sensitive.
- `@param` _url_ — The URL to send the request to.

```ts
(method: string, url: string): {
  status: number;
  response: string;
  responseHeaders: {
    [name: string]: Array<string> | undefined;
  };
};
```

### UrlRequest(...) (call signature)

Send a request to `url` using libcurl (dynamically loaded).

Returns an object with three properties:

- `response`: response body content (ArrayBuffer)
- `responseHeaders`: an object whose keys are lowercased header names and whose values are arrays of header values (it's an array in case the header is specified more than once)
- `status`: status code (number)

Unlike [urlGet](/meta/generated-docs/quickjs-curl.md#quickjscurlurlget-exported-urlget), this doesn't throw when the http status code is
outside 200-299. Redirects are followed unless the `redirect` option
says otherwise; see [UrlRequest](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequest-exported-interface) for how they affect the method
and body.

- `@param` _method_ — The request method, such as `"GET"`, `"POST"`, `"PUT"`, or `"DELETE"`. It's sent exactly as written, so it's case-sensitive.
- `@param` _url_ — The URL to send the request to.
- `@param` _options_ — Options pertaining to the request. See [UrlRequestOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequestoptions-exported-interface) for all options.

```ts
(method: string, url: string, options: UrlRequestOptions & {
  binary: true;
}): {
  status: number;
  response: ArrayBuffer;
  responseHeaders: {
    [name: string]: Array<string> | undefined;
  };
};
```

### UrlRequest(...) (call signature)

Send a request to `url` using libcurl (dynamically loaded).

Returns an object with three properties:

- `response`: response body content (string)
- `responseHeaders`: an object whose keys are lowercased header names and whose values are arrays of header values (it's an array in case the header is specified more than once)
- `status`: status code (number)

Unlike [urlGet](/meta/generated-docs/quickjs-curl.md#quickjscurlurlget-exported-urlget), this doesn't throw when the http status code is
outside 200-299. Redirects are followed unless the `redirect` option
says otherwise; see [UrlRequest](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequest-exported-interface) for how they affect the method
and body.

- `@param` _method_ — The request method, such as `"GET"`, `"POST"`, `"PUT"`, or `"DELETE"`. It's sent exactly as written, so it's case-sensitive.
- `@param` _url_ — The URL to send the request to.
- `@param` _options_ — Options pertaining to the request. See [UrlRequestOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequestoptions-exported-interface) for all options.

```ts
(method: string, url: string, options: UrlRequestOptions & {
  binary?: false;
}): {
  status: number;
  response: string;
  responseHeaders: {
    [name: string]: Array<string> | undefined;
  };
};
```

### UrlRequest(...) (call signature)

Send a request to `url` using libcurl (dynamically loaded).

Returns an object with three properties:

- `response`: response body content (ArrayBuffer when the `binary`
  option is true, string otherwise)
- `responseHeaders`: an object whose keys are lowercased header names and whose values are arrays of header values (it's an array in case the header is specified more than once)
- `status`: status code (number)

Unlike [urlGet](/meta/generated-docs/quickjs-curl.md#quickjscurlurlget-exported-urlget), this doesn't throw when the http status code is
outside 200-299. Redirects are followed unless the `redirect` option
says otherwise; see [UrlRequest](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequest-exported-interface) for how they affect the method
and body.

- `@param` _method_ — The request method, such as `"GET"`, `"POST"`, `"PUT"`, or `"DELETE"`. It's sent exactly as written, so it's case-sensitive.
- `@param` _url_ — The URL to send the request to.
- `@param` _options_ — Options pertaining to the request. See [UrlRequestOptions](/meta/generated-docs/quickjs-curl.md#quickjscurlurlrequestoptions-exported-interface) for all options.

```ts
(method: string, url: string, options: UrlRequestOptions): {
  status: number;
  response: string | ArrayBuffer;
  responseHeaders: {
    [name: string]: Array<string> | undefined;
  };
};
```

## "quickjs:curl".urlRequest (exported UrlRequest)

```ts
var urlRequest: UrlRequest;
```
