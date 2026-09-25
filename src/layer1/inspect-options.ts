let hasColors: (file?: FILE) => boolean;

// defer check for `yavascript` global until first time `hasColors` is called
const __hasColorsInitialValue = (file?: FILE): boolean => {
  // @ts-ignore checking global that isn't in project types
  if (typeof yavascript !== "undefined") {
    const std = require("quickjs:std") as typeof import("quickjs:std");
    const impl = (require("./has-colors") as typeof import("./has-colors"))
      .hasColors;
    hasColors = (file?: FILE) => impl(file ?? std.out);
  } else {
    hasColors = () => require("kleur").enabled;
  }

  return hasColors(file);
};

hasColors = __hasColorsInitialValue;

export const forPrint: (file?: FILE) => InspectOptions = (file) => ({
  maxDepth: 8,
  noAmp: true,
  colours: hasColors(file),
  indent: "  ",
  noSource: true,
});

export const forError: () => InspectOptions = () => ({
  maxDepth: 1,
  noAmp: true,
  colours: false,
  indent: "",
  noSource: true,
});
