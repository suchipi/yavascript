export const forPrint: InspectOptions = {
  maxDepth: 8,
  noAmp: true,
  colours: true,
  indent: "  ",
  noSource: true,
};

export const forError: InspectOptions = {
  maxDepth: 1,
  noAmp: true,
  colours: false,
  indent: "",
  noSource: true,
};
