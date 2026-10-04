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

const bendingDirectory =
  join(
    process.cwd(),
    "src",
    "domain",
    "engineering",
    "beam",
    "bending",
  );

function collectTypeScriptFiles(
  directory: string,
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
        return collectTypeScriptFiles(
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
  "Bending engineering architecture",
  () => {
    it(
      "does not import UI, content, infrastructure, or visualization layers",
      () => {
        const files =
          collectTypeScriptFiles(
            bendingDirectory,
          );

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

    it(
      "contains no browser-global dependencies",
      () => {
        const files =
          collectTypeScriptFiles(
            bendingDirectory,
          );

        const browserGlobals = [
          "window.",
          "document.",
          "localStorage",
          "sessionStorage",
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
            const global
            of browserGlobals
          ) {
            expect(
              source,
            ).not.toContain(
              global,
            );
          }
        }
      },
    );
  },
);