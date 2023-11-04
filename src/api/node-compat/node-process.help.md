# `process` - Node.js-style 'process' object

The `process` global is provided for rudimentary compatibility with Node.js scripts. It contains a subset of the properties found on the Node.js `process` global, which each forward to their corresponding yavascript API.

For instance, `process.env` is a getter that returns `env`, and `process.argv` is a getter that returns `scriptArgs`.

If you are writing yavascript-specific code, you should use yavascript's APIs instead of what's found on `process`.
