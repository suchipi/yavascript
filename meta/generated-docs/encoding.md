- ["quickjs:encoding" (namespace)](#quickjsencoding-namespace)
  - ["quickjs:encoding".toUtf8 (exported function)](#quickjsencodingtoutf8-exported-function)
  - ["quickjs:encoding".fromUtf8 (exported function)](#quickjsencodingfromutf8-exported-function)
  - ["quickjs:encoding".TextEncoder (exported class)](#quickjsencodingtextencoder-exported-class)
    - [TextEncoder (constructor)](#textencoder-constructor)
    - [TextEncoder.prototype.encoding (TextEncoding property)](#textencoderprototypeencoding-textencoding-property)
    - [TextEncoder.prototype.encode (method)](#textencoderprototypeencode-method)
    - [TextEncoder.prototype.encodeInto (method)](#textencoderprototypeencodeinto-method)
  - ["quickjs:encoding".TextEncoding (type)](#quickjsencodingtextencoding-type)
  - ["quickjs:encoding".TextEncodingLabel (type)](#quickjsencodingtextencodinglabel-type)
  - ["quickjs:encoding".TextDecoder (exported class)](#quickjsencodingtextdecoder-exported-class)
    - [TextDecoder (constructor)](#textdecoder-constructor)
    - [TextDecoder.prototype.encoding (TextEncoding property)](#textdecoderprototypeencoding-textencoding-property)
    - [TextDecoder.prototype.fatal (boolean property)](#textdecoderprototypefatal-boolean-property)
    - [TextDecoder.prototype.ignoreBOM (boolean property)](#textdecoderprototypeignorebom-boolean-property)
    - [TextDecoder.prototype.decode (method)](#textdecoderprototypedecode-method)

# "quickjs:encoding" (namespace)

```ts
declare module "quickjs:encoding" {
  export function toUtf8(input: ArrayBuffer): string;
  export function fromUtf8(input: string): ArrayBuffer;
  export class TextEncoder {
    constructor(label?: TextEncodingLabel);
    readonly encoding: TextEncoding;
    encode(
      input?: string,
      options?: {
        stream?: boolean;
      },
    ): Uint8Array;
    encodeInto(
      source: string,
      destination: Uint8Array,
    ): {
      read: number;
      written: number;
    };
  }
  type TextEncoding =
    | "utf-8"
    | "utf-16le"
    | "utf-16be"
    | "shift_jis"
    | "windows-1252"
    | "windows-1251"
    | "big5"
    | "euc-kr"
    | "euc-jp"
    | "gb18030";
  type TextEncodingLabel =
    | TextEncoding
    | "utf8"
    | "unicode-1-1-utf-8"
    | "utf-16"
    | "shift-jis"
    | "sjis"
    | "csshiftjis"
    | "ms932"
    | "ms_kanji"
    | "windows-31j"
    | "x-sjis"
    | "cp1252"
    | "iso-8859-1"
    | "iso8859-1"
    | "iso_8859-1"
    | "latin1"
    | "iso-8859-15"
    | "us-ascii"
    | "ascii"
    | "x-cp1252"
    | "cp1251"
    | "x-cp1251"
    | "big5-hkscs"
    | "cn-big5"
    | "csbig5"
    | "x-x-big5"
    | "cseuckr"
    | "korean"
    | "ks_c_5601-1987"
    | "iso-ir-149"
    | "csksc"
    | "cseucpkdfmtjapanese"
    | "x-euc-jp"
    | "gb2312"
    | "gbk"
    | "chinese"
    | "csgb2312"
    | "x-gbk"
    | "gb_2312-80"
    | "iso-ir-58";
  export class TextDecoder {
    constructor(
      label?: TextEncodingLabel,
      options?: {
        fatal?: boolean;
        ignoreBOM?: boolean;
      },
    );
    readonly encoding: TextEncoding;
    readonly fatal: boolean;
    readonly ignoreBOM: boolean;
    decode(
      input?: ArrayBuffer | ArrayBufferView,
      options?: {
        stream?: boolean;
      },
    ): string;
  }
}
```

## "quickjs:encoding".toUtf8 (exported function)

```ts
export function toUtf8(input: ArrayBuffer): string;
```

## "quickjs:encoding".fromUtf8 (exported function)

```ts
export function fromUtf8(input: string): ArrayBuffer;
```

## "quickjs:encoding".TextEncoder (exported class)

Encodes a string into bytes, following the WHATWG Encoding standard.
Supports UTF-8, UTF-16LE, UTF-16BE, Shift_JIS, Windows-1252, Windows-1251,
Big5, EUC-KR, EUC-JP, and GB18030 encodings.

```ts
class TextEncoder {
  constructor(label?: TextEncodingLabel);
  readonly encoding: TextEncoding;
  encode(
    input?: string,
    options?: {
      stream?: boolean;
    },
  ): Uint8Array;
  encodeInto(
    source: string,
    destination: Uint8Array,
  ): {
    read: number;
    written: number;
  };
}
```

### TextEncoder (constructor)

```ts
constructor(label?: TextEncodingLabel);
```

### TextEncoder.prototype.encoding (TextEncoding property)

```ts
readonly encoding: TextEncoding;
```

### TextEncoder.prototype.encode (method)

Encodes the input string into bytes.

- `@param` _input_ — The string to encode.
- `@param` _options_ — Options for encoding. The `stream` option (non-standard) can be used
  to preserve state for stateful encodings like UTF-16.

```ts
encode(input?: string, options?: {
  stream?: boolean;
}): Uint8Array;
```

### TextEncoder.prototype.encodeInto (method)

Encodes the source string into the destination Uint8Array.
Note: Unlike the standard TextEncoder, this supports all encodings (non-standard extension).

```ts
encodeInto(source: string, destination: Uint8Array): {
  read: number;
  written: number;
};
```

## "quickjs:encoding".TextEncoding (type)

The canonical encoding name returned by `.encoding` property

```ts
type TextEncoding =
  | "utf-8"
  | "utf-16le"
  | "utf-16be"
  | "shift_jis"
  | "windows-1252"
  | "windows-1251"
  | "big5"
  | "euc-kr"
  | "euc-jp"
  | "gb18030";
```

## "quickjs:encoding".TextEncodingLabel (type)

All encoding labels accepted by TextEncoder/TextDecoder constructor

```ts
type TextEncodingLabel =
  | TextEncoding
  | "utf8"
  | "unicode-1-1-utf-8"
  | "utf-16"
  | "shift-jis"
  | "sjis"
  | "csshiftjis"
  | "ms932"
  | "ms_kanji"
  | "windows-31j"
  | "x-sjis"
  | "cp1252"
  | "iso-8859-1"
  | "iso8859-1"
  | "iso_8859-1"
  | "latin1"
  | "iso-8859-15"
  | "us-ascii"
  | "ascii"
  | "x-cp1252"
  | "cp1251"
  | "x-cp1251"
  | "big5-hkscs"
  | "cn-big5"
  | "csbig5"
  | "x-x-big5"
  | "cseuckr"
  | "korean"
  | "ks_c_5601-1987"
  | "iso-ir-149"
  | "csksc"
  | "cseucpkdfmtjapanese"
  | "x-euc-jp"
  | "gb2312"
  | "gbk"
  | "chinese"
  | "csgb2312"
  | "x-gbk"
  | "gb_2312-80"
  | "iso-ir-58";
```

## "quickjs:encoding".TextDecoder (exported class)

Decodes bytes into a string, following the WHATWG Encoding standard.
Supports UTF-8, UTF-16LE, UTF-16BE, Shift_JIS, Windows-1252, Windows-1251,
Big5, EUC-KR, EUC-JP, and GB18030 encodings.

```ts
class TextDecoder {
  constructor(
    label?: TextEncodingLabel,
    options?: {
      fatal?: boolean;
      ignoreBOM?: boolean;
    },
  );
  readonly encoding: TextEncoding;
  readonly fatal: boolean;
  readonly ignoreBOM: boolean;
  decode(
    input?: ArrayBuffer | ArrayBufferView,
    options?: {
      stream?: boolean;
    },
  ): string;
}
```

### TextDecoder (constructor)

```ts
constructor(label?: TextEncodingLabel, options?: {
  fatal?: boolean;
  ignoreBOM?: boolean;
});
```

### TextDecoder.prototype.encoding (TextEncoding property)

```ts
readonly encoding: TextEncoding;
```

### TextDecoder.prototype.fatal (boolean property)

```ts
readonly fatal: boolean;
```

### TextDecoder.prototype.ignoreBOM (boolean property)

```ts
readonly ignoreBOM: boolean;
```

### TextDecoder.prototype.decode (method)

```ts
decode(input?: ArrayBuffer | ArrayBufferView, options?: {
  stream?: boolean;
}): string;
```
