---
slug: /
sidebar_label: API Documentation
sidebar_position: 0
---

# YavaScript API Documentation Index

Here is a list of all of YavaScript's builtin APIs, aside from those normally found in ECMAScript.

## Process APIs

- [`env`]: Read/write the process's environment variables
- [`exec`]: Run programs
- [`$`]: Run programs and capture their output
- [`ChildProcess`]: Lower-level program-running API used by `exec`

## Filesystem APIs

- [`exists`]: Check if a file/folder exists at a path
- [`isFile`]: Check if a path refers to a file
- [`isDir`]: Check if a path refers to a directory (folder)
- [`isLink`]: Check if a path refers to a symbolic link (symlink)
- [`readFile`]: Read the contents of a file
- [`remove`]: Delete (unlink) a file
- [`writeFile`]: Write data to disk
- [`copy`]: Copy a file or folder
- [`rename`]: Rename (move) a file
- [`isExecutable`]: Check if a file has the executable bit set (ie. from `chmod +x`)
- [`isReadable`]: Check if the current user has permissions to read a path
- [`isWritable`]: Check if the current user has permissions to write to a path

## Command-like Functions

- [`basename`]: Get the last component of a path
- [`cat`]: Read one or more files
- [`cd`]: Change the working directory
- [`chmod`]: Change file/folder permissions
- [`dirname`]: Exclude last component from a path
- [`echo`]: Print values to stdout
- [`exit`]: Stop execution
- [`extname`]: Get a file extension from a path or filename
- [`ls`]: List the contents of a folder
- [`mkdir`]: Create a folder
- [`mkdirp`]: Recursively ensure a folder path exists
- [`printf`]: Print values with C format specifiers
- [`pwd`]: Get the present working directory
- [`readlink`]: Get the target of a symlink
- [`realpath`]: Resolve paths and symlinks to absolute paths
- [`sleep`]: Pause execution for a period of time
- [`touch`]: Create a file or update its timestamps
- [`which`]: Find the path to a program on the system
- [`grepFile`]: Search for matches in a file
- [`grepString`]: Search for matches in a string
- [`grepArray`]: Search for matches in an Array
- [`whoami`]: Get user name/uid/gid
- [`openUrl`]: Open a file/url using your operating system's default application for that file/url

## Types and Helpers

- [`Path`]: Object representing a filesystem path, with methods for working with it.
  - Almost all YavaScript APIs accept Path objects in the same places where you could use path strings.
- [`GitRepo`]: methods for locating and getting info from git repositories on disk.
- [`glob`]: Search the filesystem using globs. Returns an array of paths.
- [`assert`]: Throw an error if a value isn't truthy
- [`is`]: Check the runtime type of any value
- [`assert.type`]: Throw an error if a value doesn't have the expected type
- [`types`]: Runtime types and type builders for use with `is` and `assert.type`
- [`help`]: Prints a link to these help docs

## String Helpers

Methods which are useful when printing strings to a terminal (command-line) screen. Most of these function wrap strings in escape codes which causes terminals to print them with different styling.

- [`quote`]: Wrap a string in double-quotes and escape any double-quotes within
- [`stripAnsi`]: Remove ANSI control character sequences from a string
- [`bgBlack`]: Set background color to black
- [`bgBlue`]: Set background color to blue
- [`bgCyan`]: Set background color to cyan
- [`bgGreen`]: Set background color to green
- [`bgMagenta`]: Set background color to magenta
- [`bgRed`]: Set background color to red
- [`bgWhite`]: Set background color to white
- [`bgYellow`]: Set background color to yellow
- [`black`]: Set text (foreground) color to black
- [`blue`]: Set text (foreground) color to blue
- [`cyan`]: Set text (foreground) color to cyan
- [`gray`]: Set text (foreground) color to gray
- [`green`]: Set text (foreground) color to green
- [`grey`]: Set text (foreground) color to grey
- [`magenta`]: Set text (foreground) color to magenta
- [`red`]: Set text (foreground) color to red
- [`white`]: Set text (foreground) color to white
- [`yellow`]: Set text (foreground) color to yellow
- [`bold`]: Make text thicker
- [`dim`]: Make text greyed out a bit
- [`hidden`]: Make text not visible
- [`inverse`]: Swap foreground and background colors
- [`italic`]: Italicize text
- [`reset`]: Reset all styles/colors
- [`strikethrough`]: Cross out text with a line
- [`underline`]: Put a line beneath text

## Printing Methods

- [`console`]: Standard JavaScript object. Write to stdout or stderr.
- [`print`]: Write to stdout. Same as `console.log`.
- [`echo`]: Write to stdout. Same as `console.log`.
- [`clear`]: Write ANSI escape sequences to stdout which clear the terminal.
- [`inspect`]: Create a human-readable string for any value. `console`, `print`, and `echo` call this internally.
- [`logger`]: The default logger, used by several YavaScript APIs. You can replace its properties to increase logging verbosity, similar to `set -x` in traditional unix shells.

