import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AssessmentAttemptError,
  createAssessmentAttempt,
  evaluateAssessmentAttempt,
  submitAssessmentAttempt,
} from "@/domain/assessment/attempt";

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

function createEvaluatedAttempt(
  correct:
    boolean,
) {
  const draft =
    createAssessmentAttempt<TestResponse>(
      {
        attemptId:
          "attempt-1",

        activityId:
          "activity-otto-05",

        activityVersion:
          "1.0.0",

        assessmentId:
          "otto-problem",

        assessmentVersion:
          "1.0.0",

        attemptNumber:
          1,
      },
    );

  const submitted =
    submitAssessmentAttempt(
      draft,
      {
        value:
          correct
            ? 10
            : 5,
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
  "Assessment revision",
  () => {
    it(
      "creates a new draft attempt after an evaluated attempt",
      () => {
        const previous =
          createEvaluatedAttempt(
            false,
          );

        const revision =
          createAssessmentRevision(
            previous,
            {
              attemptId:
                "attempt-2",
            },
          );

        expect(
          revision.status,
        ).toBe(
          "draft",
        );

        expect(
          revision.attemptNumber,
        ).toBe(
          2,
        );

        expect(
          revision.response,
        ).toBeNull();

        expect(
          revision.result,
        ).toBeNull();
      },
    );

    it(
      "preserves activity and assessment identity across revisions",
      () => {
        const previous =
          createEvaluatedAttempt(
            false,
          );

        const revision =
          createAssessmentRevision(
            previous,
            {
              attemptId:
                "attempt-2",
            },
          );

        expect(
          revision.identity,
        ).toEqual({
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
        });
      },
    );

    it(
      "does not mutate or overwrite the previous evaluated attempt",
      () => {
        const previous =
          createEvaluatedAttempt(
            false,
          );

        const previousSnapshot =
          structuredClone(
            previous,
          );

        createAssessmentRevision(
          previous,
          {
            attemptId:
              "attempt-2",
          },
        );

        expect(
          previous,
        ).toEqual(
          previousSnapshot,
        );

        expect(
          previous.status,
        ).toBe(
          "evaluated",
        );

        expect(
          previous.response,
        ).toEqual({
          value:
            5,
        });

        expect(
          previous.result
            ?.correct,
        ).toBe(
          false,
        );
      },
    );

    it(
      "can create a new practice attempt even after a correct evaluated attempt",
      () => {
        const previous =
          createEvaluatedAttempt(
            true,
          );

        const revision =
          createAssessmentRevision(
            previous,
            {
              attemptId:
                "attempt-2",
            },
          );

        expect(
          previous.result
            ?.correct,
        ).toBe(
          true,
        );

        expect(
          revision.status,
        ).toBe(
          "draft",
        );

        expect(
          revision.attemptNumber,
        ).toBe(
          2,
        );
      },
    );

    it(
      "rejects revision from a draft attempt",
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

        expect(
          () =>
            createAssessmentRevision(
              draft,
              {
                attemptId:
                  "attempt-2",
              },
            ),
        ).toThrow(
          AssessmentAttemptError,
        );
      },
    );

    it(
      "rejects revision from a submitted but unevaluated attempt",
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

        const submitted =
          submitAssessmentAttempt(
            draft,
            {
              value:
                10,
            },
          );

        expect(
          () =>
            createAssessmentRevision(
              submitted,
              {
                attemptId:
                  "attempt-2",
              },
            ),
        ).toThrow(
          AssessmentAttemptError,
        );
      },
    );

    it(
      "requires a new unique attempt ID",
      () => {
        const previous =
          createEvaluatedAttempt(
            false,
          );

        expect(
          () =>
            createAssessmentRevision(
              previous,
              {
                attemptId:
                  "attempt-1",
              },
            ),
        ).toThrow(
          AssessmentAttemptError,
        );

        expect(
          () =>
            createAssessmentRevision(
              previous,
              {
                attemptId:
                  "",
              },
            ),
        ).toThrow(
          AssessmentAttemptError,
        );
      },
    );
  },
);