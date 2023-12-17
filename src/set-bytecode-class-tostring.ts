export function setBytecodeClassToString(klass: { new (...args: any): any }) {
  // .toString() needs to return a value starting with "class" for pheno.coerce to
  // see a function as a class, and therefore coerce it into the type
  // "instanceOf(Whatever)" when it appears in a function that accepts a type
  // validator (ie. `is` or `assert.type`).
  //
  // Normally, `Whatever.toString()` would already start with "class", because we
  // defined it using class syntax. But, as part of compiling yavascript, the
  // source code is converted to QuickJS bytecode, and that bytecode
  // representation does not preserve Function bodies, so `Whatever.toString()`
  // changes. It instead returns "function Whatever() {\n    [native code]\n}".
  //
  // Explicitly overriding it like this ensures that it has the correct value even
  // after bytecode conversion.
  const toStringValue = `class ${klass.name} {\n    [native code]\n}`;
  Object.defineProperty(klass, "toString", {
    value: () => toStringValue,
  });
}
