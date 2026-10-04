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

const progressDirectory =
  join(
    process.cwd(),
    "src",
    "domain",
    "progress",
  );

function collectProductionFiles(
  directory:
    string,
): readonly string[] {
  const entries =
    readdirSync(
      directory,
    );

  const files:
    string[] =
    [];

  for (
    const entry
    of entries
  ) {
    const fullPath =
      join(
        directory,
        entry,
      );

    const stats =
      statSync(
        fullPath,
      );

    if (
      stats.isDirectory()
    ) {
      files.push(
        ...collectProductionFiles(
          fullPath,
        ),
      );

      continue;
    }

    if (
      !entry.endsWith(
        ".ts",
      ) &&
      !entry.endsWith(
        ".tsx",
      )
    ) {
      continue;
    }

    if (
      entry.endsWith(
        ".test.ts",
      ) ||
      entry.endsWith(
        ".test.tsx",
      )
    ) {
      continue;
    }

    files.push(
      fullPath,
    );
  }

  return files;
}

function extractImportDeclarations(
  source:
    string,
): readonly string[] {
  return (
    source.match(
      /import[\s\S]*?from\s+["'][^"']+["'];?/g,
    ) ??
    []
  );
}

describe(
  "Progress Domain architecture",
  () => {
    it(
      "remains independent from UI, frameworks, content, and persistence implementations",
      () => {
        const sourceFiles =
          collectProductionFiles(
            progressDirectory,
          );

        const prohibitedPatterns = [
          /from\s+["']react["']/,
          /from\s+["']next\//,
          /from\s+["']next-intl/,
          /from\s+["']dexie["']/,
          /from\s+["']@\/app/,
          /from\s+["']@\/components/,
          /from\s+["']@\/features/,
          /from\s+["']@\/content/,
          /from\s+["']@\/infrastructure/,
          /from\s+["']@\/visualization/,
        ] as const;

        for (
          const sourceFile
          of sourceFiles
        ) {
          const source =
            readFileSync(
              sourceFile,
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
            for (
              const pattern
              of prohibitedPatterns
            ) {
              expect(
                importDeclaration,
              ).not.toMatch(
                pattern,
              );
            }
          }
        }
      },
    );

    it(
      "contains no browser persistence globals",
      () => {
        const sourceFiles =
          collectProductionFiles(
            progressDirectory,
          );

        const prohibitedGlobals = [
          "localStorage",
          "sessionStorage",
          "indexedDB",
          "window.",
          "document.",
        ] as const;

        for (
          const sourceFile
          of sourceFiles
        ) {
          const source =
            readFileSync(
              sourceFile,
              "utf8",
            );

          for (
            const globalName
            of prohibitedGlobals
          ) {
            expect(
              source,
            ).not.toContain(
              globalName,
            );
          }
        }
      },
    );
  },
);