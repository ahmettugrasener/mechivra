import {
  describe,
  expect,
  it,
} from "vitest";

import {
  NumericAssessmentError,
  evaluateNumericAssessment,
} from "@/domain/assessment/numeric-evaluation";

import type {
  NumericAssessmentItemDefinition,
} from "@/domain/assessment/numeric-evaluation";

const definitions:
  readonly NumericAssessmentItemDefinition[] =
  [
    {
      id:
        "temperature",

      expectedValue:
        300,

      quantityId:
        "absolute_temperature",

      expectedUnitId:
        "K",

      tolerance: {
        absolute:
          0.5,

        relative:
          0.001,
      },

      maxScore:
        1,

      correctFeedbackCode:
        "temperature.correct",

      incorrectFeedbackCode:
        "temperature.incorrect",

      invalidFeedbackCode:
        "temperature.invalid",
    },

    {
      id:
        "pressure",

      expectedValue:
        100,

      quantityId:
        "pressure",

      expectedUnitId:
        "kPa",

      tolerance: {
        absolute:
          1,

        relative:
          0.001,
      },

      maxScore:
        2,

      correctFeedbackCode:
        "pressure.correct",

      incorrectFeedbackCode:
        "pressure.incorrect",

      invalidFeedbackCode:
        "pressure.invalid",
    },
  ];

describe(
  "Unified numeric assessment",
  () => {
    it(
      "evaluates a fully correct multi-field response",
      () => {
        const evaluation =
          evaluateNumericAssessment(
            definitions,
            [
              {
                itemId:
                  "temperature",

                value:
                  300.2,
              },

              {
                itemId:
                  "pressure",

                value:
                  100.5,
              },
            ],
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "correct",
        );

        expect(
          evaluation.result.score,
        ).toBe(
          3,
        );

        expect(
          evaluation.result.maxScore,
        ).toBe(
          3,
        );

        expect(
          evaluation.result.correct,
        ).toBe(
          true,
        );
      },
    );

    it(
      "preserves partial correctness across fields",
      () => {
        const evaluation =
          evaluateNumericAssessment(
            definitions,
            [
              {
                itemId:
                  "temperature",

                value:
                  300,
              },

              {
                itemId:
                  "pressure",

                value:
                  130,
              },
            ],
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "partially_correct",
        );

        expect(
          evaluation.result.score,
        ).toBe(
          1,
        );

        expect(
          evaluation.result.maxScore,
        ).toBe(
          3,
        );

        expect(
          evaluation.items[0]
            ?.result.status,
        ).toBe(
          "correct",
        );

        expect(
          evaluation.items[1]
            ?.result.status,
        ).toBe(
          "incorrect",
        );
      },
    );

    it(
      "marks a missing submitted field as invalid rather than numerically wrong",
      () => {
        const evaluation =
          evaluateNumericAssessment(
            definitions,
            [
              {
                itemId:
                  "temperature",

                value:
                  300,
              },
            ],
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.items[1]
            ?.result.status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.items[1]
            ?.result.feedbackCode,
        ).toBe(
          "pressure.invalid",
        );
      },
    );

    it(
      "marks NaN response as invalid",
      () => {
        const evaluation =
          evaluateNumericAssessment(
            definitions,
            [
              {
                itemId:
                  "temperature",

                value:
                  Number.NaN,
              },

              {
                itemId:
                  "pressure",

                value:
                  100,
              },
            ],
          );

        expect(
          evaluation.items[0]
            ?.result.status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.result.status,
        ).toBe(
          "invalid",
        );
      },
    );

    it(
      "keeps quantity and unit metadata available without performing hidden conversion",
      () => {
        const evaluation =
          evaluateNumericAssessment(
            definitions,
            [
              {
                itemId:
                  "temperature",

                value:
                  300,
              },

              {
                itemId:
                  "pressure",

                value:
                  100,
              },
            ],
          );

        expect(
          evaluation.items[0]
            ?.definition
            .quantityId,
        ).toBe(
          "absolute_temperature",
        );

        expect(
          evaluation.items[1]
            ?.definition
            .expectedUnitId,
        ).toBe(
          "kPa",
        );
      },
    );

    it(
      "preserves field-specific feedback codes",
      () => {
        const evaluation =
          evaluateNumericAssessment(
            definitions,
            [
              {
                itemId:
                  "temperature",

                value:
                  300,
              },

              {
                itemId:
                  "pressure",

                value:
                  500,
              },
            ],
          );

        expect(
          evaluation.items[0]
            ?.result.feedbackCode,
        ).toBe(
          "temperature.correct",
        );

        expect(
          evaluation.items[1]
            ?.result.feedbackCode,
        ).toBe(
          "pressure.incorrect",
        );
      },
    );

    it(
      "rejects unknown response IDs instead of silently ignoring them",
      () => {
        expect(
          () =>
            evaluateNumericAssessment(
              definitions,
              [
                {
                  itemId:
                    "temperature",

                  value:
                    300,
                },

                {
                  itemId:
                    "pressure",

                  value:
                    100,
                },

                {
                  itemId:
                    "invented-field",

                  value:
                    42,
                },
              ],
            ),
        ).toThrow(
          NumericAssessmentError,
        );
      },
    );

    it(
      "rejects duplicate response IDs",
      () => {
        expect(
          () =>
            evaluateNumericAssessment(
              definitions,
              [
                {
                  itemId:
                    "temperature",

                  value:
                    300,
                },

                {
                  itemId:
                    "temperature",

                  value:
                    301,
                },
              ],
            ),
        ).toThrow(
          NumericAssessmentError,
        );
      },
    );

    it(
      "rejects malformed assessment definitions",
      () => {
        expect(
          () =>
            evaluateNumericAssessment(
              [
                {
                  id:
                    "bad",

                  expectedValue:
                    10,

                  quantityId:
                    "",

                  expectedUnitId:
                    "N",

                  tolerance: {
                    absolute:
                      0.1,

                    relative:
                      0.01,
                  },

                  maxScore:
                    1,
                },
              ],
              [
                {
                  itemId:
                    "bad",

                  value:
                    10,
                },
              ],
            ),
        ).toThrow(
          NumericAssessmentError,
        );
      },
    );
  },
);