import { version, arch } from "../../hardcoded";
import compilers from "../../compilers";
import { dtsText } from "../../targets/print-types";

export const yavascript = {
  version,
  arch,
  ecmaVersion: "ES2020",
  compilers,
  getTypesDts() {
    return dtsText;
  },
};
