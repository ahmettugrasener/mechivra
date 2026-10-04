import type {
  AssessmentAttemptHistory,
} from "@/domain/assessment/attempt-history";

export interface AssessmentAttemptHistorySummary {
  readonly attemptCount:
    number;

  readonly evaluatedAttemptCount:
    number;

  readonly firstAttemptCorrect:
    boolean | null;

  readonly latestAttemptCorrect:
    boolean | null;

  readonly hasCorrectAttempt:
    boolean;

  readonly highestNormalizedScore:
    number | null;
}

export function summarizeAssessmentAttemptHistory<TResponse>(
  history:
    AssessmentAttemptHistory<TResponse>,
): AssessmentAttemptHistorySummary {
  const evaluatedAttempts =
    history.attempts.filter(
      (
        attempt,
      ) =>
        attempt.status ===
          "evaluated" &&
        attempt.result !==
          null,
    );

  const first =
    evaluatedAttempts[0];

  const latest =
    evaluatedAttempts[
      evaluatedAttempts.length -
        1
    ];

  const scores =
    evaluatedAttempts.flatMap(
      (
        attempt,
      ) =>
        attempt.result
          ?.normalizedScore ===
        null ||
        attempt.result
          ?.normalizedScore ===
          undefined
          ? []
          : [
              attempt.result
                .normalizedScore,
            ],
    );

  return {
    attemptCount:
      history.attempts.length,

    evaluatedAttemptCount:
      evaluatedAttempts.length,

    firstAttemptCorrect:
      first?.result
        ?.correct ??
      null,

    latestAttemptCorrect:
      latest?.result
        ?.correct ??
      null,

    hasCorrectAttempt:
      evaluatedAttempts.some(
        (
          attempt,
        ) =>
          attempt.result
            ?.correct ===
          true,
      ),

    highestNormalizedScore:
      scores.length >
      0
        ? Math.max(
            ...scores,
          )
        : null,
  };
}