import * as os from "quickjs:os";
import { is } from "../../is";
import { assert } from "../../assert";
import { makeErrorWithProperties } from "../../../error-with-properties";
import type { Path } from "../../path";
import { setHelpText } from "../../help";
import chmodHelp from "./chmod.help.md";

type ChmodPermissionsWho =
  | "user"
  | "group"
  | "others"
  | "all"
  | "u"
  | "g"
  | "o"
  | "a"
  | "ug"
  | "go"
  | "uo";

type ChmodPermissionsWhat =
  | "read"
  | "write"
  | "execute"
  | "readwrite"
  | "none"
  | "full"
  | "r"
  | "w"
  | "x"
  | "rw"
  | "rx"
  | "wx"
  | "rwx";

function permsFor(
  ...instructions: Array<[ChmodPermissionsWho, ChmodPermissionsWhat]>
): number {
  // TODO: the chmod API needs "set"/"add"/"remove" semantics like the cli
  // command. once those are here:
  //
  // - when "add": perms starts as file perms, instructions get logically ORed
  // - when "remove": perms start as file perms, instructions get logically XORed
  // - when "set": perms start as 0, instructions get logically ORed
  //
  // The current behavior is the "set" case.
  let perms = 0;

  for (const [who, what] of instructions) {
    const digit = (function interpretPermissionString() {
      switch (what) {
        case "none":
          return 0;

        case "execute":
        case "x":
          return 1;

        case "write":
        case "w":
          return 2;

        case "wx":
          return 3;

        case "read":
        case "r":
          return 4;

        case "rx":
          return 5;

        case "readwrite":
        case "rw":
          return 6;

        case "full":
        case "rwx":
          return 7;

        default: {
          const _what: never = what;
          throw new Error(`Invalid permissions string: ${what}`);
        }
      }
    })();

    const placeMask = (function interpretPermissionSubjectString() {
      switch (who) {
        case "user":
        case "u":
          return 100;

        case "group":
        case "g":
          return 10;

        case "others":
        case "o":
          return 1;

        case "all":
        case "a":
          return 111;

        case "ug":
          return 110;

        case "go":
          return 11;

        case "uo":
          return 101;

        default: {
          const _who: never = who;
          throw new Error(`Invalid permissions subject string: ${who}`);
        }
      }
    })();

    const octalString = String(digit * placeMask);
    const octalNum = parseInt(octalString, 8);

    perms |= octalNum;
  }

  return perms;
}

// The params are (permissions, path) instead of (path, permissions) in order
// to resemble the chmod CLI tool, which takes permissions first.
export function chmod(
  permissions:
    | number
    | string
    | Record<ChmodPermissionsWho, ChmodPermissionsWhat>,
  path: string | Path
) {
  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    String,
    "'path' argument must be either a string or a Path object"
  );

  let permNum: number;

  if (is(permissions, Number)) {
    permNum = permissions;
  } else if (is(permissions, String)) {
    const asNum = parseInt(permissions, 8);
    if (Number.isNaN(asNum)) {
      throw new Error(
        `Invalid permissions string: ${permissions}. It should be an octal-representation number, like "750".`
      );
    } else {
      permNum = asNum;
    }
  } else if (is(permissions, Object)) {
    permNum = permsFor(...(Object.entries(permissions) as any));
  } else {
    throw makeErrorWithProperties(
      "'permissions' argument must be a number, string, or object",
      { received: permissions },
      TypeError
    );
  }

  os.chmod(path, permNum);
}

setHelpText(chmod, chmodHelp);
