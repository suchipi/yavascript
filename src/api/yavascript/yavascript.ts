import compilers from "../../compilers";
import { getDtsText } from "../../targets/print-types";

// actual values for version, arch, and getTypesDts get filled in in
// src/primordials-hardcoded.ts
export const yavascript = {
  version: "",
  arch: "",
  ecmaVersion: "ES2023",
  compilers,
  getTypesDts() {
    return getDtsText();
  },
};
