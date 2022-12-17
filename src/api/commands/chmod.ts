import * as os from "os";

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
    | [ChmodPermissionsWho, ChmodPermissionsWhat]
    | Array<[ChmodPermissionsWho, ChmodPermissionsWhat]>
    | Record<ChmodPermissionsWho, ChmodPermissionsWhat>,
  path: string
) {
  const permNum = (function parseInputPermissions() {
    if (typeof permissions === "number") {
      return permissions;
    } else if (typeof permissions === "string") {
      const asNum = parseInt(permissions, 8);
      if (Number.isNaN(asNum)) {
        throw new Error(
          `Invalid permissions string: ${permissions}. It should be an octal-representation number, like "750".`
        );
      } else {
        return asNum;
      }
    } else if (Array.isArray(permissions)) {
      if (permissions.length === 2) {
        if (
          typeof permissions[0] === "string" &&
          typeof permissions[1] === "string"
        ) {
          return permsFor(permissions as any);
        } else {
          return permsFor(...(permissions as any));
        }
      }
    } else if (typeof permissions === "object" && permissions != null) {
      return permsFor(...(Object.entries(permissions) as any));
    }

    throw new Error(
      `Invalid 'permissions' argument: ${permissions}. It should be a number, octal string, array, or object.`
    );
  })();

  os.chmod(path, permNum);
}
