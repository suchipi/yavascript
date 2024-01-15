import * as os from "quickjs:os";
import { Path } from "./api/path";
import { env } from "./api/env";

export const getConfigDir = (): Path | null => {
  const { HOME, APPDATA, XDG_CONFIG_HOME } = env;

  if (os.platform === "win32") {
    if (APPDATA) {
      return new Path(APPDATA, "yavascript");
    } else {
      return null;
    }
  } else if (os.platform === "darwin") {
    if (HOME) {
      return new Path(HOME, "Library", "Application Support", "yavascript");
    } else {
      return null;
    }
  }

  if (XDG_CONFIG_HOME) {
    return new Path(XDG_CONFIG_HOME, "yavascript");
  }

  if (HOME) {
    return new Path(HOME, ".config", "yavascript");
  } else {
    return null;
  }
};
