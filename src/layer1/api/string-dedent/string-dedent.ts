import dedent from "string-dedent";

export function install(stringConstructor: StringConstructor) {
  Object.defineProperty(stringConstructor, "dedent", {
    enumerable: false,
    writable: true,
    configurable: true,
    value: dedent,
  });
}
