- ["quickjs:timers" (namespace)](#quickjstimers-namespace)
  - ["quickjs:timers".Timer (exported type)](#quickjstimerstimer-exported-type)
  - ["quickjs:timers".setTimeout (exported function)](#quickjstimerssettimeout-exported-function)
  - ["quickjs:timers".clearTimeout (exported function)](#quickjstimerscleartimeout-exported-function)
  - ["quickjs:timers".setInterval (exported function)](#quickjstimerssetinterval-exported-function)
  - ["quickjs:timers".clearInterval (exported function)](#quickjstimersclearinterval-exported-function)
- [Timer (type)](#timer-type)
- [setTimeout (value)](#settimeout-value)
- [clearTimeout (value)](#cleartimeout-value)
- [setInterval (value)](#setinterval-value)
- [clearInterval (value)](#clearinterval-value)

# "quickjs:timers" (namespace)

```ts
declare module "quickjs:timers" {
  export type Timer = {
    [Symbol.toStringTag]: "Timer";
  };
  export function setTimeout(func: (...args: any) => any, delay: number): Timer;
  export function clearTimeout(handle: Timer): void;
  export function setInterval(
    func: (...args: any) => any,
    delay: number,
  ): Timer;
  export function clearInterval(handle: Timer): void;
}
```

## "quickjs:timers".Timer (exported type)

```ts
type Timer = {
  [Symbol.toStringTag]: "Timer";
};
```

## "quickjs:timers".setTimeout (exported function)

Call the function func after delay ms. Return a handle to the timer.

```ts
export function setTimeout(func: (...args: any) => any, delay: number): Timer;
```

## "quickjs:timers".clearTimeout (exported function)

Cancel a timer.

```ts
export function clearTimeout(handle: Timer): void;
```

## "quickjs:timers".setInterval (exported function)

Call the function func repeatedly, with delay ms between each call. Return a handle to the timer.

```ts
export function setInterval(func: (...args: any) => any, delay: number): Timer;
```

## "quickjs:timers".clearInterval (exported function)

Cancel an interval timer.

```ts
export function clearInterval(handle: Timer): void;
```

# Timer (type)

An opaque timer handle returned by setTimeout/setInterval

```ts
declare type Timer = import("quickjs:timers").Timer;
```

# setTimeout (value)

Call the function func after delay ms. Return a handle to the timer.

```ts
var setTimeout: typeof import("quickjs:timers").setTimeout;
```

# clearTimeout (value)

Cancel a timer.

```ts
var clearTimeout: typeof import("quickjs:timers").clearTimeout;
```

# setInterval (value)

Call the function func repeatedly, with delay ms between each call. Return a handle to the timer.

```ts
var setInterval: typeof import("quickjs:timers").setInterval;
```

# clearInterval (value)

Cancel an interval timer.

```ts
var clearInterval: typeof import("quickjs:timers").clearInterval;
```
