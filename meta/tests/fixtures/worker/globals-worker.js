// Reports back which yavascript globals (including the Worker class itself) are
// present in the worker's global scope.
Worker.parent.postMessage({
  // a sampling of the yavascript API globals
  echo: typeof echo,
  cat: typeof cat,
  ls: typeof ls,
  cd: typeof cd,
  exec: typeof exec,
  glob: typeof glob,
  readFile: typeof readFile,
  Path: typeof Path,
  yavascript: typeof yavascript,
  // the Worker global itself
  Worker: typeof Worker,
});
