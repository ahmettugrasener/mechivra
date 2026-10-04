import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluatePrediction,
  PredictionEvaluationError,
} from "@/domain/learning/prediction";

import type {
  PredictionDefinition,
} from "@/domain/learning/prediction";

const definition:
  PredictionDefinition = {
  activityId:
    "activity-test-prediction",

  prompt: {
    tr:
      "Ne olacağını tahmin et.",
    en:
      "Predict what will happen.",
  },

  options: [
    {
      id:
        "prediction-option-a",

      label: {
        tr:
          "A seçeneği",
        en:
          "Option A",
      },

      feedback: {
        tr:
          "A geri bildirimi",
        en:
          "Feedback A",
      },
    },

    {
      id:
        "prediction-option-b",

      label: {
        tr:
          "B seçeneği",
        en:
          "Option B",
      },

      feedback: {
        tr:
          "B geri bildirimi",
        en:
          "Feedback B",
      },
    },
  ],

  correctOptionId:
    "prediction-option-b",
};

describe(
  "Prediction evaluation",
  () => {
    it(
      "marks the configured correct option as correct",
      () => {
        const result =
          evaluatePrediction(
            definition,
            "prediction-option-b",
          );

        expect(
          result.isCorrect,
        ).toBe(true);

        expect(
          result.submittedOptionId,
        ).toBe(
          "prediction-option-b",
        );
      },
    );

    it(
      "keeps an incorrect prediction as a valid submitted evaluation",
      () => {
        const result =
          evaluatePrediction(
            definition,
            "prediction-option-a",
          );

        expect(
          result.isCorrect,
        ).toBe(false);

        expect(
          result.activityId,
        ).toBe(
          "activity-test-prediction",
        );

        expect(
          result.feedback.en,
        ).toBe(
          "Feedback A",
        );
      },
    );

    it(
      "rejects an option that does not belong to the prediction",
      () => {
        expect(
          () =>
            evaluatePrediction(
              definition,
              "prediction-option-unknown",
            ),
        ).toThrow(
          PredictionEvaluationError,
        );
      },
    );
  },
);