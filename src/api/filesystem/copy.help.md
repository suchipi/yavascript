# `copy` - Copy files/folders

Copies a file or folder from one location to another. Folders are copied recursively.

Provides the same functionality as the command `cp -R`.

````ts
// Defined in yavascript/src/api/filesystem/copy.ts
declare function copy(
  from: string | Path,
  to: string | Path,
  options?: {
    /**
     * What to do when attempting to copy something into a location where
     * something else already exists.
     *
     * Defaults to "error".
     */
    whenTargetExists?: "overwrite" | "skip" | "error";

    /** Options which control logging. */
    logging?: {
      /**
       * If provided, this function will be called multiple times as `copy`
       * traverses the filesystem, to help you understand what's going on and/or
       * troubleshoot things. In most cases, it makes sense to use a logging
       * function here, like so:
       *
       * ```js
       * copy("./source", "./destination", {
       *   logging: { trace: console.log },
       * });
       * ```
       *
       * Defaults to the current value of {@link logger.trace}. `logger.trace`
       * defaults to a no-op function.
       */
      trace?: (...args: Array<any>) => void;

      /**
       * An optional, user-provided logging function to be used for informational
       * messages.
       *
       * Defaults to the current value of {@link logger.info}. `logger.info`
       * defaults to a function which writes to stderr.
       */
      info?: (...args: Array<any>) => void;
    }
  };
): void;
````
