import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluatePredictionAssessment,
} from "@/domain/assessment/prediction-evaluation";

describe(
  "Prediction assessment evaluation",
  () => {
    it(
      "evaluates a prediction through the common assessment result contract",
      () => {
        const result =
          evaluatePredictionAssessment(
            {
              id:
                "beam-load-position",

              kind:
                "prediction",

              options: [
                {
                  id:
                    "left-increases",
                },

                {
                  id:
                    "right-increases",
                },

                {
                  id:
                    "both-unchanged",
                },
              ],

              correctOptionId:
                "right-increases",

              maxScore:
                1,

              correctFeedbackCode:
                "beam.prediction.correct",
            },
            {
              selectedOptionId:
                "right-increases",
            },
          );

        expect(
          result.result.status,
        ).toBe(
          "correct",
        );

        expect(
          result.result.correct,
        ).toBe(
          true,
        );

        expect(
          result.result.items,
        ).toHaveLength(
          1,
        );
      },
    );

    it(
      "keeps a wrong prediction as a legitimate evaluated response",
      () => {
        const result =
          evaluatePredictionAssessment(
            {
              id:
                "beam-load-position",

              kind:
                "prediction",

              options: [
                {
                  id:
                    "left-increases",

                  feedbackCode:
                    "beam.prediction.load-sharing-reversed",
                },

                {
                  id:
                    "right-increases",
                },
              ],

              correctOptionId:
                "right-increases",

              maxScore:
                1,
            },
            {
              selectedOptionId:
                "left-increases",
            },
          );

        expect(
          result.result.status,
        ).toBe(
          "incorrect",
        );

        expect(
          result.result.items[0]
            ?.feedbackCode,
        ).toBe(
          "beam.prediction.load-sharing-reversed",
        );
      },
    );
  },
);