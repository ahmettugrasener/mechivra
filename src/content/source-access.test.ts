import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getSourceById,
  getSourcesByIds,
} from "@/content/source-access";

describe(
  "Source access",
  () => {
    it(
      "resolves the Statics scientific source",
      () => {
        const source =
          getSourceById(
            "source-mit-beam-displacements",
          );

        expect(
          source,
        ).toBeDefined();

        expect(
          source?.title,
        ).toBe(
          "Beam Displacements",
        );

        expect(
          source?.organization,
        ).toBe(
          "MIT OpenCourseWare",
        );
      },
    );

    it(
      "resolves source collections without duplicating records",
      () => {
        const sources =
          getSourcesByIds([
            "source-mit-beam-displacements",
          ]);

        expect(
          sources,
        ).toHaveLength(1);

        expect(
          sources[0]?.id,
        ).toBe(
          "source-mit-beam-displacements",
        );
      },
    );

    it(
      "throws for an unknown source ID",
      () => {
        expect(
          () =>
            getSourcesByIds([
              "source-does-not-exist",
            ]),
        ).toThrow(
          "Unknown source ID",
        );
      },
    );
  },
);