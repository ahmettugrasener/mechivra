import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getPredictionDefinition,
} from "@/content/predictions";

import {
  createEmptyLearningCompletionEvidence,
  evaluateLearningCompletion,
  recordLearningCompletionEvent,
} from "@/domain/learning/completion";

import {
  evaluatePrediction,
} from "@/domain/learning/prediction";

describe(
  "Prediction and completion semantics",
  () => {
    it(
      "completes the activity after an incorrect prediction is submitted",
      () => {
        const definition =
          getPredictionDefinition(
            "activity-ssb-03",
          );

        if (!definition) {
          throw new Error(
            "Expected Statics prediction definition.",
          );
        }

        const incorrectOption =
          definition.options.find(
            (option) =>
              option.id !==
              definition.correctOptionId,
          );

        if (!incorrectOption) {
          throw new Error(
            "Expected at least one incorrect prediction option.",
          );
        }

        const evaluation =
          evaluatePrediction(
            definition,
            incorrectOption.id,
          );

        expect(
          evaluation.isCorrect,
        ).toBe(false);

        const evidence =
          recordLearningCompletionEvent(
            createEmptyLearningCompletionEvidence(),
            "prediction_submitted",
          );

        const completion =
          evaluateLearningCompletion(
            {
              type:
                "submitted_prediction",
            },
            evidence,
          );

        expect(
          completion.completed,
        ).toBe(true);
      },
    );

    it(
      "keeps correctness available as separate information for a correct prediction",
      () => {
        const definition =
          getPredictionDefinition(
            "activity-ssb-03",
          );

        if (!definition) {
          throw new Error(
            "Expected Statics prediction definition.",
          );
        }

        const evaluation =
          evaluatePrediction(
            definition,
            definition.correctOptionId,
          );

        const evidence =
          recordLearningCompletionEvent(
            createEmptyLearningCompletionEvidence(),
            "prediction_submitted",
          );

        const completion =
          evaluateLearningCompletion(
            {
              type:
                "submitted_prediction",
            },
            evidence,
          );

        expect(
          evaluation.isCorrect,
        ).toBe(true);

        expect(
          completion.completed,
        ).toBe(true);
      },
    );
  },
);