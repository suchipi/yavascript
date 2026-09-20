// stderr is unbuffered; what the repl writes to stdout only reaches a test
// watching it once the engine draws the next prompt.
std.err.puts("the loaded script ran\n");
std.err.flush();
throw new Error("the loaded script blew up");
