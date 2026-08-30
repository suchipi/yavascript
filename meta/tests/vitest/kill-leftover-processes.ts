import { afterEach } from "vitest";
import { allInflightRunContexts } from "first-base";

afterEach(() => {
  for (const runContext of allInflightRunContexts) {
    runContext.kill("SIGKILL");
  }
});
