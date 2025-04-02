- [WhoAmIResult (interface)](#whoamiresult-interface)
  - [WhoAmIResult.name (string property)](#whoamiresultname-string-property)
  - [WhoAmIResult.uid (number property)](#whoamiresultuid-number-property)
  - [WhoAmIResult.gid (number property)](#whoamiresultgid-number-property)
- [whoami (function)](#whoami-function)

# WhoAmIResult (interface)

The type of the return value of [whoami](/meta/generated-docs/whoami.md#whoami-function).

```ts
declare interface WhoAmIResult {
  name: string;
  uid: number;
  gid: number;
}
```

## WhoAmIResult.name (string property)

```ts
name: string;
```

## WhoAmIResult.uid (number property)

```ts
uid: number;
```

## WhoAmIResult.gid (number property)

```ts
gid: number;
```

# whoami (function)

Get info about the user the yavascript process is executing as.

Provides functionality similar to the unix binaries `whoami` and `id`.

NOTE: Doesn't work on Windows; throws an error.

```ts
declare function whoami(): WhoAmIResult;
```
