import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createEmptyLearningCompletionEvidence,
  evaluateLearningCompletion,
  recordLearningCompletionEvent,
} from "@/domain/learning/completion";

import {
  createInteractiveEngagement,
  recordMeaningfulInteraction,
} from "@/domain/learning/interactive";

describe(
  "Interactive and completion semantics",
  () => {
    it(
      "does not complete before a meaningful interaction",
      () => {
        const engagement =
          createInteractiveEngagement();

        const evidence =
          createEmptyLearningCompletionEvidence();

        expect(
          engagement.hasMeaningfulInteraction,
        ).toBe(false);

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
      "completes after the first meaningful interaction",
      () => {
        const engagement =
          recordMeaningfulInteraction(
            createInteractiveEngagement(),
          );

        const evidence =
          recordLearningCompletionEvent(
            createEmptyLearningCompletionEvidence(),
            "meaningful_interaction",
          );

        expect(
          engagement.hasMeaningfulInteraction,
        ).toBe(true);

        expect(
          evaluateLearningCompletion(
            {
              type:
                "meaningful_interaction",
            },
            evidence,
          ).completed,
        ).toBe(true);
      },
    );
  },
);