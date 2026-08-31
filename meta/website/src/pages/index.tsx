import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";
import ApiCodeBlock, {
  type ApiDocLinks,
} from "@site/src/components/ApiCodeBlock";

import styles from "./index.module.css";

const API_DOCS_URL = "/docs/";
const RELEASES_URL = "https://github.com/suchipi/yavascript/releases";

const EXAMPLE_SCRIPT = `#!/usr/bin/env yavascript

// Searches upwards from this file to find the root of the Git repository
const repoRoot = GitRepo.findRoot(__filename);

cd(repoRoot);

// Check if there are changes to the repo
const diffResult = exec("git diff --quiet", { failOnNonZeroStatus: false });
const isWorkingTreeDirty = diffResult.status !== 0;

// If there are, check whether .js files in lib/ have a matching .d.ts file. This is a contrived hypothetical thing you might run in CI.
if (isWorkingTreeDirty) {
  const jsFiles = glob("lib/**/*.js");
  for (const filePath of jsFiles) {
    // filePath is an instance of the Path class: https://yavascript.suchipi.com/docs/path#path-class
    const dtsFilePath = filePath.replaceLast(
      filePath.basename().replace(/\\.js$/, ".d.ts"),
    );
    if (!exists(dtsFilePath)) {
      const displayPath = quote(dtsFilePath.relativeTo(repoRoot));
      let message = \`Expected \${displayPath} to exist, but it didn't. Please add .d.ts files for all .js files under 'lib/'.\`;

      // ANSI escape sequence helpers
      message = bold(yellow(message));

      // Writes to stderr
      console.error(message);
    }
  }
}

// Prepare some info for a deployment automation tool...
const branchName = $(\`git rev-parse --abbrev-ref HEAD\`).stdout.trim();
const gitInfo = { branchName, isWorkingTreeDirty };

// \`echo\` and \`print\` are aliases for \`console.log\`, for discoverability.
echo(gitInfo);

// YAML.stringify works like JSON.stringify. We also have CSV and TOML!
writeFile("git-info.yml", YAML.stringify(gitInfo));

// Need something lower-level? Use builtin POSIX APIs from QuickJS.
import * as std from "quickjs:std";
import * as os from "quickjs:os";

console.log(\`Finished at \${std.strftime(64, "%Y-%m-%dT%H:%M:%S", Date.now())}\`);
console.log(os.lstat(".gitignore").size);
console.log("Is tty?", os.isatty(std.in));
`;

const EXAMPLE_SCRIPT_DOC_LINKS: ApiDocLinks = {
  identifiers: {
    GitRepo: "/docs/git-repo#gitrepo-class",
    __filename: "/docs/__filename-and-__dirname#__filename-string",
    cd: "/docs/cd#cd-function",
    exec: "/docs/exec#exec-exec",
    failOnNonZeroStatus:
      "/docs/exec#baseexecoptionsfailonnonzerostatus-boolean-property",
    glob: "/docs/glob#glob-function",
    exists: "/docs/filesystem#exists-function",
    quote: "/docs/strings#quote-function",
    bold: "/docs/strings#bold-function",
    yellow: "/docs/strings#yellow-function",
    console: "/docs/console#console-console",
    $: "/docs/exec#-function",
    echo: "/docs/echo#echo-value",
    writeFile: "/docs/filesystem#writefile-function",
    YAML: "/docs/yaml#yaml-object",
    std: "/docs/std#quickjsstd-namespace",
    os: "/docs/os#quickjsos-namespace",
    '"quickjs:std"': "/docs/std#quickjsstd-namespace",
    '"quickjs:os"': "/docs/os#quickjsos-namespace",
  },
  members: {
    "GitRepo.findRoot": "/docs/git-repo#gitrepofindroot-static-method",
    "filePath.replaceLast": "/docs/path#pathprototypereplacelast-method",
    "filePath.basename": "/docs/path#pathprototypebasename-method",
    "dtsFilePath.relativeTo": "/docs/path#pathprototyperelativeto-method",
    "console.error": "/docs/console#consoleerror-method",
    "console.log": "/docs/console#consolelog-method",
    "YAML.stringify": "/docs/yaml#yamlstringify-method",
    "std.strftime": "/docs/std#quickjsstdstrftime-exported-function",
    "std.in": "/docs/std#quickjsstdin-exported-file",
    "os.lstat": "/docs/os#quickjsoslstat-exported-function",
    "os.isatty": "/docs/os#quickjsosisatty-exported-function",
  },
};

