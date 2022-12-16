import * as os from "os";
import { env } from "./env";

export const process = {
  get env() {
    return env;
  },
  get argv() {
    return scriptArgs;
  },
  get argv0() {
    return scriptArgs[0];
  },
  get execPath() {
    return os.readlink(os.execPath());
  },
};
