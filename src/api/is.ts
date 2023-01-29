import * as std from "quickjs:std";
import { is as baseIs } from "@suchipi/is";
import { JSX } from "./jsx";
import { Path } from "./path";

export const is = {
  ...baseIs,
  FILE(value: any) {
    return std.isFILE(value);
  },
  Module(value: any) {
    return value instanceof Module;
  },
  Path(value: any) {
    return value instanceof Path;
  },
  JSX: {
    Element(value: any) {
      return is.object(value) && value.$$typeof === JSX.Element;
    },
    Fragment(value: any) {
      return is.JSX.Element(value) && value.type === JSX.Fragment;
    },
  },
};
