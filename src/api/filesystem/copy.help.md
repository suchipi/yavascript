`copy` - Copy files/folders

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

    /**
     * If provided, this function will be called multiple times as `copy`
     * traverses the filesystem, to help you understand what's going on and/or
     * troubleshoot things. In most cases, it makes sense to use a logging
     * function here, like so:
     *
     * ```js
     * copy("./source", "./destination", { trace: console.log });
     * ```
     */
    trace?: (...args: Array<any>) => void;
  };
): void;
````
