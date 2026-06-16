/** The type of the return value of {@link whoami}. */
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
 */
declare function whoami(): WhoAmIResult;
