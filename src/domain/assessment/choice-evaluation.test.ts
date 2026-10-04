import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ChoiceAssessmentError,
  evaluateChoiceAssessment,
} from "@/domain/assessment/choice-evaluation";

import type {
  ChoiceAssessmentDefinition,
} from "@/domain/assessment/choice-evaluation";

const prediction:
  ChoiceAssessmentDefinition =
  {
    id:
      "compression-ratio-prediction",

    kind:
      "prediction",

    options: [
      {
        id:
          "decreases",

        feedbackCode:
          "otto.prediction.efficiency-decreases",
      },

      {
        id:
          "increases",

        feedbackCode:
          "otto.prediction.correct",
      },

      {
        id:
          "unchanged",

        feedbackCode:
          "otto.prediction.efficiency-unchanged",
      },
    ],

    correctOptionId:
      "increases",

    maxScore:
      1,

    correctFeedbackCode:
      "otto.prediction.correct",

    invalidFeedbackCode:
      "assessment.choice.missing",
  };

describe(
  "Choice assessment evaluation",
  () => {
    it(
      "accepts the correct prediction",
      () => {
        const evaluation =
          evaluateChoiceAssessment(
            prediction,
            {
              selectedOptionId:
                "increases",
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "correct",
        );

        expect(
          evaluation.result.correct,
        ).toBe(
          true,
        );

        expect(
          evaluation.result.score,
        ).toBe(
          1,
        );

        expect(
          evaluation.result.items[0]
            ?.feedbackCode,
        ).toBe(
          "otto.prediction.correct",
        );
      },
    );

    it(
      "rejects a finite but conceptually incorrect prediction",
      () => {
        const evaluation =
          evaluateChoiceAssessment(
            prediction,
            {
              selectedOptionId:
                "unchanged",
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "incorrect",
        );

        expect(
          evaluation.result.correct,
        ).toBe(
          false,
        );

        expect(
          evaluation.result.score,
        ).toBe(
          0,
        );

        expect(
          evaluation.result.items[0]
            ?.feedbackCode,
        ).toBe(
          "otto.prediction.efficiency-unchanged",
        );
      },
    );

    it(
      "keeps wrong-option misconception feedback separate by option",
      () => {
        const decreases =
          evaluateChoiceAssessment(
            prediction,
            {
              selectedOptionId:
                "decreases",
            },
          );

        const unchanged =
          evaluateChoiceAssessment(
            prediction,
            {
              selectedOptionId:
                "unchanged",
            },
          );

        expect(
          decreases.result.items[0]
            ?.feedbackCode,
        ).toBe(
          "otto.prediction.efficiency-decreases",
        );

        expect(
          unchanged.result.items[0]
            ?.feedbackCode,
        ).toBe(
          "otto.prediction.efficiency-unchanged",
        );

        expect(
          decreases.result.items[0]
            ?.feedbackCode,
        ).not.toBe(
          unchanged.result.items[0]
            ?.feedbackCode,
        );
      },
    );

    it(
      "marks a missing selection as invalid rather than incorrect",
      () => {
        const evaluation =
          evaluateChoiceAssessment(
            prediction,
            {
              selectedOptionId:
                null,
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.result.items[0]
            ?.feedbackCode,
        ).toBe(
          "assessment.choice.missing",
        );
      },
    );

    it(
      "marks an unknown submitted option as invalid",
      () => {
        const evaluation =
          evaluateChoiceAssessment(
            prediction,
            {
              selectedOptionId:
                "invented-option",
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.selectedOption,
        ).toBeNull();
      },
    );

    it(
      "supports ordinary conceptual choice questions in addition to predictions",
      () => {
        const evaluation =
          evaluateChoiceAssessment(
            {
              id:
                "process-kind",

              kind:
                "choice",

              options: [
                {
                  id:
                    "constant-volume",
                },

                {
                  id:
                    "isentropic",
                },
              ],

              correctOptionId:
                "isentropic",

              maxScore:
                2,
            },
            {
              selectedOptionId:
                "isentropic",
            },
          );

        expect(
          evaluation.definition.kind,
        ).toBe(
          "choice",
        );

        expect(
          evaluation.result.score,
        ).toBe(
          2,
        );

        expect(
          evaluation.result.maxScore,
        ).toBe(
          2,
        );
      },
    );

    it(
      "rejects duplicate option IDs",
      () => {
        expect(
          () =>
            evaluateChoiceAssessment(
              {
                id:
                  "bad",

                kind:
                  "choice",

                options: [
                  {
                    id:
                      "same",
                  },

                  {
                    id:
                      "same",
                  },
                ],

                correctOptionId:
                  "same",

                maxScore:
                  1,
              },
              {
                selectedOptionId:
                  "same",
              },
            ),
        ).toThrow(
          ChoiceAssessmentError,
        );
      },
    );

    it(
      "rejects a correct option that is not in the option set",
      () => {
        expect(
          () =>
            evaluateChoiceAssessment(
              {
                id:
                  "bad",

                kind:
                  "prediction",

                options: [
                  {
                    id:
                      "a",
                  },

                  {
                    id:
                      "b",
                  },
                ],

                correctOptionId:
                  "c",

                maxScore:
                  1,
              },
              {
                selectedOptionId:
                  "a",
              },
            ),
        ).toThrow(
          ChoiceAssessmentError,
        );
      },
    );

    it(
      "rejects assessment definitions with fewer than two choices",
      () => {
        expect(
          () =>
            evaluateChoiceAssessment(
              {
                id:
                  "bad",

                kind:
                  "choice",

                options: [
                  {
                    id:
                      "only",
                  },
                ],

                correctOptionId:
                  "only",

                maxScore:
                  1,
              },
              {
                selectedOptionId:
                  "only",
              },
            ),
        ).toThrow(
          ChoiceAssessmentError,
        );
      },
    );

    it(
      "rejects invalid maximum score",
      () => {
        expect(
          () =>
            evaluateChoiceAssessment(
              {
                id:
                  "bad-score",

                kind:
                  "choice",

                options: [
                  {
                    id:
                      "a",
                  },

                  {
                    id:
                      "b",
                  },
                ],

                correctOptionId:
                  "a",

                maxScore:
                  0,
              },
              {
                selectedOptionId:
                  "a",
              },
            ),
        ).toThrow(
          ChoiceAssessmentError,
        );
      },
    );
  },
);