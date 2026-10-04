import type {
  AssessmentAttempt,
} from "@/domain/assessment/attempt";

export const ASSESSMENT_ATTEMPT_HISTORY_VERSION =
  "1.0.0" as const;

export interface AssessmentAttemptHistory<TResponse> {
  readonly version:
    typeof ASSESSMENT_ATTEMPT_HISTORY_VERSION;

  readonly activityId:
    string;

  readonly activityVersion:
    string;

  readonly assessmentId:
    string;

  readonly assessmentVersion:
    string;

  readonly attempts:
    readonly AssessmentAttempt<TResponse>[];
}

export class AssessmentAttemptHistoryError extends Error {
  constructor(
    message:
      string,
  ) {
    super(
      message,
    );

    this.name =
      "AssessmentAttemptHistoryError";
  }
}

function assertSameAssessmentIdentity<TResponse>(
  history:
    AssessmentAttemptHistory<TResponse>,

  attempt:
    AssessmentAttempt<TResponse>,
): void {
  if (
    attempt.identity
      .activityId !==
      history.activityId ||
    attempt.identity
      .activityVersion !==
      history.activityVersion ||
    attempt.identity
      .assessmentId !==
      history.assessmentId ||
    attempt.identity
      .assessmentVersion !==
      history.assessmentVersion
  ) {
    throw new AssessmentAttemptHistoryError(
      "All attempts in one history must belong to the same activity and assessment versions.",
    );
  }
}

export function createAssessmentAttemptHistory<TResponse>(
  initialAttempt:
    AssessmentAttempt<TResponse>,
): AssessmentAttemptHistory<TResponse> {
  if (
    initialAttempt.attemptNumber !==
    1
  ) {
    throw new AssessmentAttemptHistoryError(
      "Initial assessment attempt must have attempt number 1.",
    );
  }

  return {
    version:
      ASSESSMENT_ATTEMPT_HISTORY_VERSION,

    activityId:
      initialAttempt
        .identity
        .activityId,

    activityVersion:
      initialAttempt
        .identity
        .activityVersion,

    assessmentId:
      initialAttempt
        .identity
        .assessmentId,

    assessmentVersion:
      initialAttempt
        .identity
        .assessmentVersion,

    attempts: [
      initialAttempt,
    ],
  };
}

export function appendAssessmentAttempt<TResponse>(
  history:
    AssessmentAttemptHistory<TResponse>,

  attempt:
    AssessmentAttempt<TResponse>,
): AssessmentAttemptHistory<TResponse> {
  assertSameAssessmentIdentity(
    history,
    attempt,
  );

  const previousAttempt =
    history.attempts[
      history.attempts.length -
        1
    ];

  if (
    !previousAttempt
  ) {
    throw new AssessmentAttemptHistoryError(
      "Assessment attempt history must contain a previous attempt.",
    );
  }

  const expectedAttemptNumber =
    previousAttempt.attemptNumber +
    1;

  if (
    attempt.attemptNumber !==
    expectedAttemptNumber
  ) {
    throw new AssessmentAttemptHistoryError(
      `Expected attempt number ${expectedAttemptNumber}, received ${attempt.attemptNumber}.`,
    );
  }

  if (
    history.attempts.some(
      (
        existing,
      ) =>
        existing.identity
          .attemptId ===
        attempt.identity
          .attemptId,
    )
  ) {
    throw new AssessmentAttemptHistoryError(
      "Assessment attempt IDs must be unique within a history.",
    );
  }

  return {
    ...history,

    attempts: [
      ...history.attempts,
      attempt,
    ],
  };
}

export function replaceLatestAssessmentAttempt<TResponse>(
  history:
    AssessmentAttemptHistory<TResponse>,

  attempt:
    AssessmentAttempt<TResponse>,
): AssessmentAttemptHistory<TResponse> {
  assertSameAssessmentIdentity(
    history,
    attempt,
  );

  const latest =
    history.attempts[
      history.attempts.length -
        1
    ];

  if (
    !latest
  ) {
    throw new AssessmentAttemptHistoryError(
      "Assessment attempt history must contain an attempt.",
    );
  }

  if (
    latest.identity
      .attemptId !==
      attempt.identity
        .attemptId ||
    latest.attemptNumber !==
      attempt.attemptNumber
  ) {
    throw new AssessmentAttemptHistoryError(
      "Only the latest attempt with the same attempt identity can advance through its lifecycle.",
    );
  }

  return {
    ...history,

    attempts: [
      ...history.attempts.slice(
        0,
        -1,
      ),
      attempt,
    ],
  };
}

export function getLatestAssessmentAttempt<TResponse>(
  history:
    AssessmentAttemptHistory<TResponse>,
): AssessmentAttempt<TResponse> {
  const latest =
    history.attempts[
      history.attempts.length -
        1
    ];

  if (
    !latest
  ) {
    throw new AssessmentAttemptHistoryError(
      "Assessment attempt history contains no attempts.",
    );
  }

  return latest;
}