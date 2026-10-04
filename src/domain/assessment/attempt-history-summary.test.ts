import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createAssessmentAttempt,
  evaluateAssessmentAttempt,
  submitAssessmentAttempt,
} from "@/domain/assessment/attempt";

import {
  appendAssessmentAttempt,
  createAssessmentAttemptHistory,
} from "@/domain/assessment/attempt-history";

import {
  summarizeAssessmentAttemptHistory,
} from "@/domain/assessment/attempt-history-summary";

import {
  createAssessmentResult,
} from "@/domain/assessment/result";

import {
  createAssessmentRevision,
} from "@/domain/assessment/revision";

interface TestResponse {
  readonly answer:
    string;
}

function evaluateAttempt(
  attemptNumber:
    number,

  attemptId:
    string,

  correct:
    boolean,
  score:
    number,
) {
  const draft =
    createAssessmentAttempt<TestResponse>(
      {
        attemptId,

        activityId:
          "activity-test",

        activityVersion:
          "1.0.0",

        assessmentId:
          "assessment-test",

        assessmentVersion:
          "1.0.0",

        attemptNumber,
      },
    );

  const submitted =
    submitAssessmentAttempt(
      draft,
      {
        answer:
          `answer-${attemptNumber}`,
      },
    );

  return evaluateAssessmentAttempt(
    submitted,
    createAssessmentResult(
      [
        {
          id:
            "part-a",

          status:
            score >=
            0.5
              ? "correct"
              : "incorrect",

          score:
            score >=
            0.5
              ? 1
              : 0,

          maxScore:
            1,
        },

        {
          id:
            "part-b",

          status:
            correct
              ? "correct"
              : "incorrect",

          score:
            correct
              ? 1
              : 0,

          maxScore:
            1,
        },
      ],
    ),
  );
}

describe(
  "Assessment attempt history summary",
  () => {
    it(
      "summarizes an untouched draft",
      () => {
        const draft =
          createAssessmentAttempt<TestResponse>(
            {
              attemptId:
                "attempt-1",

              activityId:
                "activity-test",

              activityVersion:
                "1.0.0",

              assessmentId:
                "assessment-test",

              assessmentVersion:
                "1.0.0",

              attemptNumber:
                1,
            },
          );

        const summary =
          summarizeAssessmentAttemptHistory(
            createAssessmentAttemptHistory(
              draft,
            ),
          );

        expect(
          summary,
        ).toEqual({
          attemptCount:
            1,

          evaluatedAttemptCount:
            0,

          firstAttemptCorrect:
            null,

          latestAttemptCorrect:
            null,

          hasCorrectAttempt:
            false,

          highestNormalizedScore:
            null,
        });
      },
    );

    it(
      "distinguishes first-attempt performance from eventual success",
      () => {
        const first =
          evaluateAttempt(
            1,
            "attempt-1",
            false,
            0,
          );

        let history =
          createAssessmentAttemptHistory(
            first,
          );

        const secondDraft =
          createAssessmentRevision(
            first,
            {
              attemptId:
                "attempt-2",
            },
          );

        const secondSubmitted =
          submitAssessmentAttempt(
            secondDraft,
            {
              answer:
                "answer-2",
            },
          );

        const second =
          evaluateAssessmentAttempt(
            secondSubmitted,
            createAssessmentResult(
              [
                {
                  id:
                    "part-a",

                  status:
                    "correct",

                  score:
                    1,

                  maxScore:
                    1,
                },

                {
                  id:
                    "part-b",

                  status:
                    "correct",

                  score:
                    1,

                  maxScore:
                    1,
                },
              ],
            ),
          );

        history =
          appendAssessmentAttempt(
            history,
            second,
          );

        const summary =
          summarizeAssessmentAttemptHistory(
            history,
          );

        expect(
          summary.attemptCount,
        ).toBe(
          2,
        );

        expect(
          summary.firstAttemptCorrect,
        ).toBe(
          false,
        );

        expect(
          summary.latestAttemptCorrect,
        ).toBe(
          true,
        );

        expect(
          summary.hasCorrectAttempt,
        ).toBe(
          true,
        );

        expect(
          summary.highestNormalizedScore,
        ).toBe(
          1,
        );
      },
    );

    it(
      "does not equate eventual success with first-attempt success",
      () => {
        const first =
          evaluateAttempt(
            1,
            "attempt-1",
            false,
            0,
          );

        let history =
          createAssessmentAttemptHistory(
            first,
          );

        const secondDraft =
          createAssessmentRevision(
            first,
            {
              attemptId:
                "attempt-2",
            },
          );

        const second =
          evaluateAssessmentAttempt(
            submitAssessmentAttempt(
              secondDraft,
              {
                answer:
                  "corrected",
              },
            ),
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
            ),
          );

        history =
          appendAssessmentAttempt(
            history,
            second,
          );

        const summary =
          summarizeAssessmentAttemptHistory(
            history,
          );

        expect(
          summary.firstAttemptCorrect,
        ).toBe(
          false,
        );

        expect(
          summary.hasCorrectAttempt,
        ).toBe(
          true,
        );
      },
    );
  },
);