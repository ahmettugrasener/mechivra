import type {
  AssessmentAttempt,
} from "@/domain/assessment/attempt";

export interface AssessmentCompletionSnapshot {
  readonly submitted:
    boolean;

  readonly evaluated:
    boolean;

  readonly correct:
    boolean | null;
}

export function getAssessmentCompletionSnapshot<TResponse>(
  attempt:
    AssessmentAttempt<TResponse>,
): AssessmentCompletionSnapshot {
  return {
    submitted:
      attempt.status ===
        "submitted" ||
      attempt.status ===
        "evaluated",

    evaluated:
      attempt.status ===
      "evaluated",

    correct:
      attempt.status ===
        "evaluated"
        ? attempt.result
            ?.correct ??
          null
        : null,
  };
}