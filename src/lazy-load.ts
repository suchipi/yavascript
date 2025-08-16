const EMPTY = Symbol("EMPTY");

export function memoize<T>(fn: () => T): { get(): T; set(val: T): void } {
  let _value: T | typeof EMPTY = EMPTY;

  return {
    get() {
      if (_value === EMPTY) {
        _value = fn();
      }

      return _value;
    },
    set(newVal) {
      _value = newVal;
    },
  };
}

export function memoizeFn<T>(fn: () => T): () => T {
  let _value: T | typeof EMPTY = EMPTY;

  return () => {
    if (_value === EMPTY) {
      _value = fn();
    }

    return _value;
  };
}

export function makeGetterPropertyDescriptorMap<
  Input extends { [key: string]: () => any }
>(
  input: Input,
  enumerable: boolean = true
): { [k in keyof Input]: PropertyDescriptor } {
  const entries: Array<[string, PropertyDescriptor]> = [];

  for (const [key, getterFn] of Object.entries(input)) {
    const { get, set } = memoize(getterFn);
    entries.push([
      key,
      {
        get,
        set,
        configurable: true,
        enumerable: enumerable,
      },
    ]);
  }

  return Object.fromEntries(entries) as any;
}
