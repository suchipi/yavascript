export function install(stringConstructor: StringConstructor) {
  stringConstructor.dedent = require("string-dedent");
}
