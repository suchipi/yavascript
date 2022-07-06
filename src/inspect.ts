// FROM: https://gist.github.com/matmen/2c9ad93be354740f6c740a4187691568

"use strict";

export default function inspect(
  value: any,
  { depth = 2, hidden = false } = {}
): string {
  if (is.number(value)) return `${value}`;
  if (is.regexp(value)) return `${value}`;
  if (is.bigint(value)) return `${value}n`;
  if (is.nullish(value)) return `${value}`;
  if (is.boolean(value)) return `${value}`;
  if (is.function(value)) return `${value}`;
  if (is.error(value)) return `${value.stack}`;
  if (is.date(value)) return value.toISOString();

  if (is.string(value))
    return JSON.stringify(value)
      .replace(/'/g, "\\'")
      .replace(/\\"/g, '"')
      .replace(/^"(.*)"$/g, "'$1'");

  return oldInspect(value, { depth, hidden });
}

const is = {
  // typeof
  string: (v) => typeof v === "string",
  number: (v) => typeof v === "number",
  bigint: (v) => typeof v === "bigint",
  boolean: (v) => typeof v === "boolean",
  function: (v) => typeof v === "function",
  undefined: (v) => typeof v === "undefined",
  object: (v) => typeof v === "object" && !is.null(v),

  // instanceof
  date: (v) => v instanceof Date,
  error: (v) => v instanceof Error,
  regexp: (v) => v instanceof RegExp,
  promise: (v) => v instanceof Promise,

  null: (v) => v === null,
  array: (v) => Array.isArray(v),
  multi: (m, v) => m.some((k) => is[k](v)),
  digit: (v) => is.number(v) || is.bigint(v),
  nullish: (v) => is.null(v) || is.undefined(v),
};

function oldInspect(obj, { depth = 2, hidden = false } = {}) {
  const ctx = {
    depth,
    hidden,
    seen: [],
    stylize: (v) => v,
    showHidden: hidden,
  };

  return formatValue(ctx, obj, ctx.depth);
}

function hasOwn(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function arrayToHash(array) {
  var hash = {};

  array.forEach(function (val, idx) {
    hash[val] = true;
  });

  return hash;
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output: any[] = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwn(value, String(i))) {
      output.push(
        formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true)
      );
    } else {
      output.push("");
    }
  }
  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(
        formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)
      );
    }
  });
  return output;
}

function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}

function formatValue(ctx, value, recurseTimes) {
  if (is.multi(["digit", "string", "boolean", "nullish"], value))
    return inspect(value);

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  try {
    if (ctx.showHidden && Object.getOwnPropertyNames) {
      keys = Object.getOwnPropertyNames(value);
    }
  } catch (e) {
    // ignore
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (
    is.error(value) &&
    (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)
  ) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (is.function(value)) {
      var name = value.name ? ": " + value.name : "";
      return ctx.stylize("[Function" + name + "]", "special");
    }
    if (is.regexp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    }
    if (is.date(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), "date");
    }
    if (is.error(value)) {
      return formatError(value);
    }
  }

  var base = "",
    array = false,
    braces = ["{", "}"];

  // Make Array say that they are Array
  if (Array.isArray(value)) {
    array = true;
    braces = ["[", "]"];
  }

  // Make functions say that they are functions
  if (is.function(value)) {
    var n = value.name ? ": " + value.name : "";
    base = " [Function" + n + "]";
  }

  // Make RegExps say that they are RegExps
  if (is.regexp(value)) {
    base = " " + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (is.date(value)) {
    base = " " + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (is.error(value)) {
    base = " " + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (is.regexp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    } else {
      return ctx.stylize("[Object]", "special");
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = { value: void 0 };
  try {
    // ie6 › navigator.toString
    // throws Error: Object doesn't support this property or method
    desc.value = value[key];
  } catch (e) {
    // ignore
  }
  try {
    // ie10 › Object.getOwnPropertyDescriptor(window.location, 'hash')
    // throws TypeError: Object doesn't support this action
    if (Object.getOwnPropertyDescriptor) {
      desc = Object.getOwnPropertyDescriptor(value, key) || desc;
    }
  } catch (e) {
    // ignore
  }
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize("[Getter/Setter]", "special");
    } else {
      str = ctx.stylize("[Getter]", "special");
    }
  } else {
    if (desc.set) {
      str = ctx.stylize("[Setter]", "special");
    }
  }
  if (!hasOwn(visibleKeys, key)) {
    name = "[" + key + "]";
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (is.null(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf("\n") > -1) {
        if (array) {
          str = str
            .split("\n")
            .map(function (line) {
              return "  " + line;
            })
            .join("\n")
            .substr(2);
        } else {
          str =
            "\n" +
            str
              .split("\n")
              .map(function (line) {
                return "   " + line;
              })
              .join("\n");
        }
      }
    } else {
      str = ctx.stylize("[Circular]", "special");
    }
  }
  if (is.undefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify("" + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, "name");
    } else {
      name = name
        .replace(/'/g, "\\'")
        .replace(/\\"/g, '"')
        .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, "string");
    }
  }

  return name + ": " + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf("\n") >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);

  if (length > 60) {
    return (
      braces[0] +
      (base === "" ? "" : base + "\n ") +
      " " +
      output.join(",\n  ") +
      " " +
      braces[1]
    );
  }

  return braces[0] + base + " " + output.join(", ") + " " + braces[1];
}
