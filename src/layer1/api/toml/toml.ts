import iarnaTOML from "@iarna/toml";

export const TOML = {
  parse(data: string): { [key: string]: any } {
    return iarnaTOML.parse(data);
  },
  stringify(data: { [key: string]: any }): string {
    return iarnaTOML.stringify(data);
  },
};
