export function mkdir() {
  throw new Error(
    "'mkdir' is not part of the yavascript API. Use 'ensureDir' instead"
  );
}

export function cp() {
  throw new Error("'cp' is not part of the yavascript API. Use 'copy' instead");
}