const BASH_LIKE_APIS = [
  "Running programs",
  "Using environment variables",
  "Working with files/folders",
  "Resolving globs into lists of paths",
  "Printing stylized text",
];

const HARDER_IN_BASH_APIS = [
  "(De)serialize JSON, CSV, YAML, and TOML",
  "Parse command-line flags into a structured object",
  "Safely manipulate and resolve path strings",
  "Work with raw byte buffers (typed arrays)",
  "Reliably get the path to the currently-running script",
  "Typed interfaces and functions (via TypeScript)",
  "Cross-file import/export using ECMAScript Modules",
  "Call low-level POSIX C APIs like fputs, sprintf, isatty",
];

const LANGUAGES = [
  { name: "JavaScript", href: "https://en.wikipedia.org/wiki/JavaScript" },
  { name: "TypeScript", href: "https://www.typescriptlang.org/" },
  {
    name: "JSX/TSX",
    href: "https://react.dev/learn/writing-markup-with-jsx",
  },
  { name: "CoffeeScript", href: "https://coffeescript.org/" },
  { name: "Civet", href: "https://civet.dev/" },
];

const PLATFORMS = [
  {
    name: "macOS (10.16 or higher)",
    variants: ["Intel Processors (x86_64)", "Apple Silicon (aarch64)"],
  },
  {
    name: "Linux",
    variants: [
      "aarch64 (gnu, musl, or static)",
      "x86_64 (gnu, musl, or static)",
    ],
  },
  { name: "Windows (MinGW)", variants: ["x86_64"] },
  { name: "FreeBSD", variants: ["aarch64", "x86_64"] },
];

function Hero() {
  return (
    <header className={styles.hero}>
      <div className="container">
        <img
          className={styles.heroLogo}
          src={useBaseUrl("img/logo.png")}
          alt="YavaScript logo"
        />
        <p className={styles.heroTagline}>
          YavaScript is a cross-platform bash-like script runner and repl which
          is distributed as a single statically-linked program, weighing in at
          about 5MB. Scripts can be written in JavaScript or JS-related
          languages.
        </p>
        <blockquote className={styles.heroNote}>
          YavaScript is the name of the program. YavaScript is not a new
          language. YavaScript uses normal JavaScript.
        </blockquote>
        <div className={styles.heroButtons}>
          <Link className="button button--primary button--lg" to={API_DOCS_URL}>
            API Documentation
          </Link>
          <Link
            className="button button--secondary button--lg"
            href={RELEASES_URL}
          >
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}

function Why() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2">Why?</Heading>
        <p>
          YavaScript exists as an alternative to bash scripts. Instead of
          writing scripts using shell syntax and running them with bash, you
          write them in JavaScript and run them with YavaScript.
        </p>
        <p>
          At only ~5MB and with no dependencies (not even Node.js), YavaScript
          is easy to install or include in a Docker image. As such, it's
          suitable for use in all the places you would use shell scripts now.
          It's a great fit for those sort of "environment-level infrastructure"
          scripts that every Git repo ends up needing, like "build the app",
          "pull the latest docker images", "install/use the correct versions of
          languages and tools", etc.
        </p>
      </div>
    </section>
  );
}