## Command-Line/Scripting Helpers

- [`scriptArgs`]: The command-line arguments passed to the program.
- [`parseScriptArgs`]: Parse command-line arguments into an object.
- [`startRepl`]: Enter the YavaScript REPL (Read-Eval-Print-Loop) from within one of your scripts.
- [`InteractivePrompt`]: Create your own REPL
- [`__filename`]: The absolute path to the currently-executing file
- [`__dirname`]: The absolute path to the directory (folder) containing the currently-executing file
- [`Context`]: Create constrained JS environments with a limited global scope and run code in them.

## Data Interchange Format helpers

Each of these has a `stringify` and `parse` method, which can be used to convert between strings and objects/arrays/etc.

- [`CSV`]: For working with comma-separated values
- [`YAML`]: For working with YAML Ain't Markup Language (yml)
- [`TOML`]: For working with Tom's Obvious Minimal Language
- [`JSON`]: Standard JavaScript object. For working with JavaScript Object Notation.

## APIs Relating to Compile-to-JS Languages

- [`JSX`]: Used when compiling JSX syntax. User overrides for JSX handling can go here.
- [`yavascript.compilers`]: The internal compiler functions used by YavaScript to handle compile-to-JS languages. You can use these yourself with strings, if desired.

## ECMAScript Extensions

Additions/extensions to the standard ECMAScript objects found in the runtime.

- [`String.prototype.grep`]: Alias for `grepString`
- [`RegExp.escape`]: Escape special RegExp characters in a string
- [`String.dedent`]: Remove leading indentation from template strings

## Constructor Aliases

There are several lowercase aliases for builtin constructors, so that certain types passed to `is` and `assert.type` can be written with the same casing as they use in TypeScript.

- [`bigint`]: Alias for `BigInt`
- [`boolean`]: Alias for `Boolean`
- [`number`]: Alias for `Number`
- [`string`]: Alias for `String`
- [`symbol`]: Alias for `Symbol`

## Multi-threading APIs

- [`Worker`]: Web-Worker-like multithreading API
- [`runInWorker`]: goroutine-like Worker wrapper function

## QuickJS Modules

The following QuickJS builtin modules are available via `import`/`require`:

- [`"quickjs:std"`]: C stdlib wrappers
- [`"quickjs:os"`]: OS-specific functions
- [`"quickjs:bytecode"`]: Convert JS code or values to/from bytecode
- [`"quickjs:context"`]: Create context (separate global environments, aka "Realms") to run code in
- [`"quickjs:engine"`]: APIs relating to the builtin JS engine and module loader
- [`"quickjs:encoding"`]: Utility functions for converting between binary and UTF-8.
- [`"quickjs:cmdline"`]: Command-line app utils; get argv, set exit code, exit
- [`"quickjs:timers"`]: setTimeout and setInterval

## QuickJS Module Namespace Globals

For convenience, two of the builtin modules from QuickJS are also available as globals.

- [`std`]: The "quickjs:std" module
- [`os`]: The "quickjs:os" module

