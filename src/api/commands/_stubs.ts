import { makeGetterPropertyDescriptorMap } from "../../lazy-load";

export default makeGetterPropertyDescriptorMap({
  mkdir() {
    throw new Error(
      "'mkdir' is not part of the yavascript API. Use 'ensureDir' instead"
    );
  },
  cp() {
    throw new Error(
      "'cp' is not part of the yavascript API. Use 'copy' instead"
    );
  },
  rm() {
    throw new Error(
      "'rm' is not part of the yavascript API. Use 'remove' instead"
    );
  },
});
