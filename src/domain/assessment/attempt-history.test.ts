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
  AssessmentAttemptHistoryError,
  appendAssessmentAttempt,
  createAssessmentAttemptHistory,
  getLatestAssessmentAttempt,
  replaceLatestAssessmentAttempt,
} from "@/domain/assessment/attempt-history";

import {
  createAssessmentResult,
} from "@/domain/assessment/result";

import {
  createAssessmentRevision,
} from "@/domain/assessment/revision";

interface TestResponse {
  readonly value:
    number;
}

function createFirstDraft() {
  return createAssessmentAttempt<TestResponse>(
    {
      attemptId:
        "attempt-1",

      activityId:
        "activity-bending-05",

      activityVersion:
        "1.0.0",

      assessmentId:
        "bending-problem",

      assessmentVersion:
        "1.0.0",

      attemptNumber:
        1,
    },
  );
}

function evaluate(
  attempt:
    ReturnType<
      typeof createFirstDraft
    >,

  value:
    number,

  correct:
    boolean,
) {
  const submitted =
    submitAssessmentAttempt(
      attempt,
      {
        value,
      },
    );

  return evaluateAssessmentAttempt(
    submitted,
    createAssessmentResult(
      [
        {
          id:
            "answer",

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
  "Assessment attempt history",
  () => {
    it(
      "starts with attempt number one",
      () => {
        const history =
          createAssessmentAttemptHistory(
            createFirstDraft(),
          );

        expect(
          history.attempts,
        ).toHaveLength(
          1,
        );

        expect(
          history.attempts[0]
            ?.attemptNumber,
        ).toBe(
          1,
        );
      },
    );

    it(
      "advances the latest attempt through draft, submitted, and evaluated without adding a new attempt",
      () => {
        const draft =
          createFirstDraft();

        let history =
          createAssessmentAttemptHistory(
            draft,
          );

        const submitted =
          submitAssessmentAttempt(
            draft,
            {
              value:
                5,
            },
          );

        history =
          replaceLatestAssessmentAttempt(
            history,
            submitted,
          );

        expect(
          history.attempts,
        ).toHaveLength(
          1,
        );

        expect(
          getLatestAssessmentAttempt(
            history,
          ).status,
        ).toBe(
          "submitted",
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

        history =
          replaceLatestAssessmentAttempt(
            history,
            evaluated,
          );

        expect(
          history.attempts,
        ).toHaveLength(
          1,
        );

        expect(
          getLatestAssessmentAttempt(
            history,
          ).status,
        ).toBe(
          "evaluated",
        );
      },
    );

    it(
      "appends a revision as a new immutable attempt",
      () => {
        const attempt1 =
          evaluate(
            createFirstDraft(),
            5,
            false,
          );

        let history =
          createAssessmentAttemptHistory(
            attempt1,
          );

        const attempt2 =
          createAssessmentRevision(
            attempt1,
            {
              attemptId:
                "attempt-2",
            },
          );

        history =
          appendAssessmentAttempt(
            history,
            attempt2,
          );

        expect(
          history.attempts,
        ).toHaveLength(
          2,
        );

        expect(
          history.attempts[0]
            ?.result
            ?.correct,
        ).toBe(
          false,
        );

        expect(
          history.attempts[1]
            ?.status,
        ).toBe(
          "draft",
        );

        expect(
          history.attempts[1]
            ?.attemptNumber,
        ).toBe(
          2,
        );
      },
    );

    it(
      "preserves complete result history across multiple revisions",
      () => {
        const first =
          evaluate(
            createFirstDraft(),
            5,
            false,
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
          evaluate(
            secondDraft,
            8,
            false,
          );

        history =
          appendAssessmentAttempt(
            history,
            second,
          );

        const thirdDraft =
          createAssessmentRevision(
            second,
            {
              attemptId:
                "attempt-3",
            },
          );

        const third =
          evaluate(
            thirdDraft,
            10,
            true,
          );

        history =
          appendAssessmentAttempt(
            history,
            third,
          );

        expect(
          history.attempts.map(
            (
              attempt,
            ) =>
              attempt.attemptNumber,
          ),
        ).toEqual([
          1,
          2,
          3,
        ]);

        expect(
          history.attempts.map(
            (
              attempt,
            ) =>
              attempt.result
                ?.correct,
          ),
        ).toEqual([
          false,
          false,
          true,
        ]);

        expect(
          history.attempts.map(
            (
              attempt,
            ) =>
              attempt.response,
          ),
        ).toEqual([
          {
            value:
              5,
          },

          {
            value:
              8,
          },

          {
            value:
              10,
          },
        ]);
      },
    );

    it(
      "rejects skipped attempt numbers",
      () => {
        const first =
          evaluate(
            createFirstDraft(),
            5,
            false,
          );

        const history =
          createAssessmentAttemptHistory(
            first,
          );

        const attempt3 =
          createAssessmentAttempt<TestResponse>(
            {
              attemptId:
                "attempt-3",

              activityId:
                "activity-bending-05",

              activityVersion:
                "1.0.0",

              assessmentId:
                "bending-problem",

              assessmentVersion:
                "1.0.0",

              attemptNumber:
                3,
            },
          );

        expect(
          () =>
            appendAssessmentAttempt(
              history,
              attempt3,
            ),
        ).toThrow(
          AssessmentAttemptHistoryError,
        );
      },
    );

    it(
      "rejects a revision from another assessment",
      () => {
        const first =
          evaluate(
            createFirstDraft(),
            5,
            false,
          );

        const history =
          createAssessmentAttemptHistory(
            first,
          );

        const foreign =
          createAssessmentAttempt<TestResponse>(
            {
              attemptId:
                "attempt-2",

              activityId:
                "activity-otto-05",

              activityVersion:
                "1.0.0",

              assessmentId:
                "otto-problem",

              assessmentVersion:
                "1.0.0",

              attemptNumber:
                2,
            },
          );

        expect(
          () =>
            appendAssessmentAttempt(
              history,
              foreign,
            ),
        ).toThrow(
          AssessmentAttemptHistoryError,
        );
      },
    );

    it(
      "rejects duplicate attempt IDs",
      () => {
        const first =
          evaluate(
            createFirstDraft(),
            5,
            false,
          );

        const history =
          createAssessmentAttemptHistory(
            first,
          );

        const duplicate =
          createAssessmentAttempt<TestResponse>(
            {
              attemptId:
                "attempt-1",

              activityId:
                "activity-bending-05",

              activityVersion:
                "1.0.0",

              assessmentId:
                "bending-problem",

              assessmentVersion:
                "1.0.0",

              attemptNumber:
                2,
            },
          );

        expect(
          () =>
            appendAssessmentAttempt(
              history,
              duplicate,
            ),
        ).toThrow(
          AssessmentAttemptHistoryError,
        );
      },
    );

    it(
      "requires the initial attempt to be number one",
      () => {
        const second =
          createAssessmentAttempt<TestResponse>(
            {
              attemptId:
                "attempt-2",

              activityId:
                "activity-test",

              activityVersion:
                "1.0.0",

              assessmentId:
                "assessment-test",

              assessmentVersion:
                "1.0.0",

              attemptNumber:
                2,
            },
          );

        expect(
          () =>
            createAssessmentAttemptHistory(
              second,
            ),
        ).toThrow(
          AssessmentAttemptHistoryError,
        );
      },
    );
  },
);