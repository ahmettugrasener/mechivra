import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AssessmentFeedbackError,
  createAssessmentFeedbackPlan,
} from "@/domain/assessment/feedback";

import type {
  AssessmentFeedbackDescriptor,
} from "@/domain/assessment/feedback";

import {
  createAssessmentResult,
} from "@/domain/assessment/result";

const feedbackEntries:
  readonly AssessmentFeedbackDescriptor[] =
  [
    {
      code:
        "assessment.result.correct",

      reason:
        "correct",

      tone:
        "success",

      retryable:
        false,
    },

    {
      code:
        "assessment.result.partially-correct",

      reason:
        "partial",

      tone:
        "guidance",

      retryable:
        true,
    },

    {
      code:
        "assessment.result.incorrect",

      reason:
        "incorrect",

      tone:
        "guidance",

      retryable:
        true,
    },

    {
      code:
        "assessment.result.invalid",

      reason:
        "invalid_input",

      tone:
        "warning",

      retryable:
        true,
    },

    {
      code:
        "assessment.result.not-evaluated",

      reason:
        "not_evaluated",

      tone:
        "info",

      retryable:
        false,
    },

    {
      code:
        "assessment.item.correct",

      reason:
        "correct",

      tone:
        "success",

      retryable:
        false,
    },

    {
      code:
        "assessment.item.incorrect",

      reason:
        "incorrect",

      tone:
        "guidance",

      retryable:
        true,
    },

    {
      code:
        "assessment.item.invalid",

      reason:
        "invalid_input",

      tone:
        "warning",

      retryable:
        true,
    },

    {
      code:
        "test.wrong-concept",

      reason:
        "wrong_concept",

      tone:
        "guidance",

      retryable:
        true,
    },

    {
      code:
        "test.outside-tolerance",

      reason:
        "outside_tolerance",

      tone:
        "guidance",

      retryable:
        true,
    },
  ];

function lookup(
  code:
    string,
) {
  return feedbackEntries.find(
    (
      entry,
    ) =>
      entry.code ===
      code,
  );
}

describe(
  "Assessment feedback contract",
  () => {
    it(
      "creates a success summary for a fully correct result",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "answer",

                status:
                  "correct",

                score:
                  1,

                maxScore:
                  1,
              },
            ],
          );

        const plan =
          createAssessmentFeedbackPlan(
            result,
            lookup,
          );

        expect(
          plan.summary.code,
        ).toBe(
          "assessment.result.correct",
        );

        expect(
          plan.summary.reason,
        ).toBe(
          "correct",
        );

        expect(
          plan.summary.tone,
        ).toBe(
          "success",
        );

        expect(
          plan.summary.retryable,
        ).toBe(
          false,
        );
      },
    );

    it(
      "preserves a specific misconception code",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "prediction",

                status:
                  "incorrect",

                score:
                  0,

                maxScore:
                  1,

                feedbackCode:
                  "test.wrong-concept",
              },
            ],
          );

        const plan =
          createAssessmentFeedbackPlan(
            result,
            lookup,
          );

        expect(
          plan.items[0]
            ?.feedback.code,
        ).toBe(
          "test.wrong-concept",
        );

        expect(
          plan.items[0]
            ?.feedback.reason,
        ).toBe(
          "wrong_concept",
        );
      },
    );

    it(
      "uses a generic item fallback only when no specific code exists",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "answer",

                status:
                  "incorrect",

                score:
                  0,

                maxScore:
                  1,
              },
            ],
          );

        const plan =
          createAssessmentFeedbackPlan(
            result,
            lookup,
          );

        expect(
          plan.items[0]
            ?.feedback.code,
        ).toBe(
          "assessment.item.incorrect",
        );

        expect(
          plan.items[0]
            ?.feedback.reason,
        ).toBe(
          "incorrect",
        );
      },
    );

    it(
      "creates separate summary and item feedback for a partially correct result",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "temperature",

                status:
                  "correct",

                score:
                  1,

                maxScore:
                  1,
              },

              {
                id:
                  "pressure",

                status:
                  "incorrect",

                score:
                  0,

                maxScore:
                  1,

                feedbackCode:
                  "test.outside-tolerance",
              },
            ],
          );

        const plan =
          createAssessmentFeedbackPlan(
            result,
            lookup,
          );

        expect(
          plan.summary.code,
        ).toBe(
          "assessment.result.partially-correct",
        );

        expect(
          plan.items,
        ).toHaveLength(
          2,
        );

        expect(
          plan.items[0]
            ?.feedback.reason,
        ).toBe(
          "correct",
        );

        expect(
          plan.items[1]
            ?.feedback.reason,
        ).toBe(
          "outside_tolerance",
        );
      },
    );

    it(
      "distinguishes invalid response from ordinary incorrect response",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "missing",

                status:
                  "invalid",

                score:
                  0,

                maxScore:
                  1,
              },
            ],
          );

        const plan =
          createAssessmentFeedbackPlan(
            result,
            lookup,
          );

        expect(
          plan.summary.reason,
        ).toBe(
          "invalid_input",
        );

        expect(
          plan.items[0]
            ?.feedback.reason,
        ).toBe(
          "invalid_input",
        );
      },
    );

    it(
      "does not infer a conceptual error from a generic incorrect item",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "answer",

                status:
                  "incorrect",

                score:
                  0,

                maxScore:
                  1,
              },
            ],
          );

        const plan =
          createAssessmentFeedbackPlan(
            result,
            lookup,
          );

        expect(
          plan.items[0]
            ?.feedback.reason,
        ).toBe(
          "incorrect",
        );

        expect(
          plan.items[0]
            ?.feedback.reason,
        ).not.toBe(
          "wrong_concept",
        );
      },
    );

    it(
      "rejects unregistered specific feedback codes",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "answer",

                status:
                  "incorrect",

                score:
                  0,

                maxScore:
                  1,

                feedbackCode:
                  "invented.feedback.code",
              },
            ],
          );

        expect(
          () =>
            createAssessmentFeedbackPlan(
              result,
              lookup,
            ),
        ).toThrow(
          AssessmentFeedbackError,
        );
      },
    );
  },
);