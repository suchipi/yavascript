- [Interval (type)](#interval-type)
- [setInterval (function)](#setinterval-function)
- [clearInterval (function)](#clearinterval-function)

# Interval (type)

```ts
declare type Interval = {
  [Symbol.toStringTag]: "Interval";
};
```

# setInterval (function)

```ts
declare function setInterval(func: (...args: any) => any, ms: number): Interval;
```

# clearInterval (function)

```ts
declare function clearInterval(interval: Interval): void;
```
