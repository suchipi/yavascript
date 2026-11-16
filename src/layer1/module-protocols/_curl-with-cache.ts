import * as curl from "quickjs:curl";
import { getConfigDir } from "../config-dir";
import { exists, writeFile } from "../api/filesystem";
import { mkdir } from "../api/commands/mkdir";
import { logger } from "../api/logger";
import { readEnvBool } from "../api/env";

let didAttemptToGetCurlCacheFilePath = false;
let curlCacheFilePath: Path | null = null;

// note: doesn't support binary option, because underlying storage is JSON.
// but we've never used binary responses for modules anyway.
export function curlWithCache(url: string) {
  if (!readEnvBool("YAVASCRIPT_NO_CACHE", false)) {
    if (!didAttemptToGetCurlCacheFilePath && curlCacheFilePath == null) {
      try {
        const configDir = getConfigDir();
        curlCacheFilePath =
          configDir?.concat(["cache", "web-modules.json"]) ?? null;
      } finally {
        didAttemptToGetCurlCacheFilePath = true;
      }
    }

    if (curlCacheFilePath != null) {
      try {
        if (exists(curlCacheFilePath)) {
          const cacheDict = JSON.parse(readFile(curlCacheFilePath));
          if (cacheDict[url]) {
            logger.trace("curlWithCache cache hit:", url);
            return cacheDict[url];
          }
        }
      } catch (err) {
        logger.trace("curlWithCache cache read failed:", err);
      }
    }
  }

  const result = curl.urlGet(url, { full: true });

  if (!readEnvBool("YAVASCRIPT_NO_CACHE", false)) {
    if (result.status >= 200 && result.status <= 299) {
      try {
        if (curlCacheFilePath != null) {
          if (!exists(curlCacheFilePath.dirname())) {
            mkdir(curlCacheFilePath.dirname());
          }
          if (!exists(curlCacheFilePath)) {
            writeFile(curlCacheFilePath, "{}");
          }
          const cacheDict = JSON.parse(readFile(curlCacheFilePath));
          cacheDict[url] = result;
          writeFile(curlCacheFilePath, JSON.stringify(cacheDict));
        }
      } catch (err) {
        logger.trace("curlWithCache cache write failed:", err);
      }
    }
  }

  return result;
}
