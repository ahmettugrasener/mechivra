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

interface TestResponse {
  readonly value:
    number;
}

function createDraft() {
  return createAssessmentAttempt<TestResponse>(
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
}

describe(
  "Assessment attempt lifecycle",
  () => {
    it(
      "starts as a draft without response or result",
      () => {
        const attempt =
          createDraft();

        expect(
          attempt.status,
        ).toBe(
          "draft",
        );

        expect(
          attempt.response,
        ).toBeNull();

        expect(
          attempt.result,
        ).toBeNull();
      },
    );

    it(
      "submits a response without silently evaluating it",
      () => {
        const submitted =
          submitAssessmentAttempt(
            createDraft(),
            {
              value:
                42,
            },
          );

        expect(
          submitted.status,
        ).toBe(
          "submitted",
        );

        expect(
          submitted.response,
        ).toEqual({
          value:
            42,
        });

        expect(
          submitted.result,
        ).toBeNull();
      },
    );

    it(
      "evaluates only after submission",
      () => {
        const submitted =
          submitAssessmentAttempt(
            createDraft(),
            {
              value:
                42,
            },
          );

        const result =
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
          );

        const evaluated =
          evaluateAssessmentAttempt(
            submitted,
            result,
          );

        expect(
          evaluated.status,
        ).toBe(
          "evaluated",
        );

        expect(
          evaluated.result
            ?.correct,
        ).toBe(
          true,
        );
      },
    );

    it(
      "does not equate submission with correctness",
      () => {
        const submitted =
          submitAssessmentAttempt(
            createDraft(),
            {
              value:
                -10,
            },
          );

        expect(
          submitted.status,
        ).toBe(
          "submitted",
        );

        expect(
          submitted.result,
        ).toBeNull();
      },
    );

    it(
      "rejects resubmission of the same immutable attempt",
      () => {
        const submitted =
          submitAssessmentAttempt(
            createDraft(),
            {
              value:
                42,
            },
          );

        expect(
          () =>
            submitAssessmentAttempt(
              submitted,
              {
                value:
                  43,
              },
            ),
        ).toThrow(
          AssessmentAttemptError,
        );
      },
    );

    it(
      "rejects evaluation before submission",
      () => {
        const result =
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
          );

        expect(
          () =>
            evaluateAssessmentAttempt(
              createDraft(),
              result,
            ),
        ).toThrow(
          AssessmentAttemptError,
        );
      },
    );

    it(
      "rejects invalid attempt identity",
      () => {
        expect(
          () =>
            createAssessmentAttempt(
              {
                attemptId:
                  "",

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
            ),
        ).toThrow(
          AssessmentAttemptError,
        );
      },
    );

    it(
      "rejects invalid attempt numbers",
      () => {
        expect(
          () =>
            createAssessmentAttempt(
              {
                attemptId:
                  "attempt-0",

                activityId:
                  "activity-test",

                activityVersion:
                  "1.0.0",

                assessmentId:
                  "assessment-test",

                assessmentVersion:
                  "1.0.0",

                attemptNumber:
                  0,
              },
            ),
        ).toThrow(
          AssessmentAttemptError,
        );
      },
    );
  },
);