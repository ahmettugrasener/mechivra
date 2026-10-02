import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  test: {
    environment: "jsdom",

    setupFiles: [
      "./src/test/setup.ts",
    ],

    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
    ],

    coverage: {
      provider: "v8",

      reporter: [
        "text",
        "html",
        "json-summary",
      ],

      include: [
        "src/domain/**/*.ts",
        "src/content/**/*.ts",
        "src/components/**/*.tsx",
      ],

      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/test/**",
      ],
    },
  },
});