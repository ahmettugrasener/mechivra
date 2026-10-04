import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASSESSMENT_FEEDBACK_CATALOG,
  getAssessmentFeedbackEntry,
  getAssessmentFeedbackText,
} from "@/content/assessment-feedback";

describe(
  "Assessment feedback catalog",
  () => {
    it(
      "uses unique feedback codes",
      () => {
        const codes =
          ASSESSMENT_FEEDBACK_CATALOG.map(
            (
              item,
            ) =>
              item.code,
          );

        expect(
          new Set(
            codes,
          ).size,
        ).toBe(
          codes.length,
        );
      },
    );

    it(
      "provides complete Turkish and English text for every entry",
      () => {
        for (
          const item
          of ASSESSMENT_FEEDBACK_CATALOG
        ) {
          expect(
            item.text.tr.title
              .trim().length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            item.text.tr.message
              .trim().length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            item.text.en.title
              .trim().length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            item.text.en.message
              .trim().length,
          ).toBeGreaterThan(
            0,
          );
        }
      },
    );

    it(
      "contains the required generic feedback codes",
      () => {
        const requiredCodes = [
          "assessment.result.correct",
          "assessment.result.partially-correct",
          "assessment.result.incorrect",
          "assessment.result.invalid",
          "assessment.result.not-evaluated",
          "assessment.item.correct",
          "assessment.item.incorrect",
          "assessment.item.invalid",
          "assessment.numeric.missing",
          "assessment.numeric.invalid",
          "assessment.numeric.outside-tolerance",
          "assessment.choice.missing",
          "assessment.choice.wrong-concept",
          "assessment.criterion.wrong",
          "assessment.unit.mismatch",
          "assessment.model.limit",
        ];

        for (
          const code
          of requiredCodes
        ) {
          expect(
            getAssessmentFeedbackEntry(
              code,
            ),
          ).toBeDefined();
        }
      },
    );

    it(
      "keeps unit, concept, criterion, and model-limit reasons distinct",
      () => {
        expect(
          getAssessmentFeedbackEntry(
            "assessment.unit.mismatch",
          )?.reason,
        ).toBe(
          "unit_mismatch",
        );

        expect(
          getAssessmentFeedbackEntry(
            "assessment.choice.wrong-concept",
          )?.reason,
        ).toBe(
          "wrong_concept",
        );

        expect(
          getAssessmentFeedbackEntry(
            "assessment.criterion.wrong",
          )?.reason,
        ).toBe(
          "wrong_criterion",
        );

        expect(
          getAssessmentFeedbackEntry(
            "assessment.model.limit",
          )?.reason,
        ).toBe(
          "model_limit",
        );
      },
    );

    it(
      "resolves localized text without changing the feedback code",
      () => {
        expect(
          getAssessmentFeedbackText(
            "assessment.unit.mismatch",
            "tr",
          )?.title,
        ).toBe(
          "Birimi kontrol et",
        );

        expect(
          getAssessmentFeedbackText(
            "assessment.unit.mismatch",
            "en",
          )?.title,
        ).toBe(
          "Check the unit",
        );

        expect(
          getAssessmentFeedbackEntry(
            "assessment.unit.mismatch",
          )?.code,
        ).toBe(
          "assessment.unit.mismatch",
        );
      },
    );

    it(
      "returns undefined for an unknown feedback code",
      () => {
        expect(
          getAssessmentFeedbackEntry(
            "invented.feedback",
          ),
        ).toBeUndefined();

        expect(
          getAssessmentFeedbackText(
            "invented.feedback",
            "tr",
          ),
        ).toBeUndefined();
      },
    );
  },
);