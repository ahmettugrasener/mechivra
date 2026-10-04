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

const engineeringDirectory =
  join(
    process.cwd(),
    "src",
    "domain",
    "engineering",
  );

function collectSourceFiles(
  directory: string,
): readonly string[] {
  const entries =
    readdirSync(directory);

  const files: string[] = [];

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
      statSync(fullPath);

    if (
      stats.isDirectory()
    ) {
      files.push(
        ...collectSourceFiles(
          fullPath,
        ),
      );

      continue;
    }

    if (
      !entry.endsWith(".ts") &&
      !entry.endsWith(".tsx")
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

    files.push(fullPath);
  }

  return files;
}

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
  "Engineering Core architecture",
  () => {
    it(
      "contains no UI, framework, infrastructure, content, or reference dependencies",
      () => {
        const sourceFiles =
          collectSourceFiles(
            engineeringDirectory,
          );

        const prohibitedImportPatterns = [
          /from\s+["']react["']/,
          /from\s+["']next\//,
          /from\s+["']next-intl/,
          /from\s+["']@\/components/,
          /from\s+["']@\/visualization/,
          /from\s+["']@\/infrastructure/,
          /from\s+["']@\/content/,
          /from\s+["']@\/reference/,
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
              of prohibitedImportPatterns
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
      "keeps production engineering source free from browser-specific globals",
      () => {
        const sourceFiles =
          collectSourceFiles(
            engineeringDirectory,
          );

        const prohibitedBrowserGlobals = [
          "window.",
          "document.",
          "localStorage",
          "sessionStorage",
          "indexedDB",
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
            const browserGlobal
            of prohibitedBrowserGlobals
          ) {
            expect(
              source,
            ).not.toContain(
              browserGlobal,
            );
          }
        }
      },
    );
  },
);