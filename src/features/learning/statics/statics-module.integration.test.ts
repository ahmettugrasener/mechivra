import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getInteractiveDefinition,
} from "@/content/interactives";

import {
  getPredictionDefinition,
} from "@/content/predictions";

import {
  getActivitiesForModule,
} from "@/content/registry";

import {
  getNumericProblemDefinition,
} from "@/content/statics-problems";

import {
  staticsSummaryDefinition,
} from "@/content/statics-summary";

import {
  getWorkedExampleDefinition,
} from "@/content/worked-examples";

import {
  BEAM_STATICS_MODEL_ID,
} from "@/domain/engineering";

describe(
  "Statics module final integration",
  () => {
    const activities =
      getActivitiesForModule(
        "module-simply-supported-beam",
      );

    it(
      "contains the complete six-activity learning sequence",
      () => {
        expect(
          activities.map(
            (activity) => ({
              id:
                activity.id,

              type:
                activity.type,

              order:
                activity.order,

              completionRule:
                activity
                  .completionRule
                  .type,
            }),
          ),
        ).toEqual([
          {
            id:
              "activity-ssb-01",

            type:
              "problem_context",

            order: 1,

            completionRule:
              "reached_end",
          },

          {
            id:
              "activity-ssb-02",

            type:
              "concept",

            order: 2,

            completionRule:
              "reached_end",
          },

          {
            id:
              "activity-ssb-03",

            type:
              "prediction",

            order: 3,

            completionRule:
              "submitted_prediction",
          },

          {
            id:
              "activity-ssb-04",

            type:
              "interactive",

            order: 4,

            completionRule:
              "meaningful_interaction",
          },

          {
            id:
              "activity-ssb-05",

            type:
              "problem",

            order: 5,

            completionRule:
              "submitted_attempt",
          },

          {
            id:
              "activity-ssb-06",

            type:
              "summary",

            order: 6,

            completionRule:
              "reached_end",
          },
        ]);
      },
    );

    it(
      "contains bilingual learning content in every Statics activity",
      () => {
        for (
          const activity
          of activities
        ) {
          expect(
            activity.title.tr
              .trim().length,
          ).toBeGreaterThan(0);

          expect(
            activity.title.en
              .trim().length,
          ).toBeGreaterThan(0);

          expect(
            activity.contentBlocks
              .length,
          ).toBeGreaterThan(0);

          for (
            const block
            of activity.contentBlocks
          ) {
            switch (
              block.type
            ) {
              case "heading":
              case "paragraph":
                expect(
                  block.text.tr
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                expect(
                  block.text.en
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                break;

              case "equation":
                expect(
                  block.expression
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                break;

              case "callout":
                expect(
                  block.body.tr
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                expect(
                  block.body.en
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                break;

              case "figure":
                expect(
                  block.alt.tr
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                expect(
                  block.alt.en
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                break;
            }
          }
        }
      },
    );

    it(
      "keeps the scientific source attached to all six activities",
      () => {
        for (
          const activity
          of activities
        ) {
          expect(
            activity.sourceIds,
          ).toContain(
            "source-mit-beam-displacements",
          );
        }
      },
    );

    it(
      "connects the concept activity to the worked example",
      () => {
        const definition =
          getWorkedExampleDefinition(
            "activity-ssb-02",
          );

        expect(
          definition?.kind,
        ).toBe(
          "beam_statics_worked_example",
        );

        expect(
          definition?.input,
        ).toEqual({
          spanM: 4,
          pointLoadKN: 10,
          loadPositionM: 1,
        });
      },
    );

    it(
      "connects the prediction activity to its prediction engine",
      () => {
        const definition =
          getPredictionDefinition(
            "activity-ssb-03",
          );

        expect(
          definition,
        ).toBeDefined();

        expect(
          definition?.options,
        ).toHaveLength(3);
      },
    );

    it(
      "connects the interactive activity to the verified Statics model",
      () => {
        const definition =
          getInteractiveDefinition(
            "activity-ssb-04",
          );

        expect(
          definition?.engineeringModelId,
        ).toBe(
          BEAM_STATICS_MODEL_ID,
        );
      },
    );

    it(
      "connects the problem activity to a six-field Engineering Core assessment",
      () => {
        const definition =
          getNumericProblemDefinition(
            "activity-ssb-05",
          );

        expect(
          definition?.kind,
        ).toBe(
          "beam_statics_numeric_problem",
        );

        expect(
          definition?.fields,
        ).toHaveLength(6);
      },
    );

    it(
      "connects the final activity to assumptions, limitations, and source metadata",
      () => {
        expect(
          staticsSummaryDefinition
            .activityId,
        ).toBe(
          "activity-ssb-06",
        );

        expect(
          staticsSummaryDefinition
            .assumptions.length,
        ).toBeGreaterThan(0);

        expect(
          staticsSummaryDefinition
            .limitations.length,
        ).toBeGreaterThan(0);

        expect(
          staticsSummaryDefinition
            .sourceIds,
        ).toContain(
          "source-mit-beam-displacements",
        );
      },
    );
  },
);