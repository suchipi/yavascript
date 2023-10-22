declare const std: typeof import("quickjs:std");
declare const os: typeof import("quickjs:os");

// undocumented from quickjs, but it's there
/** Get the current unix timestamp with microsecond precision. */
declare function __date_clock(): number;
