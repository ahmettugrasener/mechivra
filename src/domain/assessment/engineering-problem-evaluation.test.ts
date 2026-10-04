import {
  describe,
  expect,
  it,
} from "vitest";

import {
  EngineeringProblemEvaluationError,
  evaluateEngineeringProblem,
} from "@/domain/assessment/engineering-problem-evaluation";

import type {
  EngineeringProblemDefinition,
} from "@/domain/assessment/engineering-problem-evaluation";

const bendingLikeProblem:
  EngineeringProblemDefinition =
  {
    id:
      "bending-multi-field-example",

    version:
      "1.0.0",

    numericItems: [
      {
        id:
          "second-moment-area",

        expectedValue:
          2.1333333333333334e-7,

        quantityId:
          "second_moment_area",

        expectedUnitId:
          "m4",

        tolerance: {
          absolute:
            1e-10,

          relative:
            0.001,
        },

        maxScore:
          1,
      },

      {
        id:
          "maximum-stress",

        expectedValue:
          46.875,

        quantityId:
          "stress",

        expectedUnitId:
          "MPa",

        tolerance: {
          absolute:
            0.05,

          relative:
            0.001,
        },

        maxScore:
          1,
      },

      {
        id:
          "maximum-deflection",

        expectedValue:
          3.7202380952380953,

        quantityId:
          "length",

        expectedUnitId:
          "mm",

        tolerance: {
          absolute:
            0.01,

          relative:
            0.001,
        },

        maxScore:
          1,
      },
    ],

    choiceItems: [
      {
        role:
          "criterion",

        definition: {
          id:
            "stress-criterion",

          kind:
            "choice",

          options: [
            {
              id:
                "pass",
            },

            {
              id:
                "fail",
            },

            {
              id:
                "unknown",
            },

            {
              id:
                "not-evaluated",
            },
          ],

          correctOptionId:
            "unknown",

          maxScore:
            1,

          correctFeedbackCode:
            "bending.stress-criterion.correct",

          invalidFeedbackCode:
            "assessment.choice.missing",
        },
      },

      {
        role:
          "criterion",

        definition: {
          id:
            "deflection-criterion",

          kind:
            "choice",

          options: [
            {
              id:
                "pass",
            },

            {
              id:
                "fail",

              feedbackCode:
                "bending.deflection-criterion.correct",
            },

            {
              id:
                "unknown",
            },

            {
              id:
                "not-evaluated",
            },
          ],

          correctOptionId:
            "fail",

          maxScore:
            1,

          correctFeedbackCode:
            "bending.deflection-criterion.correct",

          invalidFeedbackCode:
            "assessment.choice.missing",
        },
      },
    ],
  };

