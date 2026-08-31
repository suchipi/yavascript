# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

YavaScript is a bash-like script runner and REPL distributed as a single statically-linked ~5MB binary. It embeds a fork of QuickJS ([@suchipi/quickjs](https://github.com/suchipi/quickjs/)) rather than Node. The repo builds that binary for every supported platform, plus the `.d.ts` file and the Markdown API docs.

## Commands

| Task | Command |
| --- | --- |
| Full build | `npm run build` (runs [meta/build.sh](meta/build.sh)) |
| Build without fnm | `env SKIP_FNM_USE=1 meta/build.sh` |
| Build skipping `npm install` | `env SKIP_NPM_INSTALL=1 meta/build.sh` |
| Ninja step only | `meta/scripts/ninja-build.sh` |
| Typecheck | `npm run typecheck` (`tsc --noEmit`) |
| Test | `npm test` |
| Single test file | `npm test -- basename` (arg is a vitest filename filter) |
| CI (what GitHub Actions runs) | [meta/scripts/ci.sh](meta/scripts/ci.sh) |

Notes:

- Tests live in [meta/tests/](meta/tests/) and have their own `package.json`/`node_modules`. Run `cd meta/tests && npm install` once before the first test run.
- **Tests execute the built binary at `dist/yavascript`** (see [meta/tests/vitest/helpers.js](meta/tests/vitest/helpers.js)), so you must build before testing, and rebuild after changing `src/`.
- Release steps are written down in [meta/how-to-deploy-a-new-version.txt](meta/how-to-deploy-a-new-version.txt).

## Build pipeline

The build is Ninja-driven, but the Ninja files are written in TypeScript: [shinobi](https://npmjs.com/package/@suchipi/shinobi) compiles `meta/ninja/**/*.ninja.ts` into `dist/build.ninja`, then `ninja` runs it. Rules are defined in [meta/ninja/rules.ninja.ts](meta/ninja/rules.ninja.ts); each layer/artifact gets its own `*.ninja.ts` file.

The per-layer pipeline is: **bundle with [kame](https://npmjs.com/package/kame) → compile to QuickJS bytecode → wrap the bytecode as a JS file defining an `ArrayBuffer` global (`__bytecode_layerN`)**. The final binary is produced by the `make-program` rule, which literally concatenates a `qjsbootstrap` base binary from `node_modules/@suchipi/quickjs/build/<target>/bin/` with the payload and `chmod +x`es the result.

[meta/kame/kame-config.js](meta/kame/kame-config.js) is the bundler's resolver. It stubs out Node builtins and unwanted deps, marks `quickjs:*` as external, and implements the `?contentString`, `?lzStringCompressed`, and `?evalAtBuildTime` import suffixes declared in [src/kame-filetypes.d.ts](src/kame-filetypes.d.ts).

`walkJsDeps` ([meta/scripts/lib/walk.js](meta/scripts/lib/walk.js)) traverses the import graph at Ninja-generation time to compute each bundle's implicit inputs, so incremental rebuilds are correct.

## Layer architecture

`src/` is split into layers that are compiled to separate bytecode blobs, concatenated, and evaluated in order at startup. Each layer has a one-line `README.md`.

| Layer | Contents |
| --- | --- |
| [src/layer1/](src/layer1/) | Nearly all the code: the global user-facing API, compilers, module hooks, extension handlers |
| [src/layer2/](src/layer2/) | Only the hardcoded version + architecture constants |
| [src/layer3/](src/layer3/) | `Worker`, `runInWorker`, `Context` globals |
| [src/layer4/](src/layer4/) | `getDtsText` (the embedded, lz-string-compressed `.d.ts`) |
| [src/layer5a/](src/layer5a/) | The `yavascript-bootstrap` binary |
| [src/layer5b/](src/layer5b/) | The `yavascript` binary (CLI entrypoint) |

Two things follow from this split and are easy to trip over:

- **Layer 2 is why there are `-arm64` and `-x86_64` variants of everything downstream.** Version and arch are baked in, so keeping them in their own tiny layer lets every *other* layer's compilation unit be shared between architectures.
- **Layers communicate through deliberately temporary globals.** A layer exposes internals as `globalThis.__yavascript_layerN_internals`; the loader (`load-layers.ts`) evaluates the bytecode blobs in order and then `delete`s both the `__bytecode_layerN` and `__yavascript_layerN_internals` globals so scripts never see them. Their types are declared in [src/globals.d.ts](src/globals.d.ts) - if a later layer needs something from layer 1, it needs a `declare var` there.

CLI dispatch: [src/layer5b/determine-target.ts](src/layer5b/determine-target.ts) turns `scriptArgs` into a tagged `TargetDetermination`, and [src/layer5b/main.ts](src/layer5b/main.ts) `require`s the matching module from [src/layer5b/targets/](src/layer5b/targets/). Note the deliberate constraint documented there: `-h`/`-v`/etc. only take effect when they are the *only* argument, so user scripts can define their own flags.

## API globals: lazy by construction

Startup time matters, so no API module is eagerly imported. [src/layer1/api/_install-api.ts](src/layer1/api/_install-api.ts) builds getter property descriptors via `makeGetterPropertyDescriptorMap` ([src/layer1/lazy-load.ts](src/layer1/lazy-load.ts)) that `require()` the implementation on first access, and installs them all with one `Object.defineProperties`. Command-shaped globals (`cat`, `ls`, `which`, ...) are registered the same way in [src/layer1/api/commands/_all.ts](src/layer1/api/commands/_all.ts).

Adding a new global API means touching several files:

1. `src/layer1/api/<name>/` with `<name>.ts`, `index.ts`, and `<name>.inc.d.ts`.
2. Register the lazy getter in `_install-api.ts` (or `commands/_all.ts`).
3. Add `#INCLUDE("<name>.inc.d.ts")` to [src/templates/yavascript.d.ts.tmpl](src/templates/yavascript.d.ts.tmpl).
4. Add doc links to [meta/scripts/lib/generated-doc-links.json5](meta/scripts/lib/generated-doc-links.json5).
5. Add a `declare var` to [src/globals.d.ts](src/globals.d.ts) only if a later layer uses it.

## Generated files: never hand-edit

These are build outputs that are checked into git. Edit the source and rebuild instead.

| File | Generated from |
| --- | --- |
| [yavascript.d.ts](yavascript.d.ts) (repo root) | `src/**/*.inc.d.ts`, assembled by [macaroni](https://npmjs.com/package/@suchipi/macaroni) via `src/templates/yavascript-git.d.ts.tmpl` → `yavascript.d.ts.tmpl` |
| [meta/generated-docs/](meta/generated-docs/) | the same `.inc.d.ts` files, via [dtsmd](https://npmjs.com/package/@suchipi/dtsmd) ([meta/ninja/generated-docs.ninja.ts](meta/ninja/generated-docs.ninja.ts)) |
| [meta/website/docs/](meta/website/docs/) | the same dtsmd output, minus the table of contents, run through [meta/scripts/md-to-docusaurus-doc.js](meta/scripts/md-to-docusaurus-doc.js) |
| `dist/**` | the whole build |
| `meta/npm/bin/`, `meta/npm/yavascript.d.ts`, `meta/npm/README.md` | copies made by [meta/ninja/npm.ninja.ts](meta/ninja/npm.ninja.ts) |

`.inc.d.ts` files are therefore doubly load-bearing: they are the published type definitions *and* the source of the user-facing docs. `tsconfig.json` excludes them from typechecking, and they are written as ambient `declare` blocks, not modules.

## Tests

[meta/tests/src/](meta/tests/src/) uses vitest, but the tests are end-to-end: `evaluate(code)` and `runYavascript(args)` from [meta/tests/src/test-helpers.ts](meta/tests/src/test-helpers.ts) spawn the real binary via `first-base` and assert on `{ stdout, stderr, code, error }` with inline snapshots. Output is passed through `first-base` sanitizers (removable per-test with `removeSanitizer`) to keep paths and timings stable.

`vitest.config.js` chdirs to the repo root before running, so relative paths in tests are repo-root-relative.

## Misc

- The `yavascript-internals` symlink at the repo root points at `.`; it exists so bytecode stack traces show `yavascript-internals/src/...` filenames (see the `to-bytecode` rule).
- Supported script languages (JS, TS, JSX/TSX, CoffeeScript, Civet) are wired up in [src/layer1/langs.ts](src/layer1/langs.ts) and [src/layer1/extension-handlers/](src/layer1/extension-handlers/); `http:`/`https:`/`npm:` import protocols live in [src/layer1/module-protocols/](src/layer1/module-protocols/).
- [todo.md](todo.md) tracks known bugs and rough edges.
