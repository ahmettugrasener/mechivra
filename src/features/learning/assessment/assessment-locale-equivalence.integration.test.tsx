import {
  cleanup,
  fireEvent,
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
  createAssessmentAttempt,
  createAssessmentResult,
  evaluateAssessmentAttempt,
  getAssessmentCompletionSnapshot,
  parseNumericAssessmentInput,
  submitAssessmentAttempt,
} from "@/domain/assessment";

import {
  getAssessmentFeedbackEntry,
} from "@/content/assessment-feedback";

import {
  getPredictionDefinitions,
} from "@/content/predictions";

import {
  getNumericProblemDefinition,
} from "@/content/statics-problems";

import {
  createAssessmentFeedbackPlan,
} from "@/domain/assessment/feedback";

import {
  createEmptyLearningCompletionEvidence,
  evaluateLearningCompletion,
  recordLearningCompletionEvent,
} from "@/domain/learning/completion";

import {
  getActivitiesForModule,
} from "@/content/registry";

import {
  AssessmentFeedbackPanel,
} from "@/features/learning/assessment";

import {
  BeamStaticsProblemActivity,
} from "@/features/learning/problems/beam-statics-problem-activity";

import {
  BendingProblemActivity,
} from "@/features/learning/bending/bending-problem-activity";

import {
  OttoProblemActivity,
} from "@/features/learning/otto/otto-problem-activity";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

afterEach(() => {
  cleanup();
});

interface AssessmentUiSnapshot {
  readonly correct:
    string | null;

  readonly attemptCount:
    string | null;

  readonly feedbackCode:
    string | null;
}

function getStaticsDefinition() {
  const definition =
    getNumericProblemDefinition(
      "activity-ssb-05",
    );

  if (
    !definition ||
    definition.kind !==
      "beam_statics_numeric_problem"
  ) {
    throw new Error(
      "Expected Statics problem definition.",
    );
  }

  return definition;
}

function captureStatics(
  locale:
    SupportedLocale,
): AssessmentUiSnapshot {
  const view =
    render(
      <BeamStaticsProblemActivity
        definition={
          getStaticsDefinition()
        }
        locale={
          locale
        }
      />,
    );

  const values =
    locale ===
    "tr"
      ? [
          "8,0",
          "4,0",
          "8,0",
          "-4,0",
          "16,0",
          "2,0",
        ]
      : [
          "8.0",
          "4.0",
          "8.0",
          "-4.0",
          "16.0",
          "2.0",
        ];

  const fields =
    screen.getAllByRole(
      "textbox",
    );

  for (
    let index = 0;
    index <
    fields.length;
    index += 1
  ) {
    fireEvent.change(
      fields[index]!,
      {
        target: {
          value:
            values[index],
        },
      },
    );
  }

  fireEvent.click(
    screen.getByRole(
      "button",
      {
        name:
          locale ===
          "tr"
            ? "Sonuçları kontrol et"
            : "Check answers",
      },
    ),
  );

  const activity =
    screen.getByTestId(
      "beam-statics-problem-activity",
    );

  const feedback =
    screen.getByTestId(
      "assessment-feedback-panel",
    );

  const snapshot = {
    correct:
      activity.getAttribute(
        "data-attempt-correct",
      ),

    attemptCount:
      activity.getAttribute(
        "data-attempt-count",
      ),

    feedbackCode:
      feedback.getAttribute(
        "data-feedback-code",
      ),
  };

  view.unmount();

  return snapshot;
}

function captureBending(
  locale:
    SupportedLocale,
): AssessmentUiSnapshot {
  const view =
    render(
      <BendingProblemActivity
        locale={
          locale
        }
      />,
    );

  const values =
    locale ===
    "tr"
      ? [
          "2730,667",
          "6,0",
          "17,578",
          "2,354",
        ]
      : [
          "2730.667",
          "6.0",
          "17.578",
          "2.354",
        ];

  const fields =
    screen.getAllByRole(
      "textbox",
    );

  for (
    let index = 0;
    index <
    fields.length;
    index += 1
  ) {
    fireEvent.change(
      fields[index]!,
      {
        target: {
          value:
            values[index],
        },
      },
    );
  }

  const radios =
    screen.getAllByRole(
      "radio",
    );

  /*
   * Order:
   * 0 stress satisfied
   * 1 stress not satisfied
   * 2 deflection satisfied
   * 3 deflection not satisfied
   */
  fireEvent.click(
    radios[0]!,
  );

  fireEvent.click(
    radios[3]!,
  );

  fireEvent.click(
    screen.getByRole(
      "button",
      {
        name:
          locale ===
          "tr"
            ? "Cevapları kontrol et"
            : "Check answers",
      },
    ),
  );

  const activity =
    screen.getByTestId(
      "bending-problem-activity",
    );

  const feedback =
    screen.getByTestId(
      "assessment-feedback-panel",
    );

  const snapshot = {
    correct:
      activity.getAttribute(
        "data-attempt-correct",
      ),

    attemptCount:
      activity.getAttribute(
        "data-attempt-count",
      ),

    feedbackCode:
      feedback.getAttribute(
        "data-feedback-code",
      ),
  };

  view.unmount();

  return snapshot;
}

