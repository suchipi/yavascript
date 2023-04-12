import { hasColors } from "./has-colors";

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
