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
    "beam-bending",
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
  "Beam bending reference independence",
  () => {
    it(
      "does not import the production Engineering Core",
      () => {
        const files =
          collectProductionReferenceFiles(
            referenceDirectory,
          );

        for (
          const file
          of files
        ) {
          const source =
            readFileSync(
              file,
              "utf8",
            );

          expect(
            source,
          ).not.toContain(
            "@/domain/engineering/",
          );
        }
      },
    );

    it(
      "does not import UI, learning, content, or visualization code",
      () => {
        const files =
          collectProductionReferenceFiles(
            referenceDirectory,
          );

        const forbidden = [
          "@/app/",
          "@/components/",
          "@/content/",
          "@/domain/learning/",
          "@/features/",
          "@/infrastructure/",
          "@/visualization/",
          "react",
          "next/",
        ];

        for (
          const file
          of files
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