describe(
  "Multi-field engineering problem evaluation",
  () => {
    it(
      "accepts a completely correct numeric and criterion response",
      () => {
        const evaluation =
          evaluateEngineeringProblem(
            bendingLikeProblem,
            {
              numeric: [
                {
                  itemId:
                    "second-moment-area",

                  value:
                    2.1333333333333334e-7,
                },

                {
                  itemId:
                    "maximum-stress",

                  value:
                    46.875,
                },

                {
                  itemId:
                    "maximum-deflection",

                  value:
                    3.7202,
                },
              ],

              choices: [
                {
                  itemId:
                    "stress-criterion",

                  selectedOptionId:
                    "unknown",
                },

                {
                  itemId:
                    "deflection-criterion",

                  selectedOptionId:
                    "fail",
                },
              ],
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
          5,
        );

        expect(
          evaluation.result.maxScore,
        ).toBe(
          5,
        );
      },
    );

    it(
      "does not call the whole problem correct when all numbers are right but a criterion is wrong",
      () => {
        const evaluation =
          evaluateEngineeringProblem(
            bendingLikeProblem,
            {
              numeric: [
                {
                  itemId:
                    "second-moment-area",

                  value:
                    2.1333333333333334e-7,
                },

                {
                  itemId:
                    "maximum-stress",

                  value:
                    46.875,
                },

                {
                  itemId:
                    "maximum-deflection",

                  value:
                    3.7202,
                },
              ],

              choices: [
                {
                  itemId:
                    "stress-criterion",

                  selectedOptionId:
                    "pass",
                },

                {
                  itemId:
                    "deflection-criterion",

                  selectedOptionId:
                    "fail",
                },
              ],
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "partially_correct",
        );

        expect(
          evaluation.result.correct,
        ).toBe(
          false,
        );

        expect(
          evaluation.numeric
            ?.result.correct,
        ).toBe(
          true,
        );

        expect(
          evaluation.choices[0]
            ?.evaluation
            .result.correct,
        ).toBe(
          false,
        );
      },
    );

    it(
      "does not call the whole problem correct when criteria are right but a number is wrong",
      () => {
        const evaluation =
          evaluateEngineeringProblem(
            bendingLikeProblem,
            {
              numeric: [
                {
                  itemId:
                    "second-moment-area",

                  value:
                    2.1333333333333334e-7,
                },

                {
                  itemId:
                    "maximum-stress",

                  value:
                    100,
                },

                {
                  itemId:
                    "maximum-deflection",

                  value:
                    3.7202,
                },
              ],

              choices: [
                {
                  itemId:
                    "stress-criterion",

                  selectedOptionId:
                    "unknown",
                },

                {
                  itemId:
                    "deflection-criterion",

                  selectedOptionId:
                    "fail",
                },
              ],
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "partially_correct",
        );

        expect(
          evaluation.result.correct,
        ).toBe(
          false,
        );

        expect(
          evaluation.numeric
            ?.result.status,
        ).toBe(
          "partially_correct",
        );
      },
    );

    it(
      "preserves pass, fail, unknown, and not-evaluated as possible engineering criterion choices",
      () => {
        const criterion =
          bendingLikeProblem
            .choiceItems[0];

        expect(
          criterion,
        ).toBeDefined();

        expect(
          criterion
            ?.definition
            .options.map(
              (
                option,
              ) =>
                option.id,
            ),
        ).toEqual([
          "pass",
          "fail",
          "unknown",
          "not-evaluated",
        ]);
      },
    );

    it(
      "marks a missing numeric answer as invalid",
      () => {
        const evaluation =
          evaluateEngineeringProblem(
            bendingLikeProblem,
            {
              numeric: [
                {
                  itemId:
                    "second-moment-area",

                  value:
                    2.1333333333333334e-7,
                },

                {
                  itemId:
                    "maximum-stress",

                  value:
                    46.875,
                },
              ],

              choices: [
                {
                  itemId:
                    "stress-criterion",

                  selectedOptionId:
                    "unknown",
                },

                {
                  itemId:
                    "deflection-criterion",

                  selectedOptionId:
                    "fail",
                },
              ],
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.numeric
            ?.items.find(
              (
                item,
              ) =>
                item.definition
                  .id ===
                "maximum-deflection",
            )
            ?.result.status,
        ).toBe(
          "invalid",
        );
      },
    );

    it(
      "marks a missing criterion response as invalid",
      () => {
        const evaluation =
          evaluateEngineeringProblem(
            bendingLikeProblem,
            {
              numeric: [
                {
                  itemId:
                    "second-moment-area",

                  value:
                    2.1333333333333334e-7,
                },

                {
                  itemId:
                    "maximum-stress",

                  value:
                    46.875,
                },

                {
                  itemId:
                    "maximum-deflection",

                  value:
                    3.7202,
                },
              ],

              choices: [
                {
                  itemId:
                    "stress-criterion",

                  selectedOptionId:
                    "unknown",
                },
              ],
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.choices[1]
            ?.evaluation
            .result.status,
        ).toBe(
          "invalid",
        );
      },
    );

    it(
      "supports a purely numeric engineering problem",
      () => {
        const evaluation =
          evaluateEngineeringProblem(
            {
              id:
                "pure-numeric",

              version:
                "1.0.0",

              numericItems: [
                {
                  id:
                    "reaction",

                  expectedValue:
                    5,

                  quantityId:
                    "force",

                  expectedUnitId:
                    "kN",

                  tolerance: {
                    absolute:
                      0.01,

                    relative:
                      0.001,
                  },

                  maxScore:
                    1,
                },
              ],

              choiceItems: [],
            },
            {
              numeric: [
                {
                  itemId:
                    "reaction",

                  value:
                    5,
                },
              ],

              choices: [],
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "correct",
        );

        expect(
          evaluation.choices,
        ).toHaveLength(
          0,
        );
      },
    );

    it(
      "supports a decision-only engineering problem",
      () => {
        const evaluation =
          evaluateEngineeringProblem(
            {
              id:
                "decision-only",

              version:
                "1.0.0",

              numericItems: [],

              choiceItems: [
                {
                  role:
                    "decision",

                  definition: {
                    id:
                      "candidate-selection",

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
                      "b",

                    maxScore:
                      1,
                  },
                },
              ],
            },
            {
              numeric: [],

              choices: [
                {
                  itemId:
                    "candidate-selection",

                  selectedOptionId:
                    "b",
                },
              ],
            },
          );

        expect(
          evaluation.result.status,
        ).toBe(
          "correct",
        );

        expect(
          evaluation.choices[0]
            ?.role,
        ).toBe(
          "decision",
        );
      },
    );

    it(
      "rejects duplicate IDs across numeric and choice items",
      () => {
        expect(
          () =>
            evaluateEngineeringProblem(
              {
                id:
                  "duplicate",

                version:
                  "1.0.0",

                numericItems: [
                  {
                    id:
                      "same-id",

                    expectedValue:
                      1,

                    quantityId:
                      "dimensionless",

                    expectedUnitId:
                      "one",

                    tolerance: {
                      absolute:
                        0.01,

                      relative:
                        0.01,
                    },

                    maxScore:
                      1,
                  },
                ],

                choiceItems: [
                  {
                    role:
                      "criterion",

                    definition: {
                      id:
                        "same-id",

                      kind:
                        "choice",

                      options: [
                        {
                          id:
                            "pass",
                        },

                        {
                          id:
                            "fail",
                        },
                      ],

                      correctOptionId:
                        "pass",

                      maxScore:
                        1,
                    },
                  },
                ],
              },
              {
                numeric: [],
                choices: [],
              },
            ),
        ).toThrow(
          EngineeringProblemEvaluationError,
        );
      },
    );

    it(
      "rejects prediction definitions inside an engineering problem criterion slot",
      () => {
        expect(
          () =>
            evaluateEngineeringProblem(
              {
                id:
                  "bad-kind",

                version:
                  "1.0.0",

                numericItems: [],

                choiceItems: [
                  {
                    role:
                      "criterion",

                    definition: {
                      id:
                        "criterion",

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
                        "a",

                      maxScore:
                        1,
                    },
                  },
                ],
              },
              {
                numeric: [],

                choices: [],
              },
            ),
        ).toThrow(
          EngineeringProblemEvaluationError,
        );
      },
    );

    it(
      "rejects unknown choice response IDs",
      () => {
        expect(
          () =>
            evaluateEngineeringProblem(
              bendingLikeProblem,
              {
                numeric: [],

                choices: [
                  {
                    itemId:
                      "invented-criterion",

                    selectedOptionId:
                      "pass",
                  },
                ],
              },
            ),
        ).toThrow(
          EngineeringProblemEvaluationError,
        );
      },
    );
  },
);