function Apis() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <Heading as="h2">Built-in APIs</Heading>
        <div className="row">
          <div className="col col--6">
            <p>
              YavaScript has built-in APIs for all the things you'd normally
              want to do in a bash script, such as:
            </p>
            <ul>
              {BASH_LIKE_APIS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="col col--6">
            <p>
              As well as APIs for things which are difficult or cumbersome in
              bash, like:
            </p>
            <ul>
              {HARDER_IN_BASH_APIS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p>
          You'll also find cross-platform analogues to familiar CLI tools, like{" "}
          <code>mkdir</code>, <code>rm</code>, <code>chmod</code>,{" "}
          <code>dirname</code>, <code>which</code>, and more.
        </p>
        <p>
          <strong>
            For the full API documentation, see{" "}
            <Link to={API_DOCS_URL}>here</Link>.
          </strong>
        </p>
      </div>
    </section>
  );
}

function Example() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2">Example</Heading>
        <p>
          Here's an example of a script using YavaScript. Try clicking the
          identifiers to go to their API docs!
        </p>
        <ApiCodeBlock language="js" links={EXAMPLE_SCRIPT_DOC_LINKS}>
          {EXAMPLE_SCRIPT}
        </ApiCodeBlock>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <Heading as="h2">How is that different from ____?</Heading>
        <p>
          There are several other projects that bring a shell-like environment
          to JS, such as <Link href="https://github.com/google/zx">zx</Link>,{" "}
          <Link href="https://www.npmjs.com/package/shelljs">ShellJS</Link>, and{" "}
          <Link href="https://bun.sh/docs/runtime/shell">Bun Shell</Link>. The
          main difference between those and YavaScript is that YavaScript is
          very small, fully cross-platform, and brings its own JavaScript
          engine. The effect of those differences is that you can rely on
          YavaScript in places where you couldn't always rely on zx/shelljs/bun,
          like in your bootstrapping script that installs Node, or your smallest
          Docker containers. Or even on tiny constrained systems, like your
          router!
        </p>
      </div>
    </section>
  );
}

function Languages() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2">Languages</Heading>
        <p>
          YavaScript can load and run any of these languages with no
          ahead-of-time compilation step needed:
        </p>
        <ul>
          {LANGUAGES.map(({ name, href }) => (
            <li key={name}>
              <Link href={href}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TypeScriptTypes() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <Heading as="h2">TypeScript Types</Heading>
        <p>
          YavaScript comes with a TypeScript type definition (<code>.d.ts</code>
          ) file. It contains documented TypeScript type definitions which can
          be given to your IDE to assist you when writing scripts, even if you
          aren't writing your scripts in TypeScript.
        </p>
        <p>
          You can{" "}
          <Link href="https://github.com/suchipi/yavascript/blob/main/yavascript.d.ts">
            view the <code>.d.ts</code> file online
          </Link>
          , but if you have YavaScript installed, you should instead run{" "}
          <code>yavascript --print-types</code> to obtain the <code>.d.ts</code>{" "}
          file for your specific release.
        </p>
        <p>
          You can put this comment at the top of your script to instruct VS Code
          to load the type information from the <code>.d.ts</code> file, which
          will improve the quality of Intellisense, error checking, and
          autocomplete, even if you aren't using TypeScript:
        </p>
        <CodeBlock language="ts">
          {'/// <reference path="./yavascript.d.ts" />'}
        </CodeBlock>
      </div>
    </section>
  );
}

function Install() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h2">Installation</Heading>
            <p>
              You can find the binary for your platform on{" "}
              <Link href={RELEASES_URL}>the releases page</Link>. As YavaScript
              is fully self-contained in one small file, it's trivial to install
              and uninstall; simply place it somewhere specified in your{" "}
              <Link href="https://superuser.com/a/284351">
                <code>PATH</code>
              </Link>
              .
            </p>
          </div>
          <div className="col col--6">
            <Heading as="h2">Supported Platforms</Heading>
            <ul>
              {PLATFORMS.map(({ name, variants }) => (
                <li key={name}>
                  {name}
                  <ul>
                    {variants.map((variant) => (
                      <li key={variant}>{variant}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="YavaScript"
      description="YavaScript is a cross-platform bash-like script runner and repl which is distributed as a single statically-linked program, weighing in at about 5MB."
    >
      <Hero />
      <main>
        <Why />
        <Apis />
        <Example />
        <Comparison />
        <Languages />
        <TypeScriptTypes />
        <Install />
      </main>
    </Layout>
  );
}
