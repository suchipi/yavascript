// See https://github.com/tc39/proposal-regex-escaping
export function escape(s: any): string {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function install(_RegExp: any) {
  _RegExp.escape = escape;
}
