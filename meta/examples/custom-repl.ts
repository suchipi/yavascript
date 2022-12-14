#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

// Just defining some made-up stuff for demonstration purposes...
const TOKEN_REGEX = /[^\w]|_/g;
function tokens(input: string) {
  return input.split(TOKEN_REGEX).filter(Boolean);
}

// You can start the yavascript repl from your own file,
// with your own stuff loaded, by calling `startRepl`:
startRepl(
  // Variables to make available to the repl as globals. Optional
  { TOKEN_REGEX, tokens },
  // Which language repl input should be interpreted as, ie. typescript, coffeescript, jsx, etc. Defaults to "javascript".
  "typescript"
);
