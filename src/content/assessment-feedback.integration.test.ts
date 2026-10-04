import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getAssessmentFeedbackEntry,
  getAssessmentFeedbackText,
} from "@/content/assessment-feedback";

import {
  createAssessmentFeedbackPlan,
} from "@/domain/assessment/feedback";

import {
  createAssessmentResult,
} from "@/domain/assessment/result";

describe(
  "Assessment feedback integration",
  () => {
    it(
      "resolves a complete correct result into bilingual feedback",
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
            getAssessmentFeedbackEntry,
          );

        expect(
          plan.summary.code,
        ).toBe(
          "assessment.result.correct",
        );

        expect(
          getAssessmentFeedbackText(
            plan.summary.code,
            "tr",
          )?.title,
        ).toBe(
          "Doğru",
        );

        expect(
          getAssessmentFeedbackText(
            plan.summary.code,
            "en",
          )?.title,
        ).toBe(
          "Correct",
        );
      },
    );

    it(
      "resolves specific targeted feedback rather than collapsing it to generic incorrect",
      () => {
        const result =
          createAssessmentResult(
            [
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
                  "assessment.numeric.outside-tolerance",
              },
            ],
          );

        const plan =
          createAssessmentFeedbackPlan(
            result,
            getAssessmentFeedbackEntry,
          );

        expect(
          plan.items[0]
            ?.feedback.reason,
        ).toBe(
          "outside_tolerance",
        );

        expect(
          getAssessmentFeedbackText(
            plan.items[0]
              ?.feedback.code ??
              "",
            "tr",
          )?.title,
        ).toBe(
          "Sayısal sonucu kontrol et",
        );
      },
    );

    it(
      "keeps criterion error separate from numeric correctness",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "stress",

                status:
                  "correct",

                score:
                  1,

                maxScore:
                  1,
              },

              {
                id:
                  "stress-criterion",

                status:
                  "incorrect",

                score:
                  0,

                maxScore:
                  1,

                feedbackCode:
                  "assessment.criterion.wrong",
              },
            ],
          );

        const plan =
          createAssessmentFeedbackPlan(
            result,
            getAssessmentFeedbackEntry,
          );

        expect(
          plan.summary.reason,
        ).toBe(
          "partial",
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
          "wrong_criterion",
        );
      },
    );
  },
);