import { expect, test } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "first-base";
import { runYavascript, rootDir, binaryPath } from "./test-helpers";

const workerFixturesDir = rootDir.concat("meta/tests/fixtures/worker");

test("worker cannot call std.exit", async () => {
  const result = await runYavascript([workerFixturesDir("main.js")]);

  // Note that the Error in the worker doesn't cause the main thread to exit
  // with a nonzero status code.
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "Error: cmdline.exit can only be called from the main thread
       at somewhere

   ",
     "stdout": "in main
   in main, sending try-to-exit
   in worker, received: {
   	data: "try-to-exit"
   }
   ",
   }
  `);
});

test("yavascript globals (including Worker) are available in workers", async () => {
  const result = await runYavascript([workerFixturesDir("globals-main.js")]);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
   	echo: "function"
   	cat: "function"
   	ls: "function"
   	cd: "function"
   	exec: "function"
   	glob: "function"
   	readFile: "function"
   	Path: "function"
   	yavascript: "object"
   	Worker: "function"
   }
   ",
   }
  `);
});

test("messages can be passed between the main thread and a worker via Worker.parent", async () => {
  const result = await runYavascript([workerFixturesDir("parent-main.js")]);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "main received: worker received: hello from main
   ",
   }
  `);
});

test("initialData is available to workers", async () => {
  const result = await runYavascript([
    workerFixturesDir("initial-data-main.js"),
  ]);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
   	initialData: {
   		greeting: "hello"
   		count: 3
   		nested: {
   			ok: true
   		}
   	}
   }
   ",
   }
  `);
});

test("the overrideCode option overrides the worker's module code", async () => {
  const result = await runYavascript([workerFixturesDir("override-main.js")]);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "override code ran; typeof echo is function
   ",
   }
  `);
});

// `yavascript-bootstrap` is `qjsbootstrap` with yavascript's primordials added
// on; you make a standalone program by appending JS source to a copy of the
// binary. This verifies that the Worker global works in such programs.
const bootstrapBinaryPath = String(binaryPath).replace(
  /yavascript(\.exe)?$/,
  "yavascript-bootstrap$1",
);

async function runBootstrapProgram(programCode: string) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ys-bootstrap-"));
  const programPath = path.join(
    tmpDir,
    process.platform === "win32" ? "program.exe" : "program",
  );
  try {
    const bootstrapBinary = fs.readFileSync(bootstrapBinaryPath);
    fs.writeFileSync(
      programPath,
      Buffer.concat([bootstrapBinary, Buffer.from("\n" + programCode + "\n")]),
    );
    fs.chmodSync(programPath, 0o755);

    const runContext = spawn(programPath, [], { cwd: rootDir() });
    await runContext.completion;
    return runContext.cleanResult();
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

test("Worker works in programs made with yavascript-bootstrap", async () => {
  const workerModulePath = String(workerFixturesDir("bootstrap-worker.js"));
  const result = await runBootstrapProgram(`
    const worker = new Worker(${JSON.stringify(workerModulePath)}, {
      initialData: { fromMain: true },
    });
    worker.onmessage = (event) => {
      console.log(inspect(event.data));
      worker.terminate();
    };
  `);

  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
   	hasEcho: true
   	hasYavascript: true
   	hasWorker: true
   	initialData: {
   		fromMain: true
   	}
   }
   ",
   }
  `);
});
