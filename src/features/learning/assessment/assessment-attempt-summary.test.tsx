import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import { AssessmentAttemptSummary } from "@/features/learning/assessment/assessment-attempt-summary";

afterEach(() => {
  cleanup();
});

describe(
  "AssessmentAttemptSummary",
  () => {
    it(
      "shows first and latest performance separately",
      () => {
        render(
          <AssessmentAttemptSummary
            locale="tr"
            summary={{
              attemptCount:
                3,

              evaluatedAttemptCount:
                3,

              firstAttemptCorrect:
                false,

              latestAttemptCorrect:
                true,

              hasCorrectAttempt:
                true,

              highestNormalizedScore:
                1,
            }}
          />,
        );

        expect(
          screen.getByTestId(
            "assessment-attempt-summary",
          ),
        ).toHaveAttribute(
          "data-attempt-count",
          "3",
        );

        expect(
          screen.getByText(
            "yanlış",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "doğru",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "does not describe eventual correctness as mastery",
      () => {
        render(
          <AssessmentAttemptSummary
            locale="en"
            summary={{
              attemptCount:
                2,

              evaluatedAttemptCount:
                2,

              firstAttemptCorrect:
                false,

              latestAttemptCorrect:
                true,

              hasCorrectAttempt:
                true,

              highestNormalizedScore:
                1,
            }}
          />,
        );

        expect(
          screen.getByText(
            /does not by itself establish mastery/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);