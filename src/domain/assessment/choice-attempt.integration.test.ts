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
  evaluatePredictionAssessment,
} from "@/domain/assessment/prediction-evaluation";

interface PredictionResponse {
  readonly selectedOptionId:
    string | null;
}

describe(
  "Choice assessment attempt integration",
  () => {
    it(
      "keeps submission and correctness as separate states",
      () => {
        const draft =
          createAssessmentAttempt<PredictionResponse>(
            {
              attemptId:
                "attempt-prediction-1",

              activityId:
                "activity-otto-03",

              activityVersion:
                "1.0.0",

              assessmentId:
                "otto-compression-ratio-prediction",

              assessmentVersion:
                "1.0.0",

              attemptNumber:
                1,
            },
          );

        const response = {
          selectedOptionId:
            "unchanged",
        };

        const submitted =
          submitAssessmentAttempt(
            draft,
            response,
          );

        expect(
          submitted.status,
        ).toBe(
          "submitted",
        );

        expect(
          submitted.result,
        ).toBeNull();

        const assessment =
          evaluatePredictionAssessment(
            {
              id:
                "otto-compression-ratio-prediction",

              kind:
                "prediction",

              options: [
                {
                  id:
                    "increases",
                },

                {
                  id:
                    "unchanged",
                },
              ],

              correctOptionId:
                "increases",

              maxScore:
                1,
            },
            response,
          );

        const evaluated =
          evaluateAssessmentAttempt(
            submitted,
            assessment.result,
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
          "incorrect",
        );

        expect(
          evaluated.result
            ?.correct,
        ).toBe(
          false,
        );
      },
    );

    it(
      "records a correct prediction through the same lifecycle",
      () => {
        const draft =
          createAssessmentAttempt<PredictionResponse>(
            {
              attemptId:
                "attempt-prediction-2",

              activityId:
                "activity-otto-03",

              activityVersion:
                "1.0.0",

              assessmentId:
                "otto-compression-ratio-prediction",

              assessmentVersion:
                "1.0.0",

              attemptNumber:
                1,
            },
          );

        const response = {
          selectedOptionId:
            "increases",
        };

        const submitted =
          submitAssessmentAttempt(
            draft,
            response,
          );

        const assessment =
          evaluatePredictionAssessment(
            {
              id:
                "otto-compression-ratio-prediction",

              kind:
                "prediction",

              options: [
                {
                  id:
                    "increases",
                },

                {
                  id:
                    "unchanged",
                },
              ],

              correctOptionId:
                "increases",

              maxScore:
                1,
            },
            response,
          );

        const evaluated =
          evaluateAssessmentAttempt(
            submitted,
            assessment.result,
          );

        expect(
          evaluated.result
            ?.correct,
        ).toBe(
          true,
        );

        expect(
          evaluated.result
            ?.normalizedScore,
        ).toBe(
          1,
        );
      },
    );
  },
);