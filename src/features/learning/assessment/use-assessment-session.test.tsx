import {
  act,
  cleanup,
  renderHook,
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

import { useAssessmentSession } from "@/features/learning/assessment/use-assessment-session";

afterEach(() => {
  cleanup();
});

interface TestResponse {
  readonly value:
    number;
}

function evaluate(
  response:
    TestResponse,
) {
  const correct =
    response.value ===
    10;

  return createAssessmentResult(
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
  );
}

describe(
  "useAssessmentSession",
  () => {
    it(
      "starts with one draft attempt",
      () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                {
                  activityId:
                    "activity-test",

                  activityVersion:
                    "1.0.0",

                  assessmentId:
                    "assessment-test",

                  assessmentVersion:
                    "1.0.0",

                  evaluate,
                },
              ),
          );

        expect(
          result.current
            .history
            .attempts,
        ).toHaveLength(
          1,
        );

        expect(
          result.current
            .latestAttempt
            .status,
        ).toBe(
          "draft",
        );

        expect(
          result.current
            .canSubmit,
        ).toBe(
          true,
        );

        expect(
          result.current
            .canRevise,
        ).toBe(
          false,
        );
      },
    );

    it(
      "submits and evaluates one attempt atomically from the UI perspective",
      () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                {
                  activityId:
                    "activity-test",

                  activityVersion:
                    "1.0.0",

                  assessmentId:
                    "assessment-test",

                  assessmentVersion:
                    "1.0.0",

                  evaluate,
                },
              ),
          );

        act(
          () => {
            result.current.submit(
              {
                value:
                  5,
              },
            );
          },
        );

        expect(
          result.current
            .latestAttempt
            .status,
        ).toBe(
          "evaluated",
        );

        expect(
          result.current
            .latestAttempt
            .response,
        ).toEqual({
          value:
            5,
        });

        expect(
          result.current
            .latestAttempt
            .result
            ?.correct,
        ).toBe(
          false,
        );

        expect(
          result.current
            .summary
            .evaluatedAttemptCount,
        ).toBe(
          1,
        );
      },
    );

    it(
      "creates a new revision instead of overwriting the previous result",
      () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                {
                  activityId:
                    "activity-test",

                  activityVersion:
                    "1.0.0",

                  assessmentId:
                    "assessment-test",

                  assessmentVersion:
                    "1.0.0",

                  evaluate,
                },
              ),
          );

        act(
          () => {
            result.current.submit(
              {
                value:
                  5,
              },
            );
          },
        );

        act(
          () => {
            result.current.revise();
          },
        );

        expect(
          result.current
            .history
            .attempts,
        ).toHaveLength(
          2,
        );

        expect(
          result.current
            .history
            .attempts[0]
            ?.result
            ?.correct,
        ).toBe(
          false,
        );

        expect(
          result.current
            .history
            .attempts[1]
            ?.status,
        ).toBe(
          "draft",
        );

        expect(
          result.current
            .latestAttempt
            .attemptNumber,
        ).toBe(
          2,
        );
      },
    );

    it(
      "preserves first-attempt failure after eventual success",
      () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                {
                  activityId:
                    "activity-test",

                  activityVersion:
                    "1.0.0",

                  assessmentId:
                    "assessment-test",

                  assessmentVersion:
                    "1.0.0",

                  evaluate,
                },
              ),
          );

        act(
          () => {
            result.current.submit(
              {
                value:
                  5,
              },
            );
          },
        );

        act(
          () => {
            result.current.revise();
          },
        );

        act(
          () => {
            result.current.submit(
              {
                value:
                  10,
              },
            );
          },
        );

        expect(
          result.current
            .summary
            .attemptCount,
        ).toBe(
          2,
        );

        expect(
          result.current
            .summary
            .firstAttemptCorrect,
        ).toBe(
          false,
        );

        expect(
          result.current
            .summary
            .latestAttemptCorrect,
        ).toBe(
          true,
        );

        expect(
          result.current
            .summary
            .hasCorrectAttempt,
        ).toBe(
          true,
        );
      },
    );

    it(
      "does not create duplicate submissions for an already evaluated attempt",
      () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                {
                  activityId:
                    "activity-test",

                  activityVersion:
                    "1.0.0",

                  assessmentId:
                    "assessment-test",

                  assessmentVersion:
                    "1.0.0",

                  evaluate,
                },
              ),
          );

        act(
          () => {
            result.current.submit(
              {
                value:
                  5,
              },
            );
          },
        );

        act(
          () => {
            result.current.submit(
              {
                value:
                  10,
              },
            );
          },
        );

        expect(
          result.current
            .history
            .attempts,
        ).toHaveLength(
          1,
        );

        expect(
          result.current
            .latestAttempt
            .response,
        ).toEqual({
          value:
            5,
        });
      },
    );

    it(
      "uses deterministic attempt IDs by default",
      () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                {
                  activityId:
                    "activity-test",

                  activityVersion:
                    "1.0.0",

                  assessmentId:
                    "assessment-test",

                  assessmentVersion:
                    "1.0.0",

                  evaluate,
                },
              ),
          );

        expect(
          result.current
            .latestAttempt
            .identity
            .attemptId,
        ).toBe(
          "assessment-test-attempt-1",
        );

        act(
          () => {
            result.current.submit(
              {
                value:
                  5,
              },
            );

            result.current.revise();
          },
        );

        /*
         * Revision itself is tested separately in the next
         * test because React batches updates in one act().
         */
      },
    );

    it(
      "assigns the next deterministic ID after revision",
      () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                {
                  activityId:
                    "activity-test",

                  activityVersion:
                    "1.0.0",

                  assessmentId:
                    "assessment-test",

                  assessmentVersion:
                    "1.0.0",

                  evaluate,
                },
              ),
          );

        act(
          () => {
            result.current.submit(
              {
                value:
                  5,
              },
            );
          },
        );

        act(
          () => {
            result.current.revise();
          },
        );

        expect(
          result.current
            .latestAttempt
            .identity
            .attemptId,
        ).toBe(
          "assessment-test-attempt-2",
        );
      },
    );
  },
);