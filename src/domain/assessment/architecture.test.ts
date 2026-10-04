import {
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";

import {
  join,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";

const assessmentDirectory =
  join(
    process.cwd(),
    "src",
    "domain",
    "assessment",
  );

function collectCoreFiles(
  directory:
    string,
): string[] {
  return readdirSync(
    directory,
  ).flatMap(
    (
      entry,
    ) => {
      const path =
        join(
          directory,
          entry,
        );

      if (
        statSync(
          path,
        ).isDirectory()
      ) {
        return collectCoreFiles(
          path,
        );
      }

      if (
        !path.endsWith(
          ".ts",
        ) ||
        path.endsWith(
          ".test.ts",
        )
      ) {
        return [];
      }

      return [
        path,
      ];
    },
  );
}

describe(
  "Assessment Core architecture",
  () => {
    it(
      "does not depend on React, Next, UI, visualization, or infrastructure",
      () => {
        const forbidden = [
          "react",
          "next/",
          "@/app/",
          "@/components/",
          "@/features/",
          "@/visualization/",
          "@/infrastructure/",
        ];

        for (
          const file
          of collectCoreFiles(
            assessmentDirectory,
          )
        ) {
          const source =
            readFileSync(
              file,
              "utf8",
            );

          for (
            const dependency
            of forbidden
          ) {
            expect(
              source,
            ).not.toContain(
              `from "${dependency}`,
            );

            expect(
              source,
            ).not.toContain(
              `from '${dependency}`,
            );
          }
        }
      },
    );
  },
);