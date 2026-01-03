- [yavascript (object)](#yavascript-object)
  - [yavascript.version (string property)](#yavascriptversion-string-property)
  - [yavascript.arch (property)](#yavascriptarch-property)
  - [yavascript.ecmaVersion (string property)](#yavascriptecmaversion-string-property)
  - [yavascript.compilers (object property)](#yavascriptcompilers-object-property)
    - [yavascript.compilers.js (method)](#yavascriptcompilersjs-method)
    - [yavascript.compilers.tsx (method)](#yavascriptcompilerstsx-method)
    - [yavascript.compilers.ts (method)](#yavascriptcompilersts-method)
    - [yavascript.compilers.jsx (method)](#yavascriptcompilersjsx-method)
    - [yavascript.compilers.coffee (method)](#yavascriptcompilerscoffee-method)
    - [yavascript.compilers.civet (method)](#yavascriptcompilerscivet-method)
    - [yavascript.compilers.autodetect (method)](#yavascriptcompilersautodetect-method)

# yavascript (object)

The `yavascript` global contains metadata about the currently-running
yavascript binary, as well as access to yavascript's compilers for
compile-to-js languages.

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

The processor architecture of the currently-running `yavascript` binary.

```ts
arch: "x86_64" | "arm64";
```

## yavascript.ecmaVersion (string property)

The version of the ecma262 standard supported by the currently-running
yavascript binary.

Currently, this is always "ES2020", but if future versions of yavascript
support a newer version of the standard, this will change. In that event,
this property will always be in the format of "ES" + a year, and will never
be lower than ES2020.

```ts
ecmaVersion: string;
```

## yavascript.compilers (object property)

The compilers yavascript uses internally to load files.

Each function returns a JavaScript source code string.

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

The function yavascript uses internally to load JavaScript files.

You might think this would be a no-op, but we do some CommonJS/ECMAScript
Module interop transformations here.

```ts
js(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.tsx (method)

The function yavascript uses internally to load [TypeScript JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) files.

yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load TypeScript JSX syntax. yavascript doesn't do typechecking of TypeScript syntax.

```ts
tsx(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.ts (method)

The function yavascript uses internally to load [TypeScript](https://www.typescriptlang.org/) files.

yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load TypeScript syntax. yavascript doesn't do typechecking of TypeScript syntax.

```ts
ts(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.jsx (method)

The function yavascript uses internally to load JSX files.

yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load JSX syntax.

See [JSX](/meta/generated-docs/jsx.md#jsx-namespace) for info about configuring JSX pragma, swapping out the
default `createElement` implementation, etc.

```ts
jsx(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.coffee (method)

The function yavascript uses internally to load [CoffeeScript](https://coffeescript.org/) files.

yavascript embeds CoffeeScript 2.7.0.

```ts
coffee(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.civet (method)

The function yavascript uses internally to load [Civet](https://civet.dev/) files.

yavascript embeds Civet 0.9.0.

```ts
civet(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```

### yavascript.compilers.autodetect (method)

The function yavascript uses internally to load files which don't have an
extension.

It tries to parse the file as each of the following languages, in order,
until it finds one which doesn't have a syntax error:

- JSX
- TSX
- Civet
- CoffeeScript

If none of the languages work, the file's original content gets used so
that a syntax error can be reported to the user.

```ts
autodetect(code: string, options?: {
  filename?: string;
  expression?: boolean;
}): string;
```
