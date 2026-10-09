- [WhoAmIResult (interface)](#whoamiresult-interface)
  - [WhoAmIResult.name (string property)](#whoamiresultname-string-property)
  - [WhoAmIResult.uid (number property)](#whoamiresultuid-number-property)
  - [WhoAmIResult.gid (number property)](#whoamiresultgid-number-property)
- [whoami (function)](#whoami-function)

# WhoAmIResult (interface)

The type of the return value of [whoami](/meta/generated-docs/whoami.md#whoami-function).

**Example**

```ts
const user: WhoAmIResult = whoami();
console.log(user.name, user.uid, user.gid);
```

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

**Example**

```ts
const { name } = whoami();
console.log(`Running as ${name}`);
```

```ts
declare function whoami(): WhoAmIResult;
```
