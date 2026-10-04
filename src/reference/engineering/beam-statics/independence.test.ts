import {
  readFileSync,
  readdirSync,
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
    "beam-statics",
  );

const prohibitedProductionIdentifiers = [
  "beamStaticsModel",
  "evaluateBeamMomentNm",
  "evaluateBeamShearN",
] as const;

function extractImportDeclarations(
  source: string,
): readonly string[] {
  return (
    source.match(
      /import[\s\S]*?from\s+["'][^"']+["'];?/g,
    ) ?? []
  );
}

describe(
  "Beam statics reference independence",
  () => {
    it(
      "does not import production beam statics calculation code",
      () => {
        const sourceFiles =
          readdirSync(
            referenceDirectory,
          ).filter(
            (fileName) =>
              fileName.endsWith(
                ".ts",
              ) &&
              !fileName.endsWith(
                ".test.ts",
              ),
          );

        for (
          const fileName
          of sourceFiles
        ) {
          const source =
            readFileSync(
              join(
                referenceDirectory,
                fileName,
              ),
              "utf8",
            );

          const imports =
            extractImportDeclarations(
              source,
            );

          for (
            const importDeclaration
            of imports
          ) {
            expect(
              importDeclaration,
            ).not.toMatch(
              /@\/domain\/engineering\/beam\/statics/,
            );

            for (
              const identifier
              of prohibitedProductionIdentifiers
            ) {
              expect(
                importDeclaration,
              ).not.toContain(
                identifier,
              );
            }
          }
        }
      },
    );

    it(
      "does not import production statics functions through the engineering root barrel",
      () => {
        const sourceFiles =
          readdirSync(
            referenceDirectory,
          ).filter(
            (fileName) =>
              fileName.endsWith(
                ".ts",
              ) &&
              !fileName.endsWith(
                ".test.ts",
              ),
          );

        for (
          const fileName
          of sourceFiles
        ) {
          const source =
            readFileSync(
              join(
                referenceDirectory,
                fileName,
              ),
              "utf8",
            );

          const imports =
            extractImportDeclarations(
              source,
            );

          for (
            const importDeclaration
            of imports
          ) {
            const importsEngineeringRoot =
              /from\s+["']@\/domain\/engineering["']/.test(
                importDeclaration,
              );

            if (
              !importsEngineeringRoot
            ) {
              continue;
            }

            for (
              const identifier
              of prohibitedProductionIdentifiers
            ) {
              expect(
                importDeclaration,
              ).not.toContain(
                identifier,
              );
            }
          }
        }
      },
    );
  },
);