function captureOtto(
  locale:
    SupportedLocale,
): AssessmentUiSnapshot {
  const view =
    render(
      <OttoProblemActivity
        locale={
          locale
        }
      />,
    );

  const machineValues = [
    "655.255",
    "1474.324",
    "0.127556",
    "1491.492",
    "3355.857",
    "728.384",
    "273.144",
    "293.016",
    "306.984",
    "51.164",
  ];

  const values =
    locale ===
    "tr"
      ? machineValues.map(
          (
            value,
          ) =>
            value.replace(
              ".",
              ",",
            ),
        )
      : machineValues;

  const fields =
    screen.getAllByRole(
      "textbox",
    );

  for (
    let index = 0;
    index <
    fields.length;
    index += 1
  ) {
    fireEvent.change(
      fields[index]!,
      {
        target: {
          value:
            values[index],
        },
      },
    );
  }

  if (
    locale ===
    "tr"
  ) {
    expect(
      screen.getByText(
        /γ = 1,4/,
      ),
    ).toBeInTheDocument();
  } else {
    expect(
      screen.getByText(
        /γ = 1\.4/,
      ),
    ).toBeInTheDocument();
  }

  fireEvent.click(
    screen.getByRole(
      "button",
      {
        name:
          locale ===
          "tr"
            ? "Cevapları kontrol et"
            : "Check answers",
      },
    ),
  );

  const activity =
    screen.getByTestId(
      "otto-problem-activity",
    );

  const feedback =
    screen.getByTestId(
      "assessment-feedback-panel",
    );

  const snapshot = {
    correct:
      activity.getAttribute(
        "data-attempt-correct",
      ),

    attemptCount:
      activity.getAttribute(
        "data-attempt-count",
      ),

    feedbackCode:
      feedback.getAttribute(
        "data-feedback-code",
      ),
  };

  view.unmount();

  return snapshot;
}

