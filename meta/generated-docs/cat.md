- [cat (function)](#cat-function)
  - [cat(...) (call signature)](#cat-call-signature)
  - [cat(...) (call signature)](#cat-call-signature-1)
  - [cat(...) (call signature)](#cat-call-signature-2)
  - [cat(...) (call signature)](#cat-call-signature-3)

# cat (function)

Reads the contents of one or more files from disk as either one UTF-8 string
or one ArrayBuffer.

Provides the same functionality as the unix binary of the same name.

> Example: If you have a file called `hi.txt` in the current working
> directory, and it contains the text "hello", running `cat("hi.txt")`
> returns `"hello"`.

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
