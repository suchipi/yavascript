const EMPTY = Symbol("EMPTY");

export function memoize<T>(fn: () => T): () => T {
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
>(input: Input): { [k in keyof Input]: PropertyDescriptor } {
  const entries: Array<[string, PropertyDescriptor]> = [];

  for (const [key, getterFn] of Object.entries(input)) {
    entries.push([
      key,
      {
        get: memoize(getterFn),
        configurable: true,
        enumerable: true,
      },
    ]);
  }

  return Object.fromEntries(entries) as any;
}
