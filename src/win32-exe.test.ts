import { cleanResult, rootDir } from "./test-helpers";
import { spawn } from "first-base";

// skipping this for now until I can get a reliable wine-in-docker working
test.skip("win32 exe smoke test (via docker)", async () => {
  const hasDocker = await getHasDocker();
  if (!hasDocker) {
    throw new Error("You must install docker to run this test.");
  }

  const run = spawn("docker", [
    `run`,
    `--rm`,
    `-v`,
    rootDir() + ":" + rootDir(),
    `-w`,
    rootDir(),
    `--platform`,
    `linux/amd64`,
    `suchipi/yavascript-wine-test-image`,
    `wine`,
    `bin/x86_64-pc-windows-static/yavascript.exe`,
    `-e`,
    `echo('hi');`,
  ]);
  await run.completion;

  let result = { ...run.result };
  if (result.code === 0) {
    // wine prints a bunch of noise into stderr
    result.stderr = "";
  }

  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "<3>WSL (1) ERROR: ConfigInitializeEntry:1554: Failed to mount (null) at /dev as devtmpfs 1
    ",
      "stdout": "",
    }
  `);
});

async function getHasDocker() {
  const run = spawn("which", ["docker"]);
  await run.completion;
  if (run.result.code === 0) {
    return true;
  } else {
    return false;
  }
}
