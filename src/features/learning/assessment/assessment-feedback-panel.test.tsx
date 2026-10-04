import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  createAssessmentResult,
} from "@/domain/assessment";

import { AssessmentFeedbackPanel } from "@/features/learning/assessment/assessment-feedback-panel";

afterEach(() => {
  cleanup();
});

describe(
  "AssessmentFeedbackPanel",
  () => {
    it(
      "renders localized success feedback",
      () => {
        render(
          <AssessmentFeedbackPanel
            locale="tr"
            result={
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
              )
            }
          />,
        );

        expect(
          screen.getByTestId(
            "assessment-feedback-panel",
          ),
        ).toHaveAttribute(
          "data-feedback-reason",
          "correct",
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Doğru",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders English partial feedback",
      () => {
        render(
          <AssessmentFeedbackPanel
            locale="en"
            result={
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
                      "assessment.numeric.outside-tolerance",
                  },
                ],
              )
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Partially correct",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "assessment-feedback-panel",
          ),
        ).toHaveAttribute(
          "data-feedback-reason",
          "partial",
        );
      },
    );

    it(
      "keeps targeted item feedback visible",
      () => {
        render(
          <AssessmentFeedbackPanel
            locale="tr"
            result={
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
              )
            }
          />,
        );

        expect(
          document.querySelector(
            '[data-assessment-feedback-item="stress-criterion"]',
          ),
        ).toHaveTextContent(
          /Ölçüt kararını yeniden kontrol et|Hesaplanan sonuçtan ölçüt kararına geçişi yeniden kontrol et/i,
        );
      },
    );

    it(
      "can hide per-item detail while keeping the assessment summary",
      () => {
        render(
          <AssessmentFeedbackPanel
            locale="en"
            showItemFeedback={
              false
            }
            result={
              createAssessmentResult(
                [
                  {
                    id:
                      "a",

                    status:
                      "correct",

                    score:
                      1,

                    maxScore:
                      1,
                  },

                  {
                    id:
                      "b",

                    status:
                      "incorrect",

                    score:
                      0,

                    maxScore:
                      1,
                  },
                ],
              )
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Partially correct",
            },
          ),
        ).toBeInTheDocument();

        expect(
          document.querySelector(
            '[data-assessment-feedback-item="a"]',
          ),
        ).toBeNull();
      },
    );
  },
);