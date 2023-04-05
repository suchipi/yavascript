import * as os from "quickjs:os";
import { Path } from "./api/path";
import { env } from "./api/env";

export const getConfigDir = (): string | null => {
  const { HOME, APPDATA, XDG_CONFIG_HOME } = env;

  if (os.platform === "win32") {
    if (APPDATA) {
      return Path.join(APPDATA, "yavascript");
    } else {
      return null;
    }
  } else if (os.platform === "darwin") {
    if (HOME) {
      return Path.join(HOME, "Library", "Application Support", "yavascript");
    } else {
      return null;
    }
  }

  if (XDG_CONFIG_HOME) {
    return Path.join(XDG_CONFIG_HOME, "yavascript");
  }

  if (HOME) {
    return Path.join(HOME, ".config", "yavascript");
  } else {
    return null;
  }
};
