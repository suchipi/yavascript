- [ModuleDelegate (interface)](#moduledelegate-interface)
  - [ModuleDelegate.searchExtensions (property)](#moduledelegatesearchextensions-property)
  - [ModuleDelegate.compilers (object property)](#moduledelegatecompilers-object-property)
  - [ModuleDelegate.builtinModuleNames (property)](#moduledelegatebuiltinmodulenames-property)
  - [ModuleDelegate.resolve (method)](#moduledelegateresolve-method)
  - [ModuleDelegate.read (method)](#moduledelegateread-method)
- [RequireFunction (interface)](#requirefunction-interface)
  - [RequireFunction(...) (call signature)](#requirefunction-call-signature)
  - [RequireFunction.resolve (function property)](#requirefunctionresolve-function-property)
- [require (RequireFunction)](#require-requirefunction)
- [ImportMeta (interface)](#importmeta-interface)
  - [ImportMeta.url (string property)](#importmetaurl-string-property)
  - [ImportMeta.main (boolean property)](#importmetamain-boolean-property)
  - [ImportMeta.require (RequireFunction property)](#importmetarequire-requirefunction-property)
  - [ImportMeta.resolve (`RequireFunction["resolve"]` property)](#importmetaresolve-requirefunctionresolve-property)

# ModuleDelegate (interface)

An object which lets you configure the module loader (import/export/require).
You can change these properties to add support for importing new filetypes.

```ts
interface ModuleDelegate {
  searchExtensions: Array<string>;
  compilers: {
    [extensionWithDot: string]: (filename: string, content: string) => string;
  };
  builtinModuleNames: Array<string>;
  resolve(name: string, fromFile: string): string;
  read(modulePath: string): string;
}
```

## ModuleDelegate.searchExtensions (property)

A list of filetype extensions that may be omitted from an import specifier
string.

Defaults to `[".js"]`. You can add more strings to this array to
make the engine search for additional files when resolving a
require/import.

See the doc comment on [require](/meta/generated-docs/modulesys.md#requirefunction-call-signature) for more information.

NOTE: If you add a new extension to this array, you will likely also want
to add to [compilers](/meta/generated-docs/modulesys.md#moduledelegatecompilers-object-property).

```ts
searchExtensions: Array<string>;
```

## ModuleDelegate.compilers (object property)

User-defined functions which will handle getting the JavaScript code
associated with a module.

The key for each property in this object should be a file extension
string with a leading dot, eg `".jsx"`. The value for each property should
be a function which receives (1) the filepath to a module, and (2) that
file's content as a UTF-8 string, and the function should return a string
containing JavaScript code that corresponds to that module. In most cases,
these functions will compile the contents of the file from one format into JavaScript.

The function does not have to use the second 'content' argument it
receives (ie. when loading binary files).

By adding to this object, you can make it possible to import non-js
filetypes; compile-to-JS languages like JSX, TypeScript, and CoffeeScript
can be compiled at import time, and asset files like .txt files or .png
files can be converted into an appropriate data structure at import time.

As an example, to make it possible to import .txt files, you might do:

```js
import * as std from "std";

ModuleDelegate.compilers[".txt"] = (filename, content) => {
  return `export default ${JSON.stringify(content)}`;
};
```

(leveraging `JSON.stringify`'s ability to escape quotes).

Then, later in your code, you can do:

```js
import names from "./names.txt";
```

And `names` will be a string containing the contents of names.txt.

NOTE: When adding to this object, you may also wish to add to
[searchExtensions](/meta/generated-docs/modulesys.md#moduledelegatesearchextensions-property).

```ts
compilers: {
  [extensionWithDot: string]: (filename: string, content: string) => string;
};
```

## ModuleDelegate.builtinModuleNames (property)

An Array containing the names of all the built-in modules, such as
"quickjs:std", "quickjs:bytecode", etc.

`quickjs:engine`'s `defineBuiltinModule` function adds to the end of this
array.

```ts
builtinModuleNames: Array<string>;
```

## ModuleDelegate.resolve (method)

Resolves a require/import request from `fromFile` into a canonicalized
path.

To change native module resolution behavior, replace this function with
your own implementation. Note that you must handle
`ModuleDelegate.searchExtensions` yourself in your replacement
implementation.

```ts
resolve(name: string, fromFile: string): string;
```

## ModuleDelegate.read (method)

Reads the contents of the given resolved module name into a string.

To change native module loading behavior, replace this function with your
own implementation. Note that you must handle `ModuleDelegate.compilers`
yourself in your replacement implementation.

```ts
read(modulePath: string): string;
```

# RequireFunction (interface)

```ts
interface RequireFunction {
  (source: string): any;
  resolve: (source: string) => string;
}
```

## RequireFunction(...) (call signature)

Synchronously import a module.

`source` will be resolved relative to the calling file.

If `source` does not have a file extension, and a file without an extension
cannot be found, the engine will check for files with the extensions in
[ModuleDelegate.searchExtensions](/meta/generated-docs/modulesys.md#moduledelegatesearchextensions-property), and use one of those if present.
This behavior also happens when using normal `import` statements.

For example, if you write:

```js
import something from "./somewhere";
```

but there's no file named `somewhere` in the same directory as the file
where that import appears, and `ModuleDelegate.searchExtensions` is the
default value:

```js
[".js"];
```

then the engine will look for `somewhere.js`. If that doesn't exist, the
engine will look for `somewhere/index.js`. If _that_ doesn't exist, an
error will be thrown.

If you add more extensions to `ModuleDelegate.searchExtensions`, then the
engine will use those, too. It will search in the same order as the strings
appear in the `ModuleDelegate.searchExtensions` array.

```ts
(source: string): any;
```

## RequireFunction.resolve (function property)

Resolves the normalized path to a modules, relative to the calling file.

```ts
resolve: (source: string) => string;
```

# require (RequireFunction)

```ts
var require: RequireFunction;
```

# ImportMeta (interface)

```ts
interface ImportMeta {
  url: string;
  main: boolean;
  require: RequireFunction;
  resolve: RequireFunction["resolve"];
}
```

## ImportMeta.url (string property)

A URL representing the current module.

Usually starts with `file://`.

```ts
url: string;
```

## ImportMeta.main (boolean property)

Whether the current module is the "main" module, meaning that it is the
entrypoint file that's been loaded, or, in other terms, the first
user-authored module that's been loaded.

```ts
main: boolean;
```

## ImportMeta.require (RequireFunction property)

Equivalent to `globalThis.require`. Provided for compatibility with tools
that can leverage a CommonJS require function via `import.meta.require`.

```ts
require: RequireFunction;
```

## ImportMeta.resolve (`RequireFunction["resolve"]` property)

Resolves a module specifier based on the current module's path.

Equivalent to `globalThis.require.resolve`.

Behaves similarly to [the browser
import.meta.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve),
but it does not ensure that the returned string is a valid URL, because it
delegates directly to [ModuleDelegate.resolve](/meta/generated-docs/modulesys.md#moduledelegateresolve-method) to resolve the name.
If you want this to return URL strings, change `ModuleDelegate.resolve` and
`ModuleDelegate.read` to work with URL strings.

```ts
resolve: RequireFunction["resolve"];
```
