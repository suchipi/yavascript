import compilers from "../../compilers";

// actual values for version, arch, and getTypesDts get filled in layers 2 and 4.
export const yavascript = {
  version: "",
  arch: "",
  ecmaVersion: "ES2023",
  compilers,
  getTypesDts() {
    throw new Error("Layer 1 stub");
  },
};
