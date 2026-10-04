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

const ottoDirectory =
  join(
    process.cwd(),
    "src",
    "domain",
    "engineering",
    "thermodynamics",
    "otto",
  );

function collectProductionFiles(
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
        return collectProductionFiles(
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
  "Ideal Otto Engineering Core architecture",
  () => {
    it(
      "does not depend on UI, content, learning, infrastructure, or visualization layers",
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
          of collectProductionFiles(
            ottoDirectory,
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

    it(
      "does not access browser or persistence APIs",
      () => {
        for (
          const file
          of collectProductionFiles(
            ottoDirectory,
          )
        ) {
          const source =
            readFileSync(
              file,
              "utf8",
            );

          for (
            const forbidden
            of [
              "window.",
              "document.",
              "localStorage",
              "sessionStorage",
              "indexedDB",
            ]
          ) {
            expect(
              source,
            ).not.toContain(
              forbidden,
            );
          }
        }
      },
    );
  },
);