import { evaluate, runYavascript } from "./test-helpers";

async function getPackagesInBinary() {
  // Funky way of getting a list of all the files that made it into the bundle
  const result = await evaluate(
    `
    const instanceKey = Object.keys(__kame_instances__)[0];
    const kameInstance = __kame_instances__[instanceKey];
    const files = Object.keys(kameInstance.modules);
    console.log(JSON.stringify(files, null, 2));
  `
  );
  const partialResult = {
    code: result.code,
    error: result.error,
    stderr: result.stderr,
  };
  expect(partialResult).toMatchObject({
    code: 0,
    error: false,
    stderr: "",
  });

  let files: Array<string>;
  try {
    files = JSON.parse(result.stdout);
  } catch (err: any) {
    // throw error which shows the output in the test runner output so you can
    // better understand what's wrong
    expect(result.stdout).toEqual("parseable json from stdout");
    throw new Error("unreachable");
  }

  const nodeModuleFiles = files.filter((file) => /node_modules/.test(file));

  const packages = new Set();
  for (const file of nodeModuleFiles) {
    const matches = file.match(/^node_modules\/((?:@[^/]+\/[^/]+)|[^/]+)/i);
    if (matches == null) {
      throw new Error(
        "Unhandled case in node_modules name grabber regexp: " + file
      );
    }
    const packageName = matches[1];
    packages.add(packageName);
  }

  return packages;
}

async function getLicenseTextFromBinary() {
  const result = await runYavascript(["--license"]);

  const partialResult = {
    code: result.code,
    error: result.error,
    stderr: result.stderr,
  };
  expect(partialResult).toMatchObject({
    code: 0,
    error: false,
    stderr: "",
  });

  return result.stdout;
}

test("bundled third-party code snapshot", async () => {
  const packages = await getPackagesInBinary();

  expect(Array.from(packages).sort()).toMatchInlineSnapshot(`
    [
      "@danielx/civet",
      "@iarna/toml",
      "@jridgewell/resolve-uri",
      "@jridgewell/set-array",
      "@jridgewell/sourcemap-codec",
      "@jridgewell/trace-mapping",
      "@swc/helpers",
      "a-mimir",
      "ansi-regex",
      "balanced-match",
      "brace-expansion",
      "clef-parse",
      "coffeescript",
      "kleur",
      "lines-and-columns",
      "minimatch",
      "nice-path",
      "papaparse",
      "pheno",
      "string-dedent",
      "strip-ansi",
      "sucrase",
      "yaml",
    ]
  `);
});

test("all third-party code in bundle has license attribution", async () => {
  const packages = await getPackagesInBinary();
  const licenseText = await getLicenseTextFromBinary();

  for (const pkg of packages) {
    expect(licenseText).toContain(pkg);
  }
});

test("license attribution doesn't include stuff that isn't in the bundle", async () => {
  const packages = await getPackagesInBinary();
  const licenseText = await getLicenseTextFromBinary();

  const licenseEntries = licenseText
    .split("\n")
    .filter((line) => line.startsWith("==="))
    .map((line) => {
      const matches = line.match(/^\=+ ([^\=]+) \=+/);
      if (!matches) {
        throw new Error("RegExp didn't handle line properly: " + line);
      }
      return matches[1];
    });

  // Things which are okay to have despite not having a corresponding file in the
  // bundle. Usually cause they come from QuickJS or etc
  const exceptions = new Set([
    "cutils",
    "libbf",
    "libregexp",
    "libunicode",
    "list",
    "qjsc",
    "quickjs (suchipi fork)",
    "quickjs-libc (suchipi fork)",
    "qjsbootstrap",
    "quickjs repl",
    "@suchipi/print", // included within quickjs
    "yavascript", // we put its license at the end but it isn't a dep of itself
  ]);

  for (let entry of licenseEntries) {
    if (entry === "yaml (npm package)") {
      entry = "yaml";
    }

    if (exceptions.has(entry)) {
      continue;
    }
    expect(packages).toContain(entry);
  }
});
