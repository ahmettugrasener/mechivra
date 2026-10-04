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
  getAssessmentCompletionSnapshot,
} from "@/domain/assessment/completion";

import {
  createAssessmentResult,
} from "@/domain/assessment/result";

function createAttempt() {
  return createAssessmentAttempt<{
    readonly value:
      number;
  }>(
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
  "Assessment completion snapshot",
  () => {
    it(
      "distinguishes draft from submitted",
      () => {
        expect(
          getAssessmentCompletionSnapshot(
            createAttempt(),
          ),
        ).toEqual({
          submitted:
            false,

          evaluated:
            false,

          correct:
            null,
        });
      },
    );

    it(
      "distinguishes submitted from evaluated",
      () => {
        const submitted =
          submitAssessmentAttempt(
            createAttempt(),
            {
              value:
                10,
            },
          );

        expect(
          getAssessmentCompletionSnapshot(
            submitted,
          ),
        ).toEqual({
          submitted:
            true,

          evaluated:
            false,

          correct:
            null,
        });
      },
    );

    it(
      "reports correctness only after evaluation",
      () => {
        const submitted =
          submitAssessmentAttempt(
            createAttempt(),
            {
              value:
                10,
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

        expect(
          getAssessmentCompletionSnapshot(
            evaluated,
          ),
        ).toEqual({
          submitted:
            true,

          evaluated:
            true,

          correct:
            false,
        });
      },
    );
  },
);