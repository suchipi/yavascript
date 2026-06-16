// In this file, we remove the layer internals from the global and re-export
// them. We do this because we want other files to be able to access these
// internals, but we want to lazy-load those files, and we don't want the
// globals to be visible to the user.

export const __yavascript_layer1_internals =
  globalThis.__yavascript_layer1_internals;
export const __yavascript_layer2_internals =
  globalThis.__yavascript_layer2_internals;
export const __yavascript_layer4_internals =
  globalThis.__yavascript_layer4_internals;

// @ts-ignore the operand of a delete operation must be optional
delete globalThis.__yavascript_layer1_internals;
// @ts-ignore the operand of a delete operation must be optional
delete globalThis.__yavascript_layer2_internals;
// @ts-ignore the operand of a delete operation must be optional
delete globalThis.__yavascript_layer4_internals;
