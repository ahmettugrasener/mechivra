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

const referenceDirectory =
  join(
    process.cwd(),
    "src",
    "reference",
    "engineering",
    "ideal-otto",
  );

function collectProductionReferenceFiles(
  directory:
    string,
): string[] {
  return readdirSync(
    directory,
  ).flatMap(
    (entry) => {
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
        return collectProductionReferenceFiles(
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
  "Ideal Otto reference independence",
  () => {
    it(
      "does not import the production Otto Engineering Core",
      () => {
        for (
          const file
          of collectProductionReferenceFiles(
            referenceDirectory,
          )
        ) {
          const source =
            readFileSync(
              file,
              "utf8",
            );

          expect(
            source,
          ).not.toContain(
            "@/domain/engineering/thermodynamics/otto",
          );

          expect(
            source,
          ).not.toContain(
            "evaluateIdealOtto",
          );

          expect(
            source,
          ).not.toContain(
            "createIdealOtto",
          );
        }
      },
    );

    it(
      "does not depend on UI, content, visualization, or infrastructure",
      () => {
        const forbidden = [
          "@/app/",
          "@/components/",
          "@/content/",
          "@/features/",
          "@/infrastructure/",
          "@/visualization/",
          "react",
          "next/",
        ];

        for (
          const file
          of collectProductionReferenceFiles(
            referenceDirectory,
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