[`env`]: ./env.md#env-object
[`readEnvBool`]: ./env.md#readenvbool-function
[`exec`]: ./exec.md#exec-interface
[`$`]: ./exec.md#-function
[`ChildProcess`]: ./ChildProcess.md#childprocess-interface
[`exists`]: ./filesystem.md#exists-function
[`isFile`]: ./filesystem.md#isfile-function
[`isDir`]: ./filesystem.md#isdir-function
[`isLink`]: ./filesystem.md#islink-function
[`readFile`]: ./filesystem.md#readfile-function
[`remove`]: ./filesystem.md#remove-function
[`writeFile`]: ./filesystem.md#writefile-function
[`copy`]: ./filesystem.md#copy-function
[`rename`]: ./filesystem.md#rename-function
[`isExecutable`]: ./filesystem.md#isexecutable-function
[`isReadable`]: ./filesystem.md#isreadable-function
[`isWritable`]: ./filesystem.md#iswritable-function
[`basename`]: ./basename.md#basename-function
[`cat`]: ./cat.md#cat-function
[`cd`]: ./cd.md#cd-function
[`chmod`]: ./chmod.md#chmod-chmod
[`dirname`]: ./dirname.md#dirname-function
[`echo`]: ./echo.md#echo-value
[`exit`]: ./exit.md#exit-function
[`extname`]: ./extname.md#extname-function
[`ls`]: ./ls.md#ls-function
[`mkdir`]: ./mkdir.md#mkdir-function
[`mkdirp`]: ./mkdirp.md#mkdirp-function
[`printf`]: ./printf.md#printf-function
[`pwd`]: ./pwd.md#pwd-function
[`readlink`]: ./readlink.md#readlink-function
[`realpath`]: ./realpath.md#realpath-function
[`sleep`]: ./sleep.md#sleep-function
[`touch`]: ./touch.md#touch-function
[`which`]: ./which.md#which-function
[`grepFile`]: ./grep.md#grepfile-function
[`grepString`]: ./grep.md#grepstring-function
[`grepArray`]: ./grep.md#greparray-function
[`whoami`]: ./whoami.md#whoami-function
[`openUrl`]: ./open-url.md#openurl-function
[`Path`]: ./path.md#path-class
[`GitRepo`]: ./git-repo.md#gitrepo-class
[`glob`]: ./glob.md#glob-function
[`assert`]: ./assert.md
[`is`]: ./is.md#is-function
[`assert.type`]: ./assert.md#asserttype-function-property
[`types`]: ./types.md#types-object
[`help`]: ./help.md#help-function
[`quote`]: ./strings.md#quote-function
[`stripAnsi`]: ./strings.md#stripansi-function
[`bgBlack`]: ./strings.md#bgblack-function
[`bgBlue`]: ./strings.md#bgblue-function
[`bgCyan`]: ./strings.md#bgcyan-function
[`bgGreen`]: ./strings.md#bggreen-function
[`bgMagenta`]: ./strings.md#bgmagenta-function
[`bgRed`]: ./strings.md#bgred-function
[`bgWhite`]: ./strings.md#bgwhite-function
[`bgYellow`]: ./strings.md#bgyellow-function
[`black`]: ./strings.md#black-function
[`blue`]: ./strings.md#blue-function
[`cyan`]: ./strings.md#cyan-function
[`gray`]: ./strings.md#gray-function
[`green`]: ./strings.md#green-function
[`grey`]: ./strings.md#grey-function
[`magenta`]: ./strings.md#magenta-function
[`red`]: ./strings.md#red-function
[`white`]: ./strings.md#white-function
[`yellow`]: ./strings.md#yellow-function
[`bold`]: ./strings.md#bold-function
[`dim`]: ./strings.md#dim-function
[`hidden`]: ./strings.md#hidden-function
[`inverse`]: ./strings.md#inverse-function
[`italic`]: ./strings.md#italic-function
[`reset`]: ./strings.md#reset-function
[`strikethrough`]: ./strings.md#strikethrough-function
[`underline`]: ./strings.md#underline-function
[`console`]: ./console.md
[`print`]: ./print.md#print-function
[`clear`]: ./console.md#clear-function
[`inspect`]: ./inspect.md#inspect-inspectfunction
[`logger`]: ./logger.md#logger-object
[`scriptArgs`]: ./cmdline.md#scriptargs-value
[`parseScriptArgs`]: ./parse-script-args.md#parsescriptargs-function
[`startRepl`]: ./start-repl.md#startrepl-function
[`InteractivePrompt`]: ./interactive-prompt.md#interactiveprompt-interactivepromptconstructor
[`__filename`]: ./__filename-and-__dirname.md#__filename-string
[`__dirname`]: ./__filename-and-__dirname.md#__dirname-string
[`Context`]: ./context.md#context-class
[`CSV`]: ./csv.md#csv-object
[`YAML`]: ./yaml.md#yaml-object
[`TOML`]: ./toml.md#toml-object
[`JSON`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
[`JSX`]: ./jsx.md#jsx-namespace
[`yavascript.compilers`]: ./yavascript.md#yavascriptcompilers-object-property
[`String.prototype.grep`]: ./grep.md#stringgrep-function-property
[`Array.prototype.grep`]: ./grep.md#arraygrep-function-property
[`RegExp.escape`]: ./regexp-escape.md#regexpconstructorescape-method
[`String.dedent`]: ./string-dedent.md#stringconstructordedent-function-property
[`bigint`]: ./others.md#bigint-bigintconstructor
[`boolean`]: ./others.md#boolean-booleanconstructor
[`number`]: ./others.md#number-numberconstructor
[`string`]: ./others.md#string-stringconstructor
[`symbol`]: ./others.md#symbol-symbolconstructor
[`Worker`]: ./worker.md
[`runInWorker`]: ./runInWorker.md
[`std`]: ./std.md#quickjsstd-namespace
[`os`]: ./os.md#quickjsos-namespace
[`JSX.pragmaFrag`]: ./jsx.md#jsxpragmafrag-exported-string
[`logger.info`]: ./logger.md#loggerinfo-function-property
[`logger.trace`]: ./logger.md#loggertrace-function-property
[`types.coerce`]: ./types.md#typescoerce-function-property
[`types.JSX.Element`]: ./types.md#typesjsxelement-property
[`types.JSX.Fragment`]: ./types.md#typesjsxfragment-property
[`TypeValidator`]: ./types.md#typevalidator-type
[`JSX.pragma`]: ./jsx.md#jsxpragma-exported-string
[`setMainModule`]: ./engine.md#quickjsenginesetmainmodule-exported-function
[`setStackFrameMapper`]: ./engine.md#quickjsenginesetstackframemapper-exported-function
[`setExitCode`]: ./cmdline.md#quickjsstdsetexitcode-exported-function
[`FILE.seek`]: ./std.md#fileseek-method
[`FILE.setvbuf`]: ./std.md#filesetvbuf-method
[`open`]: ./os.md#quickjsosopen-exported-function
[`access`]: ./os.md#quickjsosaccess-exported-function
[`os.Worker`]: ./os.md#quickjsosworker-exported-class
[`R_OK`]: ./os.md#quickjsosr_ok-exported-number
[`W_OK`]: ./os.md#quickjsosw_ok-exported-number
[`X_OK`]: ./os.md#quickjsosx_ok-exported-number
[`F_OK`]: ./os.md#quickjsosf_ok-exported-number
[`require`]: ./modulesys.md#requirefunction-call-signature
[`compilers`]: ./modulesys.md#moduledelegatecompilers-object-property
[`searchExtensions`]: ./modulesys.md#moduledelegatesearchextensions-property
[`ModuleDelegate.searchExtensions`]: ./modulesys.md#moduledelegatesearchextensions-property
[`ModuleDelegate.resolve`]: ./modulesys.md#moduledelegateresolve-method
[`BigFloatEnv.expBitsMax`]: ./quickjs-extensions.md#bigfloatenvconstructorexpbitsmax-number-property
[`BigFloatEnv.prec`]: ./quickjs-extensions.md#bigfloatenvconstructorprec-getter
[`BigFloatEnv.expBits`]: ./quickjs-extensions.md#bigfloatenvconstructorexpbits-getter
[`BigFloatEnv.RNDN`]: ./quickjs-extensions.md#bigfloatenvconstructorrndn-bigfloatroundingmode-property
[`Math.LN2`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2
[`Math.PI`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI
[`Number.MIN_VALUE`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE
[`Number.MAX_VALUE`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE
[`Number.EPSILON`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
[`BigFloatEnv.RNDNA`]: ./quickjs-extensions.md#bigfloatenvconstructorrndna-bigfloatroundingmode-property
[`console.log`]: ./console.md#consolelog-method
[`console.clear`]: ./console.md#consoleclear-method
[`console.info`]: ./console.md#consoleinfo-method
[`console.error`]: ./console.md#consoleerror-method
[`console.warn`]: ./console.md#consolewarn-method
[`BaseExecOptions`]: ./exec.md#baseexecoptions-type
[`Path.normalize`]: ./path.md#pathnormalize-static-method
[`Path.OS_PROGRAM_EXTENSIONS`]: ./path.md#pathos_program_extensions-static-property
[`GrepMatchDetail`]: ./grep.md#grepmatchdetail-interface
[`ParseScriptArgsResult`]: ./parse-script-args.md#parsescriptargsresult-interface
[`Path.prototype.replace`]: ./path.md#pathprototypereplace-method
[`Path.prototype.replaceAll`]: ./path.md#pathprototypereplaceall-method
[`Path.prototype.replaceLast`]: ./path.md#pathprototypereplacelast-method
[`Path.prototype.equals`]: ./path.md#pathprototypeequals-method
[`Path.prototype.hasEqualSegments`]: ./path.md#pathprototypehasequalsegments-method
[`PathRelativeToOptions`]: ./path.md#pathrelativetooptions-interface
[`ExtnameOptions`]: ./extname.md#extnameoptions-interface
[`Path.prototype.relativeTo`]: ./path.md#pathprototyperelativeto-method
[`Path.prototype.extname`]: ./path.md#pathprototypeextname-method
[`getpwuid`]: ./std.md#quickjsstdgetpwuid-exported-function
[`CreateProcess`]: ./os.md#quickjsoscreateprocess-exported-value
[`"quickjs:std"`]: ./std.md#quickjsstd-namespace
[`"quickjs:os"`]: ./os.md#quickjsos-namespace
[`"quickjs:bytecode"`]: ./bytecode.md#quickjsbytecode-namespace
[`"quickjs:context"`]: ./quickjs-context.md#quickjscontext-namespace
[`import("quickjs:context")`]: ./quickjs-context.md#quickjscontext-namespace
[`"quickjs:encoding"`]: ./encoding.md#quickjsencoding-namespace
[`"quickjs:engine"`]: ./engine.md#quickjsengine-namespace
[`"quickjs:cmdline"`]: ./cmdline.md#quickjscmdline-namespace
[`"quickjs:modulesys"`]: ./modulesys.md#quickjsmodulesys-namespace
[`"quickjs:timers"`]: ./timers.md#quickjstimers-namespace
