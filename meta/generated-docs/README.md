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

## Types and Helpers

- [`Path`]: Object representing a filesystem path, with methods for working with it.
  - Almost all YavaScript APIs accept Path objects in the same places where you could use path strings.
- [`GitRepo`]: methods for locating and getting info from git repositories on disk.
- [`glob`]: Search the filesystem using globs. Returns an array of paths.
- [`assert`]: Throw an error if a value isn't truthy
- [`is`]: Check the runtime type of any value
- [`assert.type`]: Throw an error if a value doesn't have the expected type
- [`types`]: Runtime types and type builders for use with `is` and `assert.type`
- [`help`]: Print help docs for (almost) any runtime value

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

## QuickJS Module Namespace Globals

For convenience, two builtin modules from QuickJS are also available as globals.

- [`std`]: The "quickjs:std" module
- [`os`]: The "quickjs:os" module

[`env`]: /meta/generated-docs/env.md#env-object
[`exec`]: /meta/generated-docs/exec.md#exec-interface
[`$`]: /meta/generated-docs/exec.md#-function
[`ChildProcess`]: /meta/generated-docs/ChildProcess.md#childprocess-interface
[`exists`]: /meta/generated-docs/filesystem.md#exists-function
[`isFile`]: /meta/generated-docs/filesystem.md#isfile-function
[`isDir`]: /meta/generated-docs/filesystem.md#isdir-function
[`isLink`]: /meta/generated-docs/filesystem.md#islink-function
[`readFile`]: /meta/generated-docs/filesystem.md#readfile-function
[`remove`]: /meta/generated-docs/filesystem.md#remove-function
[`writeFile`]: /meta/generated-docs/filesystem.md#writefile-function
[`copy`]: /meta/generated-docs/filesystem.md#copy-function
[`rename`]: /meta/generated-docs/filesystem.md#rename-function
[`isExecutable`]: /meta/generated-docs/filesystem.md#isexecutable-function
[`isReadable`]: /meta/generated-docs/filesystem.md#isreadable-function
[`isWritable`]: /meta/generated-docs/filesystem.md#iswritable-function
[`basename`]: /meta/generated-docs/basename.md#basename-function
[`cat`]: /meta/generated-docs/cat.md#cat-function
[`cd`]: /meta/generated-docs/cd.md#cd-function
[`chmod`]: /meta/generated-docs/chmod.md#chmod-function
[`dirname`]: /meta/generated-docs/dirname.md#dirname-function
[`echo`]: /meta/generated-docs/echo.md#echo-value
[`exit`]: /meta/generated-docs/exit.md#exit-function
[`extname`]: /meta/generated-docs/extname.md#extname-function
[`ls`]: /meta/generated-docs/ls.md#ls-function
[`mkdir`]: /meta/generated-docs/mkdir.md#mkdir-function
[`mkdirp`]: /meta/generated-docs/mkdirp.md#mkdirp-function
[`printf`]: /meta/generated-docs/printf.md#printf-function
[`pwd`]: /meta/generated-docs/pwd.md#pwd-function
[`readlink`]: /meta/generated-docs/readlink.md#readlink-function
[`realpath`]: /meta/generated-docs/realpath.md#realpath-function
[`sleep`]: /meta/generated-docs/sleep.md#sleep-function
[`touch`]: /meta/generated-docs/touch.md#touch-function
[`which`]: /meta/generated-docs/which.md#which-function
[`grepFile`]: /meta/generated-docs/grep.md#grepfile-function
[`grepString`]: /meta/generated-docs/grep.md#grepstring-function
[`Path`]: /meta/generated-docs/path.md#path-class
[`GitRepo`]: /meta/generated-docs/git-repo.md#gitrepo-class
[`glob`]: /meta/generated-docs/glob.md#glob-function
[`assert`]: /meta/generated-docs/assert.md
[`is`]: /meta/generated-docs/is.md#is-function
[`assert.type`]: /meta/generated-docs/assert.md#asserttype-function-property
[`types`]: /meta/generated-docs/types.md#types-object
[`help`]: /meta/generated-docs/help.md#help-function
[`quote`]: /meta/generated-docs/strings.md#quote-function
[`stripAnsi`]: /meta/generated-docs/strings.md#stripansi-function
[`bgBlack`]: /meta/generated-docs/strings.md#bgblack-function
[`bgBlue`]: /meta/generated-docs/strings.md#bgblue-function
[`bgCyan`]: /meta/generated-docs/strings.md#bgcyan-function
[`bgGreen`]: /meta/generated-docs/strings.md#bggreen-function
[`bgMagenta`]: /meta/generated-docs/strings.md#bgmagenta-function
[`bgRed`]: /meta/generated-docs/strings.md#bgred-function
[`bgWhite`]: /meta/generated-docs/strings.md#bgwhite-function
[`bgYellow`]: /meta/generated-docs/strings.md#bgyellow-function
[`black`]: /meta/generated-docs/strings.md#black-function
[`blue`]: /meta/generated-docs/strings.md#blue-function
[`cyan`]: /meta/generated-docs/strings.md#cyan-function
[`gray`]: /meta/generated-docs/strings.md#gray-function
[`green`]: /meta/generated-docs/strings.md#green-function
[`grey`]: /meta/generated-docs/strings.md#grey-function
[`magenta`]: /meta/generated-docs/strings.md#magenta-function
[`red`]: /meta/generated-docs/strings.md#red-function
[`white`]: /meta/generated-docs/strings.md#white-function
[`yellow`]: /meta/generated-docs/strings.md#yellow-function
[`bold`]: /meta/generated-docs/strings.md#bold-function
[`dim`]: /meta/generated-docs/strings.md#dim-function
[`hidden`]: /meta/generated-docs/strings.md#hidden-function
[`inverse`]: /meta/generated-docs/strings.md#inverse-function
[`italic`]: /meta/generated-docs/strings.md#italic-function
[`reset`]: /meta/generated-docs/strings.md#reset-function
[`strikethrough`]: /meta/generated-docs/strings.md#strikethrough-function
[`underline`]: /meta/generated-docs/strings.md#underline-function
[`console`]: /meta/generated-docs/console.md
[`print`]: /meta/generated-docs/print.md#print-function
[`clear`]: /meta/generated-docs/console.md#clear-function
[`inspect`]: /meta/generated-docs/inspect.md#inspect-inspectfunction
[`logger`]: /meta/generated-docs/logger.md#logger-object
[`scriptArgs`]: /meta/generated-docs/libc.md#scriptargs-value
[`parseScriptArgs`]: /meta/generated-docs/parse-script-args.md#parsescriptargs-function
[`startRepl`]: /meta/generated-docs/start-repl.md#startrepl-function
[`InteractivePrompt`]: /meta/generated-docs/interactive-prompt.md#interactiveprompt-interactivepromptconstructor
[`__filename`]: /meta/generated-docs/__filename-and-__dirname.md#__filename-string
[`__dirname`]: /meta/generated-docs/__filename-and-__dirname.md#__dirname-string
[`CSV`]: /meta/generated-docs/csv.md#csv-object
[`YAML`]: /meta/generated-docs/yaml.md#yaml-object
[`TOML`]: /meta/generated-docs/toml.md#toml-object
[`JSON`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
[`JSX`]: /meta/generated-docs/jsx.md#jsx-namespace
[`yavascript.compilers`]: /meta/generated-docs/yavascript.md#yavascriptcompilers-object-property
[`String.prototype.grep`]: /meta/generated-docs/grep.md#stringgrep-function-property
[`RegExp.escape`]: /meta/generated-docs/regexp-escape.md#regexpconstructorescape-method
[`String.dedent`]: /meta/generated-docs/string-dedent.md#stringconstructordedent-function-property
[`bigint`]: /meta/generated-docs/others.md#bigint-bigintconstructor
[`boolean`]: /meta/generated-docs/others.md#boolean-booleanconstructor
[`number`]: /meta/generated-docs/others.md#number-numberconstructor
[`string`]: /meta/generated-docs/others.md#string-stringconstructor
[`symbol`]: /meta/generated-docs/others.md#symbol-symbolconstructor
[`std`]: /meta/generated-docs/libc.md#quickjsstd-namespace
[`os`]: /meta/generated-docs/libc.md#quickjsos-namespace
[`JSX.pragmaFrag`]: /meta/generated-docs/jsx.md#jsxpragmafrag-exported-string
[`logger.info`]: /meta/generated-docs/logger.md#loggerinfo-function-property
[`logger.trace`]: /meta/generated-docs/logger.md#loggertrace-function-property
[`types.coerce`]: /meta/generated-docs/types.md#typescoerce-function-property
[`types.JSX.Element`]: /meta/generated-docs/types.md#typesjsxelement-property
[`types.JSX.Fragment`]: /meta/generated-docs/types.md#typesjsxfragment-property
[`TypeValidator`]: /meta/generated-docs/types.md#typevalidator-type
[`JSX.pragma`]: /meta/generated-docs/jsx.md#jsxpragma-exported-string
[`setMainModule`]: /meta/generated-docs/engine.md#quickjsenginesetmainmodule-exported-function
[`setExitCode`]: /meta/generated-docs/libc.md#quickjsstdsetexitcode-exported-function
[`FILE.seek`]: /meta/generated-docs/libc.md#fileseek-method
[`FILE.setvbuf`]: /meta/generated-docs/libc.md#filesetvbuf-method
[`open`]: /meta/generated-docs/libc.md#quickjsosopen-exported-function
[`access`]: /meta/generated-docs/libc.md#quickjsosaccess-exported-function
[`R_OK`]: /meta/generated-docs/libc.md#quickjsosr_ok-exported-number
[`W_OK`]: /meta/generated-docs/libc.md#quickjsosw_ok-exported-number
[`X_OK`]: /meta/generated-docs/libc.md#quickjsosx_ok-exported-number
[`F_OK`]: /meta/generated-docs/libc.md#quickjsosf_ok-exported-number
[`require`]: /meta/generated-docs/modulesys.md#requirefunction-call-signature
[`compilers`]: /meta/generated-docs/modulesys.md#moduledelegatecompilers-object-property
[`searchExtensions`]: /meta/generated-docs/modulesys.md#moduledelegatesearchextensions-property
[`ModuleDelegate.searchExtensions`]: /meta/generated-docs/modulesys.md#moduledelegatesearchextensions-property
[`ModuleDelegate.resolve`]: /meta/generated-docs/modulesys.md#moduledelegateresolve-method
[`BigFloatEnv.expBitsMax`]: /meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorexpbitsmax-number-property
[`BigFloatEnv.prec`]: /meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorprec-getter
[`BigFloatEnv.expBits`]: /meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorexpbits-getter
[`BigFloatEnv.RNDN`]: /meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorrndn-bigfloatroundingmode-property
[`Math.LN2`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2
[`Math.PI`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI
[`Number.MIN_VALUE`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE
[`Number.MAX_VALUE`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE
[`Number.EPSILON`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
[`BigFloatEnv.RNDNA`]: /meta/generated-docs/quickjs-extensions.md#bigfloatenvconstructorrndna-bigfloatroundingmode-property
