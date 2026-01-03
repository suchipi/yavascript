const { flags, args, metadata } = parseScriptArgs(
  {
    // Note that while `-v` is also a command-line script for yavascript itself
    // (which prints the yavascript version), you can still use it in your own
    // scripts, because yavascript only prints its version when it's called with
    // `-v` with no other arguments.
    v: Boolean,
    verbose: Boolean,
    hello: String,
    input: Path,
  },
  // This second argument is optional; in unspecified, it defaults to
  // `scriptArgs.slice(2)`. It's only shown here to demonstrate that it's
  // possible to pass different args here, if desired.
  scriptArgs.slice(2),
);

console.log({ flags, args, metadata });
