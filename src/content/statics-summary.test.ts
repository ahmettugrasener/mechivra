import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
} from "@/content/registry";

import {
  staticsSummaryDefinition,
} from "@/content/statics-summary";

import {
  getSourcesByIds,
} from "@/content/source-access";

describe(
  "Statics summary definition",
  () => {
    it(
      "belongs to the final Statics summary activity",
      () => {
        const activity =
          getActivitiesForModule(
            "module-simply-supported-beam",
          ).find(
            (candidate) =>
              candidate.id ===
              staticsSummaryDefinition
                .activityId,
          );

        expect(
          activity,
        ).toBeDefined();

        expect(
          activity?.type,
        ).toBe(
          "summary",
        );
      },
    );

    it(
      "contains explicit capabilities, assumptions, and limitations",
      () => {
        expect(
          staticsSummaryDefinition
            .capabilities.length,
        ).toBeGreaterThanOrEqual(
          4,
        );

        expect(
          staticsSummaryDefinition
            .assumptions.length,
        ).toBeGreaterThanOrEqual(
          5,
        );

        expect(
          staticsSummaryDefinition
            .limitations.length,
        ).toBeGreaterThanOrEqual(
          5,
        );
      },
    );

    it(
      "uses unique summary item IDs",
      () => {
        const ids = [
          ...staticsSummaryDefinition
            .capabilities,

          ...staticsSummaryDefinition
            .assumptions,

          ...staticsSummaryDefinition
            .limitations,
        ].map(
          (item) =>
            item.id,
        );

        expect(
          new Set(
            ids,
          ).size,
        ).toBe(
          ids.length,
        );
      },
    );

    it(
      "references an existing scientific source",
      () => {
        const sources =
          getSourcesByIds(
            staticsSummaryDefinition
              .sourceIds,
          );

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
  },
);