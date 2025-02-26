- [grepString (function)](#grepstring-function)
  - [grepString(...) (call signature)](#grepstring-call-signature)
  - [grepString(...) (call signature)](#grepstring-call-signature-1)
  - [grepString(...) (call signature)](#grepstring-call-signature-2)
  - [grepString(...) (call signature)](#grepstring-call-signature-3)
  - [grepString(...) (call signature)](#grepstring-call-signature-4)
  - [grepString(...) (call signature)](#grepstring-call-signature-5)
  - [grepString(...) (call signature)](#grepstring-call-signature-6)
  - [grepString(...) (call signature)](#grepstring-call-signature-7)
  - [grepString(...) (call signature)](#grepstring-call-signature-8)
- [grepFile (function)](#grepfile-function)
  - [grepFile(...) (call signature)](#grepfile-call-signature)
  - [grepFile(...) (call signature)](#grepfile-call-signature-1)
  - [grepFile(...) (call signature)](#grepfile-call-signature-2)
  - [grepFile(...) (call signature)](#grepfile-call-signature-3)
  - [grepFile(...) (call signature)](#grepfile-call-signature-4)
  - [grepFile(...) (call signature)](#grepfile-call-signature-5)
  - [grepFile(...) (call signature)](#grepfile-call-signature-6)
  - [grepFile(...) (call signature)](#grepfile-call-signature-7)
  - [grepFile(...) (call signature)](#grepfile-call-signature-8)
- [String (interface)](#string-interface)
  - [String.grep (function property)](#stringgrep-function-property)
    - [String.grep(...) (call signature)](#stringgrep-call-signature)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-1)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-2)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-3)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-4)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-5)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-6)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-7)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-8)

# grepString (function)

Split `str` on newline and then return lines matching `pattern`.

```ts
const grepString: {
  (str: string, pattern: string | RegExp): Array<string>;
  (
    str: string,
    pattern: string | RegExp,
    options: {
      inverse: false;
    }
  ): Array<string>;
  (
    str: string,
    pattern: string | RegExp,
    options: {
      inverse: true;
    }
  ): Array<string>;
  (
    str: string,
    pattern: string | RegExp,
    options: {
      details: false;
    }
  ): Array<string>;
  (
    str: string,
    pattern: string | RegExp,
    options: {
      inverse: false;
      details: false;
    }
  ): Array<string>;
  (
    str: string,
    pattern: string | RegExp,
    options: {
      inverse: true;
      details: false;
    }
  ): Array<string>;
  (
    str: string,
    pattern: string | RegExp,
    options: {
      details: true;
    }
  ): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;
  (
    str: string,
    pattern: string | RegExp,
    options: {
      inverse: false;
      details: true;
    }
  ): Array<string>;
  (
    str: string,
    pattern: string | RegExp,
    options: {
      inverse: true;
      details: true;
    }
  ): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;
};
```

## grepString(...) (call signature)

Split `str` on newline and then return lines matching `pattern`.

```ts
(str: string, pattern: string | RegExp): Array<string>;
```

## grepString(...) (call signature)

Split `str` on newline and then return lines matching `pattern`.

```ts
(str: string, pattern: string | RegExp, options: {
  inverse: false;
}): Array<string>;
```

## grepString(...) (call signature)

Split `str` on newline and then return lines NOT matching `pattern`.

```ts
(str: string, pattern: string | RegExp, options: {
  inverse: true;
}): Array<string>;
```

## grepString(...) (call signature)

Split `str` on newline and then return lines matching `pattern`.

```ts
(str: string, pattern: string | RegExp, options: {
  details: false;
}): Array<string>;
```

## grepString(...) (call signature)

Split `str` on newline and then return lines matching `pattern`.

```ts
(str: string, pattern: string | RegExp, options: {
  inverse: false;
  details: false;
}): Array<string>;
```

## grepString(...) (call signature)

Split `str` on newline and then return lines NOT matching `pattern`.

```ts
(str: string, pattern: string | RegExp, options: {
  inverse: true;
  details: false;
}): Array<string>;
```

## grepString(...) (call signature)

Split `str` on newline and then return info about lines matching `pattern`.

```ts
(str: string, pattern: string | RegExp, options: {
  details: true;
}): Array<{
  lineNumber: number;
  lineContent: string;
  matches: RegExpMatchArray;
}>;
```

## grepString(...) (call signature)

Split `str` on newline and then return info about lines matching `pattern`.

```ts
(str: string, pattern: string | RegExp, options: {
  inverse: false;
  details: true;
}): Array<string>;
```

## grepString(...) (call signature)

Split `str` on newline and then return info about lines NOT matching `pattern`.

```ts
(str: string, pattern: string | RegExp, options: {
  inverse: true;
  details: true;
}): Array<{
  lineNumber: number;
  lineContent: string;
  matches: RegExpMatchArray;
}>;
```

# grepFile (function)

Read the content at `path`, split it on newline, and then return lines matching `pattern`.

```ts
const grepFile: {
  (path: string | Path, pattern: string | RegExp): Array<string>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options: {
      inverse: false;
    }
  ): Array<string>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options: {
      inverse: true;
    }
  ): Array<string>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options: {
      details: false;
    }
  ): Array<string>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options: {
      inverse: false;
      details: false;
    }
  ): Array<string>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options: {
      inverse: true;
      details: false;
    }
  ): Array<string>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options: {
      details: true;
    }
  ): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options: {
      inverse: false;
      details: true;
    }
  ): Array<string>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options: {
      inverse: true;
      details: true;
    }
  ): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;
};
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return lines matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp): Array<string>;
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return lines matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp, options: {
  inverse: false;
}): Array<string>;
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return lines NOT matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp, options: {
  inverse: true;
}): Array<string>;
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return lines matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp, options: {
  details: false;
}): Array<string>;
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return lines matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp, options: {
  inverse: false;
  details: false;
}): Array<string>;
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return lines NOT matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp, options: {
  inverse: true;
  details: false;
}): Array<string>;
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return info about lines matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp, options: {
  details: true;
}): Array<{
  lineNumber: number;
  lineContent: string;
  matches: RegExpMatchArray;
}>;
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return info about lines matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp, options: {
  inverse: false;
  details: true;
}): Array<string>;
```

## grepFile(...) (call signature)

Read the content at `path`, split it on newline, and then return info about lines NOT matching `pattern`.

```ts
(path: string | Path, pattern: string | RegExp, options: {
  inverse: true;
  details: true;
}): Array<{
  lineNumber: number;
  lineContent: string;
  matches: RegExpMatchArray;
}>;
```

# String (interface)

```ts
interface String {
  grep: {
    (pattern: string | RegExp): Array<string>;
    (
      pattern: string | RegExp,
      options: {
        inverse: false;
      }
    ): Array<string>;
    (
      pattern: string | RegExp,
      options: {
        inverse: true;
      }
    ): Array<string>;
    (
      pattern: string | RegExp,
      options: {
        details: false;
      }
    ): Array<string>;
    (
      pattern: string | RegExp,
      options: {
        inverse: false;
        details: false;
      }
    ): Array<string>;
    (
      pattern: string | RegExp,
      options: {
        inverse: true;
        details: false;
      }
    ): Array<string>;
    (
      pattern: string | RegExp,
      options: {
        details: true;
      }
    ): Array<{
      lineNumber: number;
      lineContent: string;
      matches: RegExpMatchArray;
    }>;
    (
      pattern: string | RegExp,
      options: {
        inverse: false;
        details: true;
      }
    ): Array<string>;
    (
      pattern: string | RegExp,
      options: {
        inverse: true;
        details: true;
      }
    ): Array<{
      lineNumber: number;
      lineContent: string;
      matches: RegExpMatchArray;
    }>;
  };
}
```

## String.grep (function property)

```ts
grep: {
  (pattern: string | RegExp): Array<string>;
  (pattern: string | RegExp, options: {
    inverse: false;
  }): Array<string>;
  (pattern: string | RegExp, options: {
    inverse: true;
  }): Array<string>;
  (pattern: string | RegExp, options: {
    details: false;
  }): Array<string>;
  (pattern: string | RegExp, options: {
    inverse: false;
    details: false;
  }): Array<string>;
  (pattern: string | RegExp, options: {
    inverse: true;
    details: false;
  }): Array<string>;
  (pattern: string | RegExp, options: {
    details: true;
  }): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;
  (pattern: string | RegExp, options: {
    inverse: false;
    details: true;
  }): Array<string>;
  (pattern: string | RegExp, options: {
    inverse: true;
    details: true;
  }): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;
};
```

### String.grep(...) (call signature)

Split the string on newline and then return lines matching `pattern`.

```ts
(pattern: string | RegExp): Array<string>;
```

### String.grep(...) (call signature)

Split the string on newline and then return lines matching `pattern`.

```ts
(pattern: string | RegExp, options: {
  inverse: false;
}): Array<string>;
```

### String.grep(...) (call signature)

Split the string on newline and then return lines NOT matching `pattern`.

```ts
(pattern: string | RegExp, options: {
  inverse: true;
}): Array<string>;
```

### String.grep(...) (call signature)

Split the string on newline and then return lines matching `pattern`.

```ts
(pattern: string | RegExp, options: {
  details: false;
}): Array<string>;
```

### String.grep(...) (call signature)

Split the string on newline and then return lines matching `pattern`.

```ts
(pattern: string | RegExp, options: {
  inverse: false;
  details: false;
}): Array<string>;
```

### String.grep(...) (call signature)

Split the string on newline and then return lines NOT matching `pattern`.

```ts
(pattern: string | RegExp, options: {
  inverse: true;
  details: false;
}): Array<string>;
```

### String.grep(...) (call signature)

Split the string on newline and then return info about lines matching `pattern`.

```ts
(pattern: string | RegExp, options: {
  details: true;
}): Array<{
  lineNumber: number;
  lineContent: string;
  matches: RegExpMatchArray;
}>;
```

### String.grep(...) (call signature)

Split the string on newline and then return info about lines matching `pattern`.

```ts
(pattern: string | RegExp, options: {
  inverse: false;
  details: true;
}): Array<string>;
```

### String.grep(...) (call signature)

Split the string on newline and then return info about lines NOT matching `pattern`.

```ts
(pattern: string | RegExp, options: {
  inverse: true;
  details: true;
}): Array<{
  lineNumber: number;
  lineContent: string;
  matches: RegExpMatchArray;
}>;
```
