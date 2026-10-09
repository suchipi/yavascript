/**
 * The type of the return value of {@link whoami}.
 *
 * **Example**
 * ```ts
 * const user: WhoAmIResult = whoami();
 * console.log(user.name, user.uid, user.gid);
 * ```
 */
declare interface WhoAmIResult {
  name: string;
  uid: number;
  gid: number;
}

/**
 * Get info about the user the yavascript process is executing as.
 *
 * Provides functionality similar to the unix binaries `whoami` and `id`.
 *
 * NOTE: Doesn't work on Windows; throws an error.
 *
 * **Example**
 * ```ts
 * const { name } = whoami();
 * console.log(`Running as ${name}`);
 * ```
 */
declare function whoami(): WhoAmIResult;
