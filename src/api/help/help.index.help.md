# YavaScript `help()` Index

The `help()` function prints documentation for various APIs and values found in the YavaScript runtime.

Here is a list of all of YavaScript's APIs. Pass any value listed here into `help(...)` to see its corresponding documentation.

## Process APIs

- `env`: Read/write the process's environment variables
- `exec`: Run programs
- `$`: Run programs and capture their output
- `ChildProcess`: Lower-level program-running API used by `exec`

## Filesystem APIs

- `exists`: Check if a file/folder exists at a path
- `isFile`: Check if a path refers to a file
- `isDir`: Check if a path refers to a directory (folder)
- `isLink`: Check if a path refers to a symbolic link (symlink)
- `readFile`: Read the contents of a file
- `remove`: Delete (unlink) a file
- `writeFile`: Write data to disk
- `copy`: Copy a file or folder
- `rename`: Rename (move) a file
- `isExecutable`: Check if a file has the executable bit set (ie. from `chmod +x`)
- `isReadable`: Check if the current user has permissions to read a path
- `isWritable`: Check if the current user has permissions to write to a path

## Command-like Functions

- `basename`: Get the last component of a path
- `cat`: Read one or more files
- `cd`: Change the working directory
- `chmod`: Change file/folder permissions
- `dirname`: Exclude last component from a path
- `echo`: Print values to stdout
- `exit`: Stop execution
- `extname`: Get a file extension from a path or filename
- `ls`: List the contents of a folder
- `mkdir`: Create a folder
- `mkdirp`: Recursively ensure a folder path exists
- `printf`: Print values with C format specifiers
- `pwd`: Get the present working directory
- `readlink`: Get the target of a symlink
- `realpath`: Resolve paths and symlinks to absolute paths
- `sleep`: Pause execution for a period of time
- `touch`: Create a file or update its timestamps
- `which`: Find the path to a program on the system
- `grepFile`: Search for matches in a file
- `grepString`: Search for matches in a string

## Types and Helpers

- `Path`: Object representing a filesystem path, with methods for working with it.
  - Almost all YavaScript APIs accept Path objects in the same places where you could use path strings.
- `GitRepo`: methods for locating and getting info from git repositories on disk.
- `glob`: Search the filesystem using globs. Returns an array of paths.
- `assert`: Throw an error if a value isn't truthy
- `is`: Check the runtime type of any value
- `assert.type`: Throw an error if a value doesn't have the expected type
- `types`: Runtime types and type builders for use with `is` and `assert.type`
- `help`: Print help docs for (almost) any runtime value

## String Helpers

Methods which are useful when printing strings to a terminal (command-line) screen. Most of these function wrap strings in escape codes which causes terminals to print them with different styling.

- `quote`: Wrap a string in double-quotes and escape any double-quotes within
- `stripAnsi`: Remove ANSI control character sequences from a string
- `bgBlack`: Set background color to black
- `bgBlue`: Set background color to blue
- `bgCyan`: Set background color to cyan
- `bgGreen`: Set background color to green
- `bgMagenta`: Set background color to magenta
- `bgRed`: Set background color to red
- `bgWhite`: Set background color to white
- `bgYellow`: Set background color to yellow
- `black`: Set text (foreground) color to black
- `blue`: Set text (foreground) color to blue
- `cyan`: Set text (foreground) color to cyan
- `gray`: Set text (foreground) color to gray
- `green`: Set text (foreground) color to green
- `grey`: Set text (foreground) color to grey
- `magenta`: Set text (foreground) color to magenta
- `red`: Set text (foreground) color to red
- `white`: Set text (foreground) color to white
- `yellow`: Set text (foreground) color to yellow
- `bold`: Make text thicker
- `dim`: Make text greyed out a bit
- `hidden`: Make text not visible
- `inverse`: Swap foreground and background colors
- `italic`: Italicize text
- `reset`: Reset all styles/colors
- `strikethrough`: Cross out text with a line
- `underline`: Put a line beneath text

## Printing Methods

- `console`: Standard JavaScript object. Write to stdout or stderr.
- `print`: Write to stdout. Same as `console.log`.
- `echo`: Write to stdout. Same as `console.log`.
- `clear`: Write ANSI escape sequences to stdout which clear the terminal.
- `inspect`: Create a human-readable string for any value. `console`, `print`, and `echo` call this internally.
- `logger`: The default logger, used by several YavaScript APIs. You can replace its properties to increase logging verbosity, similar to `set -x` in traditional unix shells.

## Command-Line/Scripting Helpers

- `scriptArgs`: The command-line arguments passed to the program.
- `parseScriptArgs`: Parse command-line arguments into an object.
- `startRepl`: Enter the YavaScript REPL (Read-Eval-Print-Loop) from within one of your scripts.
- `InteractivePrompt`: Create your own REPL
- `__filename`: The absolute path to the currently-executing file
- `__dirname`: The absolute path to the directory (folder) containing the currently-executing file

## Data Interchange Format helpers

Each of these has a `stringify` and `parse` method, which can be used to convert between strings and objects/arrays/etc.

- `CSV`: For working with comma-separated values
- `YAML`: For working with YAML Ain't Markup Language (yml)
- `TOML`: For working with Tom's Obvious Minimal Language
- `JSON`: Standard JavaScript object. For working with JavaScript Object Notation.

## APIs Relating to Compile-to-JS Languages

- `JSX`: Used when compiling JSX syntax. User overrides for JSX handling can go here.
- `yavascript.compilers`: The internal compiler functions used by YavaScript to handle compile-to-JS languages. You can use these yourself with strings, if desired.

## ECMAScript Extensions

Additions/extensions to the standard ECMAScript objects found in the runtime.

- `String.prototype.grep`: Alias for `grepString`
- `RegExp.escape`: Escape special RegExp characters in a string
- `String.dedent`: Remove leading indentation from template strings

## Constructor Aliases

There are several lowercase aliases for builtin constructors, so that certain types passed to `is` and `assert.type` can be written with the same casing as they use in TypeScript.

- `bigint`: Alias for `BigInt`
- `boolean`: Alias for `Boolean`
- `number`: Alias for `Number`
- `string`: Alias for `String`
- `symbol`: Alias for `Symbol`

## QuickJS Module Namespace Globals

For convenience, two builtin modules from QuickJS are also available as globals.

- `std`: The "quickjs:std" module
- `os`: The "quickjs:os" module

# Example

Pass any of the listed values, or any other value, into `help(...)` to read its documentation. For example:

```ts
help(exec); // Prints documentation for the `exec` function
help(__dirname); // Prints documentation about `__dirname`
help(TOML); // Prints documentation about the `TOML` object
help(TOML.stringify); // Prints documentation about the `TOML.stringify` function
```
