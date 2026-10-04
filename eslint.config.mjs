import {
  defineConfig,
  globalIgnores,
} from "eslint/config";

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const persistenceHydrationFiles = [
  "src/features/learning/assessment/use-assessment-session.ts",
  "src/features/learning/prediction-activity.tsx",
  "src/features/learning/problems/beam-statics-problem-activity.tsx",
  "src/features/learning/bending/bending-problem-activity.tsx",
  "src/features/learning/otto/otto-problem-activity.tsx",
  "src/features/learning/progress/activity-progress-boundary.tsx",
  "src/features/learning/progress/progress-overview.tsx",
];

const testFiles = [
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.integration.test.ts",
  "**/*.integration.test.tsx",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  /*
   * These components intentionally synchronize React state
   * with an external persistence system (IndexedDB / Dexie).
   *
   * The React rule is useful for ordinary derived-state
   * effects, but these effects represent hydration,
   * persistence status, or external-store projection.
   *
   * Keep the exception narrowly scoped to the files that
   * own that persistence boundary.
   */
  {
    files:
      persistenceHydrationFiles,

    rules: {
      "react-hooks/set-state-in-effect":
        "off",
    },
  },

  /*
   * Repository test doubles intentionally implement the full
   * interface even when a particular argument is irrelevant
   * to the scenario. A leading underscore explicitly marks
   * those contract parameters as intentionally unused.
   */
  {
    files:
      testFiles,

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern:
            "^_",

          varsIgnorePattern:
            "^_",

          caughtErrorsIgnorePattern:
            "^_",
        },
      ],
    },
  },

  /*
   * This regression test deliberately constructs malformed
   * persistence input in order to verify defensive rejection.
   * Keep the escape hatch confined to that test file only.
   */
  {
    files: [
      "src/features/learning/progress/module-progress-aggregation.test.ts",
    ],

    rules: {
      "@typescript-eslint/no-explicit-any":
        "off",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;