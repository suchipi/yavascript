const { defineConfig } = require("vitest/config");
const rootDir = require("../../root-dir");

module.exports = defineConfig({
  root: rootDir(),
  test: {
    setupFiles: [
      require.resolve("./go-to-root"),
      require.resolve("./first-base-sanitizers"),
      require.resolve("./kill-leftover-processes.ts"),
    ],
    include: ["meta/tests/src/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "dist/**",
      "meta/generated-docs/**",
      "meta/tests/fixtures/**",
    ],
  },
});
