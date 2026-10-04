import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BEAM_STATICS_MODEL_ID,
  beamStaticsModel,
  createSimplySupportedBeamStateFromDisplayInput,
} from "@/domain/engineering";

import {
  getInteractiveDefinition,
} from "@/content/interactives";

import {
  getLearningActivityNavigation,
} from "@/content/learning-navigation";

import {
  getPredictionDefinition,
} from "@/content/predictions";

import {
  getActivitiesForModule,
} from "@/content/registry";

import {
  isCompletionRuleCompatibleWithActivityType,
} from "@/domain/learning/completion";

import {
  getLearningActivityRendererKind,
} from "@/features/learning/activity-renderer-kind";

describe(
  "Learning Engine integration",
  () => {
    const staticsActivities =
      getActivitiesForModule(
        "module-simply-supported-beam",
      );

    it(
      "preserves the intended six-step Statics learning sequence",
      () => {
        expect(
          staticsActivities.map(
            (activity) => ({
              id:
                activity.id,

              type:
                activity.type,

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

            completionRule:
              "reached_end",
          },

          {
            id:
              "activity-ssb-02",

            type:
              "concept",

            completionRule:
              "reached_end",
          },

          {
            id:
              "activity-ssb-03",

            type:
              "prediction",

            completionRule:
              "submitted_prediction",
          },

          {
            id:
              "activity-ssb-04",

            type:
              "interactive",

            completionRule:
              "meaningful_interaction",
          },

          {
            id:
              "activity-ssb-05",

            type:
              "problem",

            completionRule:
              "submitted_attempt",
          },

          {
            id:
              "activity-ssb-06",

            type:
              "summary",

            completionRule:
              "reached_end",
          },
        ]);
      },
    );

    it(
      "resolves contiguous navigation across the complete Statics module",
      () => {
        for (
          let index = 0;
          index <
          staticsActivities.length;
          index += 1
        ) {
          const activity =
            staticsActivities[
              index
            ];

          if (!activity) {
            throw new Error(
              "Expected Statics activity.",
            );
          }

          const navigation =
            getLearningActivityNavigation(
              "module-simply-supported-beam",
              activity.id,
            );

          expect(
            navigation,
          ).toBeDefined();

          expect(
            navigation?.position,
          ).toBe(
            index + 1,
          );

          expect(
            navigation?.total,
          ).toBe(6);

          expect(
            navigation?.previous
              ?.id ??
              null,
          ).toBe(
            index === 0
              ? null
              : staticsActivities[
                  index - 1
                ]?.id ??
                  null,
          );

          expect(
            navigation?.next
              ?.id ??
              null,
          ).toBe(
            index ===
              staticsActivities
                .length -
                1
              ? null
              : staticsActivities[
                  index + 1
                ]?.id ??
                  null,
          );
        }
      },
    );

    it(
      "assigns every Statics activity to a compatible renderer and completion rule",
      () => {
        for (
          const activity
          of staticsActivities
        ) {
          expect(
            getLearningActivityRendererKind(
              activity.type,
            ),
          ).toBeDefined();

          expect(
            isCompletionRuleCompatibleWithActivityType(
              activity.type,
              activity
                .completionRule.type,
            ),
          ).toBe(true);
        }
      },
    );

    it(
      "connects the Statics prediction activity to its prediction definition",
      () => {
        const predictionActivity =
          staticsActivities.find(
            (activity) =>
              activity.id ===
              "activity-ssb-03",
          );

        const prediction =
          getPredictionDefinition(
            "activity-ssb-03",
          );

        expect(
          predictionActivity
            ?.type,
        ).toBe(
          "prediction",
        );

        expect(
          prediction,
        ).toBeDefined();

        expect(
          prediction
            ?.activityId,
        ).toBe(
          predictionActivity
            ?.id,
        );
      },
    );

    it(
      "connects the Statics interactive activity to the verified Engineering Core model",
      () => {
        const interactiveActivity =
          staticsActivities.find(
            (activity) =>
              activity.id ===
              "activity-ssb-04",
          );

        const interactive =
          getInteractiveDefinition(
            "activity-ssb-04",
          );

        expect(
          interactiveActivity
            ?.type,
        ).toBe(
          "interactive",
        );

        expect(
          interactive,
        ).toBeDefined();

        expect(
          interactive
            ?.engineeringModelId,
        ).toBe(
          BEAM_STATICS_MODEL_ID,
        );
      },
    );

    it(
      "reproduces the verified centered-beam reference state from the interactive initial configuration",
      () => {
        const definition =
          getInteractiveDefinition(
            "activity-ssb-04",
          );

        if (
          !definition ||
          definition.kind !==
            "beam_statics_point_load_explorer"
        ) {
          throw new Error(
            "Expected Statics beam explorer.",
          );
        }

        const state =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value:
                  definition
                    .configuration
                    .spanM,

                unit: "m",
              },

              pointLoad: {
                value:
                  definition
                    .configuration
                    .pointLoad
                    .initial,

                unit: "kN",
              },

              loadPosition: {
                value:
                  definition
                    .configuration
                    .loadPosition
                    .initial,

                unit: "m",
              },
            },
          );

        if (!state.state) {
          throw new Error(
            "Expected valid interactive initial state.",
          );
        }

        const result =
          beamStaticsModel.evaluate(
            state.state,
          );

        if (!result.values) {
          throw new Error(
            "Expected valid Statics result.",
          );
        }

        expect(
          result.values
            .leftReactionN,
        ).toBeCloseTo(
          5_000,
          12,
        );

        expect(
          result.values
            .rightReactionN,
        ).toBeCloseTo(
          5_000,
          12,
        );

        expect(
          result.values
            .moment.maximum
            .valueNm,
        ).toBeCloseTo(
          10_000,
          12,
        );
      },
    );

    it(
      "physically confirms the prediction relationship when the load moves toward the right support",
      () => {
        const centeredState =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4,
                unit: "m",
              },

              pointLoad: {
                value: 10,
                unit: "kN",
              },

              loadPosition: {
                value: 2,
                unit: "m",
              },
            },
          );

        const rightShiftedState =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4,
                unit: "m",
              },

              pointLoad: {
                value: 10,
                unit: "kN",
              },

              loadPosition: {
                value: 3,
                unit: "m",
              },
            },
          );

        if (
          !centeredState.state ||
          !rightShiftedState.state
        ) {
          throw new Error(
            "Expected valid beam states.",
          );
        }

        const centered =
          beamStaticsModel.evaluate(
            centeredState.state,
          );

        const shifted =
          beamStaticsModel.evaluate(
            rightShiftedState.state,
          );

        if (
          !centered.values ||
          !shifted.values
        ) {
          throw new Error(
            "Expected valid Statics results.",
          );
        }

        expect(
          shifted.values
            .leftReactionN,
        ).toBeLessThan(
          centered.values
            .leftReactionN,
        );

        expect(
          shifted.values
            .rightReactionN,
        ).toBeGreaterThan(
          centered.values
            .rightReactionN,
        );

        expect(
          shifted.values
            .leftReactionN +
            shifted.values
              .rightReactionN,
        ).toBeCloseTo(
          10_000,
          12,
        );
      },
    );
  },
);