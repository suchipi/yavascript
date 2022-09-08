import * as std from "std";
import { is as baseIs } from "@suchipi/is";

export const is = {
  ...baseIs,
  FILE(value: any) {
    return std.isFILE(value);
  },
};
