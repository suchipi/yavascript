- [mkdirp (function)](#mkdirp-function)

# mkdirp (function)

Create a directory (folder) and all parents, recursively

Alias for `mkdir(path, { recursive: true })`.

Provides the same functionality as `mkdir -p`.

```ts
declare function mkdirp(
  path: string | Path,
  options?: {
    mode?: number;
    logging?: {
      trace?: (...args: Array<any>) => void;
      info?: (...args: Array<any>) => void;
    };
  },
): void;
```
