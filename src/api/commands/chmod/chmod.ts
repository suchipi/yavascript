import * as os from "quickjs:os";
import { is } from "../../is";
import { assert } from "../../assert";
import { makeErrorWithProperties } from "../../../error-with-properties";
import type { Path } from "../../path";
import { appendSlashIfWindowsDriveLetter } from "../../path/_win32Helpers";
import { types } from "../../types";

const PERMISSIONS = {
  user: {
    read: 256,
    write: 128,
    execute: 64,
  },
  group: {
    read: 32,
    write: 16,
    execute: 8,
  },
  others: {
    read: 4,
    write: 2,
    execute: 1,
  },
  // not yet implemented
  // sticky: 512,
  // setgid: 1024,
  // setuid: 2048,
  // type: 258048,
};

function permsNumberFor(
  initialPerms: number,
  operation: Chmod.Operation,
  instructions: Partial<Record<Chmod.Who, Chmod.Permission>>
): number {
  let perms = initialPerms;
  if (operation === "set") {
    perms = 0;
  }

  for (const pair of Object.entries(instructions)) {
    const [who, permission] = pair as [Chmod.Who, Chmod.Permission];
    const parsedWho: { user: boolean; group: boolean; others: boolean } =
      (function interpretPermissionSubjectString() {
        let user = false;
        let group = false;
        let others = false;
        switch (who) {
          case "user":
          case "u": {
            user = true;
            break;
          }

          case "group":
          case "g": {
            group = true;
            break;
          }

          case "others":
          case "o": {
            others = true;
            break;
          }

          case "all":
          case "a": {
            user = true;
            group = true;
            others = true;
            break;
          }

          case "ug": {
            user = true;
            group = true;
            break;
          }

          case "go": {
            user = true;
            group = true;
            break;
          }

          case "uo": {
            user = true;
            others = true;
            break;
          }

          default: {
            const _who: never = who;
            throw new Error(`Invalid permissions subject string: ${who}`);
          }
        }

        return { user, group, others };
      })();

    const parsedPermission: {
      read: boolean;
      write: boolean;
      execute: boolean;
    } = (function interpretPermissionString() {
      let read = false;
      let write = false;
      let execute = false;

      switch (permission) {
        case "none": {
          break;
        }

        case "execute":
        case "x": {
          execute = true;
          break;
        }

        case "write":
        case "w": {
          write = true;
          break;
        }

        case "wx": {
          write = true;
          execute = true;
          break;
        }

        case "read":
        case "r": {
          read = true;
          break;
        }

        case "rx": {
          read = true;
          execute = true;
          break;
        }

        case "readwrite":
        case "rw": {
          read = true;
          write = true;
          break;
        }

        case "full":
        case "rwx": {
          read = true;
          write = true;
          execute = true;
          break;
        }

        default: {
          const _what: never = permission;
          throw new Error(`Invalid permissions string: ${permission}`);
        }
      }

      return { read, write, execute };
    })();

    let bitsToApply = 0;

    if (parsedWho.user) {
      if (parsedPermission.read) {
        bitsToApply += PERMISSIONS.user.read;
      }
      if (parsedPermission.write) {
        bitsToApply += PERMISSIONS.user.write;
      }
      if (parsedPermission.execute) {
        bitsToApply += PERMISSIONS.user.execute;
      }
    }
    if (parsedWho.group) {
      if (parsedPermission.read) {
        bitsToApply += PERMISSIONS.group.read;
      }
      if (parsedPermission.write) {
        bitsToApply += PERMISSIONS.group.write;
      }
      if (parsedPermission.execute) {
        bitsToApply += PERMISSIONS.group.execute;
      }
    }
    if (parsedWho.others) {
      if (parsedPermission.read) {
        bitsToApply += PERMISSIONS.others.read;
      }
      if (parsedPermission.write) {
        bitsToApply += PERMISSIONS.others.write;
      }
      if (parsedPermission.execute) {
        bitsToApply += PERMISSIONS.others.execute;
      }
    }

    switch (operation) {
      case "add":
      case "set": {
        perms |= bitsToApply;
        break;
      }
      case "remove": {
        perms ^= bitsToApply;
        break;
      }
      default: {
        const _operation: never = operation;
        throw new Error(`Invalid chmod operation: ${operation}`);
      }
    }
  }

  return perms;
}

export interface Chmod {
  (permissions: number | string, path: string | Path): void;
  <Operation extends Chmod.Operation>(
    operation: Operation,
    permissions: Operation extends "set"
      ? Partial<Record<Chmod.Who, Chmod.Permission>>
      : Record<Chmod.Who, Chmod.Permission>,
    path: string | Path
  ): void;
}

// The params are (permissions, path) instead of (path, permissions) in order
// to resemble the chmod CLI tool, which takes permissions first.
export const chmod: Chmod = (
  ...args:
    | [permissions: number | string, path: string | Path]
    | [
        operation: Chmod.Operation,
        permissions: Partial<Record<Chmod.Who, Chmod.Permission>>,
        path: string | Path
      ]
): void => {
  let permissions:
    | number
    | string
    | Partial<Record<Chmod.Who, Chmod.Permission>>;
  let path: string | Path;
  let operation: Chmod.Operation = "set";

  if (args.length === 2) {
    [permissions, path] = args;
    assert.type(
      permissions,
      types.or(types.string, types.number),
      "when 'operation' argument is omitted, 'permissions' argument must be either an octal string or a number"
    );
  } else if (args.length === 3) {
    [operation, permissions, path] = args;
    assert.type(
      operation,
      types.or(
        types.exactString("add"),
        types.exactString("set"),
        types.exactString("remove")
      ),
      "'operation' argument must be either 'add', 'set', or 'remove'"
    );
    assert.type(
      permissions,
      types.object,
      "when 'operation' argument is present, 'permissions' argument must be an object"
    );
  } else {
    throw new Error("chmod must be called with either 2 or 3 arguments.");
  }

  if (is(path, types.Path)) {
    path = path.toString();
  }

  assert.type(
    path,
    String,
    "'path' argument must be either a string or a Path object"
  );

  path = appendSlashIfWindowsDriveLetter(path);

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
    const currentPerms = os.stat(path).mode;
    permNum = permsNumberFor(currentPerms, operation, permissions);
  } else {
    throw makeErrorWithProperties(
      "'permissions' argument must be a number, string, or object",
      { received: permissions },
      TypeError
    );
  }

  os.chmod(path, permNum);
};

export namespace Chmod {
  export type Who =
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

  export type Operation = "add" | "set" | "remove";

  export type Permission =
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
}
