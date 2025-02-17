# cat (function)

Reads the contents of one or more files from disk as either one UTF-8 string
or one ArrayBuffer.

```ts
const cat: {
  (paths: string | Path | Array<string | Path>): string;
  (paths: string | Path | Array<string | Path>, options: {}): string;
  (
    paths: string | Path | Array<string | Path>,
    options: {
      binary: false;
    },
  ): string;
  (
    paths: string | Path | Array<string | Path>,
    options: {
      binary: true;
    },
  ): ArrayBuffer;
};
```

## cat(...) (call signature)

Read the contents of one or more files from disk, as one UTF-8 string.

```ts
(paths: string | Path | Array<string | Path>): string;
```

## cat(...) (call signature)

Read the contents of one or more files from disk, as one UTF-8 string.

```ts
(paths: string | Path | Array<string | Path>, options: {}): string;
```

## cat(...) (call signature)

Read the contents of one or more files from disk, as one UTF-8 string.

```ts
(paths: string | Path | Array<string | Path>, options: {
  binary: false;
}): string;
```

## cat(...) (call signature)

Read the contents of one or more files from disk, as one ArrayBuffer.

```ts
(paths: string | Path | Array<string | Path>, options: {
  binary: true;
}): ArrayBuffer;
```
