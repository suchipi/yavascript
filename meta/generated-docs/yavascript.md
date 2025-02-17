# yavascript (object)

Info about the currently-running yavascript binary

```ts
const yavascript: {
  version: string;
  arch: "x86_64" | "arm64";
  ecmaVersion: string;
  compilers: {
    js(
      code: string,
      options?: {
        filename?: string;
        expression?: boolean;
      },
    ): string;
    tsx(
      code: string,
      options?: {
        filename?: string;
        expression?: boolean;
      },
    ): string;
    ts(
      code: string,
      options?: {
        filename?: string;
        expression?: boolean;
      },
    ): string;
    jsx(
      code: string,
      options?: {
        filename?: string;
        expression?: boolean;
      },
    ): string;
    coffee(
      code: string,
      options?: {
        filename?: string;
        expression?: boolean;
      },
    ): string;
    civet(
      code: string,
      options?: {
        filename?: string;
        expression?: boolean;
      },
    ): string;
    autodetect(
      code: string,
      options?: {
        filename?: string;
        expression?: boolean;
      },
    ): string;
  };
};
```

## yavascript.version (string property)

The version of the currently-running yavascript binary.

Will be something formatted like one of these:

- "v0.0.7"
- "v0.1.3-alpha"
- "git-286a3a336849"
- "git-286a3a336849-dirty"

Or, more formally: either a "V" version string or a "GIT" version string:

- "V" version strings start with the character 'v', followed by a semver
  version string, optionally followed by the character '-' and any
  arbitrary content afterwards.
- "GIT" version strings start with the prefix "git-", followed by the
  first 12 digits of a git commit SHA, optionally followed by the
  character '-' and any arbitrary content afterwards.

```ts
version: string;
```

## yavascript.arch (property)

The processor architecture we're running on.

```ts
arch: "x86_64" | "arm64";
```

## yavascript.ecmaVersion (string property)

The version of the ecma262 standard supported by the currently-running yavascript binary.

Will always be in the format "ES" + a year. Is never lower than ES2020.

```ts
ecmaVersion: string;
```

## yavascript.compilers (object property)

The compilers yavascript uses internally to load files.

```ts
compilers: {
  js(code: string, options?: {
    filename?: string;
    expression?: boolean;
  }): string;
  tsx(code: string, options?: {
    filename?: string;
    expression?: boolean;
  }): string;
  ts(code: string, options?: {
    filename?: string;
    expression?: boolean;
  }): string;
  jsx(code: string, options?: {
    filename?: string;
    expression?: boolean;
  }): string;
  coffee(code: string, options?: {
    filename?: string;
    expression?: boolean;
  }): string;
  civet(code: string, options?: {
    filename?: string;
    expression?: boolean;
  }): string;
  autodetect(code: string, options?: {
    filename?: string;
    expression?: boolean;
  }): string;
};
```

### yavascript.compilers.js (method)

```ts
js(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.tsx (method)

```ts
tsx(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.ts (method)

```ts
ts(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.jsx (method)

```ts
jsx(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.coffee (method)

```ts
coffee(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.civet (method)

```ts
civet(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.autodetect (method)

```ts
autodetect(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```
