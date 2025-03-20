import dedent from "string-dedent";

export function install(stringConstructor: StringConstructor) {
  // @ts-ignore
  stringConstructor.dedent = dedent;
}
