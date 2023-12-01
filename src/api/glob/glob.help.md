# `glob` - Turn a glob string into an array of paths

The `glob` function is used to resolve [UNIX-style glob strings][man-glob-7] into an array of matching filesystem paths.

Glob strings assist in succinctly finding and describing a set of files on disk. For instance, to find the path of every `.js` file in the `src` folder, one might write:

```
src/*.js
```

Or, if they'd like to recurse into subfolders:

```
src/**/*.js
```

`glob` can be used to turn one or more of these glob strings into an array of `Path` objects.

> When specifying more than one pattern string, paths must match ALL of the patterns to be included in the returned Array. In other words, it uses logical AND logic when using more than one pattern.

````ts
// Defined in yavascript/src/api/glob
/**
 * Search the filesystem for files matching the specified glob patterns.
 *
 * Uses [minimatch](https://www.npmjs.com/package/minimatch) with its default
 * options.
 */
declare function glob(
  patterns: string | Array<string>,
  options?: {
    /**
     * Whether to treat symlinks to directories as if they themselves were
     * directories, traversing into them.
     *
     * Defaults to false.
     */
    followSymlinks?: boolean;

    /** Options which control logging. */
    logging?: {
      /**
       * If provided, this function will be called multiple times as `glob`
       * traverses the filesystem, to help you understand what's going on and/or
       * troubleshoot things. In most cases, it makes sense to use a logging
       * function here, like so:
       *
       * ```js
       * glob(["./*.js"], {
       *  logging: { trace: console.log }
       * });
       * ```
       *
       * Defaults to the current value of {@link logger.trace}. `logger.trace`
       * defaults to a no-op function.
       */
      trace?: (...args: Array<any>) => void;

      /**
       * An optional, user-provided logging function to be used for informational
       * messages. Less verbose than `logging.trace`.
       *
       * Defaults to the current value of {@link logger.info}. `logger.info`
       * defaults to a function which writes to stderr.
       */
      info?: (...args: Array<any>) => void;
    };

    /**
     * Directory to interpret glob patterns relative to. Defaults to `pwd()`.
     */
    dir?: string | Path;
  }
): Array<Path>;
````

[man-glob-7]: https://man7.org/linux/man-pages/man7/glob.7.html
