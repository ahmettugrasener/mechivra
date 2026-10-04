import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getNumericProblemDefinition,
} from "@/content/statics-problems";

import {
  createBeamStaticsProblemAnswerKey,
} from "@/features/learning/problems/beam-statics-problem-adapter";

describe(
  "Beam Statics problem adapter",
  () => {
    it(
      "derives the answer key from the verified Engineering Core",
      () => {
        const definition =
          getNumericProblemDefinition(
            "activity-ssb-05",
          );

        if (
          !definition ||
          definition.kind !==
            "beam_statics_numeric_problem"
        ) {
          throw new Error(
            "Expected Statics numeric problem.",
          );
        }

        const answerKey =
          createBeamStaticsProblemAnswerKey(
            definition,
          );

        const values =
          Object.fromEntries(
            answerKey.map(
              (item) => [
                item.fieldId,
                item.expectedValue,
              ],
            ),
          );

        expect(
          values,
        ).toEqual({
          "problem-ssb-ra":
            8,

          "problem-ssb-rb":
            4,

          "problem-ssb-v-left":
            8,

          "problem-ssb-v-right":
            -4,

          "problem-ssb-mmax":
            16,

          "problem-ssb-x-mmax":
            2,
        });
      },
    );

    it(
      "does not store numerical answers in the problem definition",
      () => {
        const definition =
          getNumericProblemDefinition(
            "activity-ssb-05",
          );

        if (!definition) {
          throw new Error(
            "Expected Statics numeric problem.",
          );
        }

        for (
          const field
          of definition.fields
        ) {
          expect(
            field,
          ).not.toHaveProperty(
            "expectedValue",
          );
        }
      },
    );
  },
);