import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AssessmentResultError,
  createAssessmentResult,
} from "@/domain/assessment/result";

describe(
  "Assessment result",
  () => {
    it(
      "creates a fully correct assessment result",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "reaction-a",

                status:
                  "correct",

                score:
                  1,

                maxScore:
                  1,
              },

              {
                id:
                  "reaction-b",

                status:
                  "correct",

                score:
                  1,

                maxScore:
                  1,
              },
            ],
          );

        expect(
          result.status,
        ).toBe(
          "correct",
        );

        expect(
          result.correct,
        ).toBe(
          true,
        );

        expect(
          result.score,
        ).toBe(
          2,
        );

        expect(
          result.maxScore,
        ).toBe(
          2,
        );

        expect(
          result.normalizedScore,
        ).toBe(
          1,
        );
      },
    );

    it(
      "creates a partially correct result without calling it correct",
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
              },
            ],
          );

        expect(
          result.status,
        ).toBe(
          "partially_correct",
        );

        expect(
          result.correct,
        ).toBe(
          false,
        );

        expect(
          result.normalizedScore,
        ).toBeCloseTo(
          0.5,
          12,
        );
      },
    );

    it(
      "creates a completely incorrect result",
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

        expect(
          result.status,
        ).toBe(
          "incorrect",
        );

        expect(
          result.correct,
        ).toBe(
          false,
        );
      },
    );

    it(
      "propagates invalid item status to the whole assessment",
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
                  "invalid",

                score:
                  0,

                maxScore:
                  1,
              },
            ],
          );

        expect(
          result.status,
        ).toBe(
          "invalid",
        );

        expect(
          result.correct,
        ).toBe(
          false,
        );
      },
    );

    it(
      "supports weighted assessment items",
      () => {
        const result =
          createAssessmentResult(
            [
              {
                id:
                  "numeric-result",

                status:
                  "correct",

                score:
                  2,

                maxScore:
                  2,
              },

              {
                id:
                  "interpretation",

                status:
                  "incorrect",

                score:
                  0,

                maxScore:
                  1,
              },
            ],
          );

        expect(
          result.score,
        ).toBe(
          2,
        );

        expect(
          result.maxScore,
        ).toBe(
          3,
        );

        expect(
          result.normalizedScore,
        ).toBeCloseTo(
          2 /
            3,
          12,
        );

        expect(
          result.status,
        ).toBe(
          "partially_correct",
        );
      },
    );

    it(
      "rejects duplicate item IDs",
      () => {
        expect(
          () =>
            createAssessmentResult(
              [
                {
                  id:
                    "same",

                  status:
                    "correct",

                  score:
                    1,

                  maxScore:
                    1,
                },

                {
                  id:
                    "same",

                  status:
                    "correct",

                  score:
                    1,

                  maxScore:
                    1,
                },
              ],
            ),
        ).toThrow(
          AssessmentResultError,
        );
      },
    );

    it(
      "rejects impossible score states",
      () => {
        expect(
          () =>
            createAssessmentResult(
              [
                {
                  id:
                    "bad-score",

                  status:
                    "correct",

                  score:
                    0,

                  maxScore:
                    1,
                },
              ],
            ),
        ).toThrow(
          AssessmentResultError,
        );

        expect(
          () =>
            createAssessmentResult(
              [
                {
                  id:
                    "too-high",

                  status:
                    "incorrect",

                  score:
                    2,

                  maxScore:
                    1,
                },
              ],
            ),
        ).toThrow(
          AssessmentResultError,
        );
      },
    );

    it(
      "rejects an empty assessment result",
      () => {
        expect(
          () =>
            createAssessmentResult(
              [],
            ),
        ).toThrow(
          AssessmentResultError,
        );
      },
    );
  },
);