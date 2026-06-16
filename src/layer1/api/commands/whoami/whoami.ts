import * as std from "quickjs:std";

export interface WhoAmIResult {
  name: string;
  uid: number;
  gid: number;
}

export function whoami(): WhoAmIResult {
  const passwdEntry = std.getpwuid(std.geteuid());

  return {
    name: passwdEntry.name,
    uid: passwdEntry.uid,
    gid: passwdEntry.gid,
  };
}
