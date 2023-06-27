let hasColors: () => boolean;

// defer check for `yavascript` global until first time `hasColors` is called
const __hasColorsInitialValue = (): boolean => {
  if (typeof yavascript !== "undefined") {
    hasColors = (require("./has-colors") as typeof import("./has-colors"))
      .hasColors;
  } else {
    hasColors = () => require("kleur").enabled;
  }

  return hasColors();
};

hasColors = __hasColorsInitialValue;

export const forPrint: () => InspectOptions = () => ({
  maxDepth: 8,
  noAmp: true,
  colours: hasColors(),
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