describe(
  "Assessment locale equivalence",
  () => {
    it(
      "parses equivalent Turkish and English decimal forms to the same numeric value",
      () => {
        const tr =
          parseNumericAssessmentInput(
            "51,164",
            "tr",
          );

        const en =
          parseNumericAssessmentInput(
            "51.164",
            "en",
          );

        expect(
          tr.valid,
        ).toBe(
          true,
        );

        expect(
          en.valid,
        ).toBe(
          true,
        );

        expect(
          tr.value,
        ).toBe(
          en.value,
        );

        expect(
          parseNumericAssessmentInput(
            "51,164",
            "en",
          ).valid,
        ).toBe(
          false,
        );
      },
    );

    it(
      "keeps prediction identity and correct-option identity independent of localized text",
      () => {
        for (
          const definition
          of getPredictionDefinitions()
        ) {
          expect(
            definition.prompt.tr
              .trim().length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            definition.prompt.en
              .trim().length,
          ).toBeGreaterThan(
            0,
          );

          const ids =
            definition.options.map(
              (
                option,
              ) =>
                option.id,
            );

          expect(
            ids,
          ).toContain(
            definition.correctOptionId,
          );

          for (
            const option
            of definition.options
          ) {
            expect(
              option.label.tr
                .trim().length,
            ).toBeGreaterThan(
              0,
            );

            expect(
              option.label.en
                .trim().length,
            ).toBeGreaterThan(
              0,
            );

            expect(
              option.feedback.tr
                .trim().length,
            ).toBeGreaterThan(
              0,
            );

            expect(
              option.feedback.en
                .trim().length,
            ).toBeGreaterThan(
              0,
            );
          }
        }
      },
    );

    it(
      "produces the same correct Statics assessment state for TR comma and EN point input",
      () => {
        const tr =
          captureStatics(
            "tr",
          );

        const en =
          captureStatics(
            "en",
          );

        expect(
          tr,
        ).toEqual(
          en,
        );

        expect(
          tr,
        ).toEqual({
          correct:
            "true",

          attemptCount:
            "1",

          feedbackCode:
            "assessment.result.correct",
        });
      },
    );

    it(
      "produces the same Bending 4-plus-2 assessment state in Turkish and English",
      () => {
        const tr =
          captureBending(
            "tr",
          );

        const en =
          captureBending(
            "en",
          );

        expect(
          tr,
        ).toEqual(
          en,
        );

        expect(
          tr.correct,
        ).toBe(
          "true",
        );

        expect(
          tr.attemptCount,
        ).toBe(
          "1",
        );
      },
    );

    it(
      "produces the same ten-item Otto assessment state in Turkish and English",
      () => {
        const tr =
          captureOtto(
            "tr",
          );

        const en =
          captureOtto(
            "en",
          );

        expect(
          tr,
        ).toEqual(
          en,
        );

        expect(
          tr.correct,
        ).toBe(
          "true",
        );

        expect(
          tr.feedbackCode,
        ).toBe(
          "assessment.result.correct",
        );
      },
    );

    it(
      "keeps feedback semantics identical while only localized text changes",
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
            getAssessmentFeedbackEntry,
          );

        expect(
          plan.summary.code,
        ).toBe(
          "assessment.result.incorrect",
        );

        const trView =
          render(
            <AssessmentFeedbackPanel
              result={
                result
              }
              locale="tr"
            />,
          );

        const trPanel =
          screen.getByTestId(
            "assessment-feedback-panel",
          );

        const trSemantics = {
          code:
            trPanel.getAttribute(
              "data-feedback-code",
            ),

          reason:
            trPanel.getAttribute(
              "data-feedback-reason",
            ),

          tone:
            trPanel.getAttribute(
              "data-feedback-tone",
            ),
        };

        trView.unmount();

        const enView =
          render(
            <AssessmentFeedbackPanel
              result={
                result
              }
              locale="en"
            />,
          );

        const enPanel =
          screen.getByTestId(
            "assessment-feedback-panel",
          );

        const enSemantics = {
          code:
            enPanel.getAttribute(
              "data-feedback-code",
            ),

          reason:
            enPanel.getAttribute(
              "data-feedback-reason",
            ),

          tone:
            enPanel.getAttribute(
              "data-feedback-tone",
            ),
        };

        expect(
          trSemantics,
        ).toEqual(
          enSemantics,
        );

        enView.unmount();
      },
    );

    it(
      "keeps completion separate from correctness and does not infer mastery",
      () => {
        const activity =
          getActivitiesForModule(
            "module-simply-supported-beam",
          ).find(
            (
              candidate,
            ) =>
              candidate.id ===
              "activity-ssb-05",
          );

        if (
          !activity
        ) {
          throw new Error(
            "Expected Statics problem activity.",
          );
        }

        let evidence =
          createEmptyLearningCompletionEvidence();

        evidence =
          recordLearningCompletionEvent(
            evidence,
            "attempt_submitted",
          );

        const completion =
          evaluateLearningCompletion(
            activity.completionRule,
            evidence,
          );

        const draft =
          createAssessmentAttempt<{
            readonly value:
              number;
          }>({
            attemptId:
              "locale-equivalence-attempt-1",

            activityId:
              "activity-ssb-05",

            activityVersion:
              "1.0.0",

            assessmentId:
              "activity-ssb-05-assessment",

            assessmentVersion:
              "1.0.0",

            attemptNumber:
              1,
          });

        const submitted =
          submitAssessmentAttempt(
            draft,
            {
              value:
                0,
            },
          );

        const evaluated =
          evaluateAssessmentAttempt(
            submitted,

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
            ),
          );

        const snapshot =
          getAssessmentCompletionSnapshot(
            evaluated,
          );

        expect(
          completion.completed,
        ).toBe(
          true,
        );

        expect(
          snapshot.submitted,
        ).toBe(
          true,
        );

        expect(
          snapshot.evaluated,
        ).toBe(
          true,
        );

        expect(
          snapshot.correct,
        ).toBe(
          false,
        );

        expect(
          "mastered" in snapshot,
        ).toBe(
          false,
        );
      },
    );
  },
);