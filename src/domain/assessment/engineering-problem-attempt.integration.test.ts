import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createAssessmentAttempt,
  evaluateAssessmentAttempt,
  submitAssessmentAttempt,
} from "@/domain/assessment/attempt";

import {
  createEngineeringCriterionOptions,
} from "@/domain/assessment/criterion";

import {
  evaluateEngineeringProblem,
} from "@/domain/assessment/engineering-problem-evaluation";

import type {
  EngineeringProblemResponse,
} from "@/domain/assessment/engineering-problem-evaluation";

describe(
  "Engineering problem attempt integration",
  () => {
    it(
      "records a mixed numeric and criterion attempt without losing partial correctness",
      () => {
        const definition = {
          id:
            "mixed-problem",

          version:
            "1.0.0",

          numericItems: [
            {
              id:
                "stress",

              expectedValue:
                50,

              quantityId:
                "stress",

              expectedUnitId:
                "MPa",

              tolerance: {
                absolute:
                  0.1,

                relative:
                  0.001,
              },

              maxScore:
                1,
            },
          ],

          choiceItems: [
            {
              role:
                "criterion" as const,

              definition: {
                id:
                  "stress-limit",

                kind:
                  "choice" as const,

                options:
                  createEngineeringCriterionOptions(),

                correctOptionId:
                  "fail",

                maxScore:
                  1,
              },
            },
          ],
        };

        const response:
          EngineeringProblemResponse =
          {
            numeric: [
              {
                itemId:
                  "stress",

                value:
                  50,
              },
            ],

            choices: [
              {
                itemId:
                  "stress-limit",

                selectedOptionId:
                  "pass",
              },
            ],
          };

        const draft =
          createAssessmentAttempt<EngineeringProblemResponse>(
            {
              attemptId:
                "attempt-mixed-1",

              activityId:
                "activity-bending-05",

              activityVersion:
                "1.0.0",

              assessmentId:
                definition.id,

              assessmentVersion:
                definition.version,

              attemptNumber:
                1,
            },
          );

        const submitted =
          submitAssessmentAttempt(
            draft,
            response,
          );

        expect(
          submitted.result,
        ).toBeNull();

        const evaluation =
          evaluateEngineeringProblem(
            definition,
            response,
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "partially_correct",
        );

        const evaluated =
          evaluateAssessmentAttempt(
            submitted,
            evaluation.result,
          );

        expect(
          evaluated.status,
        ).toBe(
          "evaluated",
        );

        expect(
          evaluated.result
            ?.status,
        ).toBe(
          "partially_correct",
        );

        expect(
          evaluated.result
            ?.correct,
        ).toBe(
          false,
        );
      },
    );
  },
);