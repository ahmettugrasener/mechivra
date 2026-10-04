import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createEmptyLearningCompletionEvidence,
  evaluateLearningCompletion,
  isCompletionRuleCompatibleWithActivityType,
  recordLearningCompletionEvent,
} from "@/domain/learning/completion";

describe(
  "Learning completion semantics",
  () => {
    it(
      "starts with no completion evidence",
      () => {
        expect(
          createEmptyLearningCompletionEvidence(),
        ).toEqual({
          opened: false,
          reachedEnd: false,

          predictionSubmissions:
            0,

          meaningfulInteractions:
            0,

          attemptsSubmitted:
            0,

          explicitCompletions:
            0,
        });
      },
    );

    it(
      "completes an opened rule only after the activity is opened",
      () => {
        const initial =
          createEmptyLearningCompletionEvidence();

        expect(
          evaluateLearningCompletion(
            {
              type:
                "opened",
            },
            initial,
          ).completed,
        ).toBe(false);

        const opened =
          recordLearningCompletionEvent(
            initial,
            "opened",
          );

        expect(
          evaluateLearningCompletion(
            {
              type:
                "opened",
            },
            opened,
          ).completed,
        ).toBe(true);
      },
    );

    it(
      "does not confuse opening an activity with reaching its end",
      () => {
        const evidence =
          recordLearningCompletionEvent(
            createEmptyLearningCompletionEvidence(),
            "opened",
          );

        expect(
          evaluateLearningCompletion(
            {
              type:
                "reached_end",
            },
            evidence,
          ).completed,
        ).toBe(false);
      },
    );

    it(
      "completes reached-end activities only after reached-end evidence",
      () => {
        const evidence =
          recordLearningCompletionEvent(
            createEmptyLearningCompletionEvidence(),
            "reached_end",
          );

        expect(
          evidence.opened,
        ).toBe(true);

        expect(
          evidence.reachedEnd,
        ).toBe(true);

        expect(
          evaluateLearningCompletion(
            {
              type:
                "reached_end",
            },
            evidence,
          ).completed,
        ).toBe(true);
      },
    );

    it(
      "treats prediction submission as completion without requiring correctness",
      () => {
        const predictionWasCorrect =
          false;

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
          predictionWasCorrect,
        ).toBe(false);

        expect(
          completion.completed,
        ).toBe(true);

        expect(
          evidence.predictionSubmissions,
        ).toBe(1);
      },
    );

    it(
      "completes an interactive activity after a meaningful interaction",
      () => {
        const evidence =
          recordLearningCompletionEvent(
            createEmptyLearningCompletionEvidence(),
            "meaningful_interaction",
          );

        expect(
          evaluateLearningCompletion(
            {
              type:
                "meaningful_interaction",
            },
            evidence,
          ).completed,
        ).toBe(true);

        expect(
          evidence.meaningfulInteractions,
        ).toBe(1);
      },
    );

    it(
      "does not complete an interactive rule from opening alone",
      () => {
        const evidence =
          recordLearningCompletionEvent(
            createEmptyLearningCompletionEvidence(),
            "opened",
          );

        expect(
          evaluateLearningCompletion(
            {
              type:
                "meaningful_interaction",
            },
            evidence,
          ).completed,
        ).toBe(false);
      },
    );

    it(
      "completes a submitted-attempt rule after an attempt",
      () => {
        const evidence =
          recordLearningCompletionEvent(
            createEmptyLearningCompletionEvidence(),
            "attempt_submitted",
          );

        expect(
          evaluateLearningCompletion(
            {
              type:
                "submitted_attempt",
            },
            evidence,
          ).completed,
        ).toBe(true);
      },
    );

    it(
      "completes an explicit-completion rule only after explicit completion",
      () => {
        const initial =
          createEmptyLearningCompletionEvidence();

        expect(
          evaluateLearningCompletion(
            {
              type:
                "explicit_completion",
            },
            initial,
          ).completed,
        ).toBe(false);

        const completed =
          recordLearningCompletionEvent(
            initial,
            "explicit_completion",
          );

        expect(
          evaluateLearningCompletion(
            {
              type:
                "explicit_completion",
            },
            completed,
          ).completed,
        ).toBe(true);
      },
    );

    it(
      "counts repeated evidence without mutating the previous state",
      () => {
        const initial =
          createEmptyLearningCompletionEvidence();

        const first =
          recordLearningCompletionEvent(
            initial,
            "meaningful_interaction",
          );

        const second =
          recordLearningCompletionEvent(
            first,
            "meaningful_interaction",
          );

        expect(
          initial.meaningfulInteractions,
        ).toBe(0);

        expect(
          first.meaningfulInteractions,
        ).toBe(1);

        expect(
          second.meaningfulInteractions,
        ).toBe(2);
      },
    );
  },
);

describe(
  "Learning completion rule compatibility",
  () => {
    it.each([
      [
        "problem_context",
        "reached_end",
      ],
      [
        "concept",
        "reached_end",
      ],
      [
        "worked_example",
        "reached_end",
      ],
      [
        "interpretation",
        "reached_end",
      ],
      [
        "reflection",
        "explicit_completion",
      ],
      [
        "summary",
        "reached_end",
      ],
      [
        "prediction",
        "submitted_prediction",
      ],
      [
        "interactive",
        "meaningful_interaction",
      ],
      [
        "lab",
        "meaningful_interaction",
      ],
      [
        "problem",
        "submitted_attempt",
      ],
      [
        "quiz",
        "submitted_attempt",
      ],
      [
        "design_task",
        "explicit_completion",
      ],
    ] as const)(
      "accepts %s with %s",
      (
        activityType,
        completionRule,
      ) => {
        expect(
          isCompletionRuleCompatibleWithActivityType(
            activityType,
            completionRule,
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects correctness-style completion semantics for a prediction",
      () => {
        expect(
          isCompletionRuleCompatibleWithActivityType(
            "prediction",
            "submitted_attempt",
          ),
        ).toBe(false);

        expect(
          isCompletionRuleCompatibleWithActivityType(
            "prediction",
            "reached_end",
          ),
        ).toBe(false);
      },
    );

    it(
      "rejects opened-only completion for an interactive activity",
      () => {
        expect(
          isCompletionRuleCompatibleWithActivityType(
            "interactive",
            "opened",
          ),
        ).toBe(false);
      },
    );
  },
);