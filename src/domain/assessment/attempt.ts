import type {
  AssessmentResult,
} from "@/domain/assessment/result";

export const ASSESSMENT_ATTEMPT_VERSION =
  "1.0.0" as const;

export type AssessmentAttemptStatus =
  | "draft"
  | "submitted"
  | "evaluated";

export interface AssessmentAttemptIdentity {
  readonly attemptId:
    string;

  readonly activityId:
    string;

  readonly activityVersion:
    string;

  readonly assessmentId:
    string;

  readonly assessmentVersion:
    string;
}

export interface AssessmentAttempt<TResponse> {
  readonly version:
    typeof ASSESSMENT_ATTEMPT_VERSION;

  readonly identity:
    AssessmentAttemptIdentity;

  readonly attemptNumber:
    number;

  readonly status:
    AssessmentAttemptStatus;

  readonly response:
    TResponse | null;

  readonly result:
    AssessmentResult | null;
}

export interface CreateAssessmentAttemptInput {
  readonly attemptId:
    string;

  readonly activityId:
    string;

  readonly activityVersion:
    string;

  readonly assessmentId:
    string;

  readonly assessmentVersion:
    string;

  readonly attemptNumber:
    number;
}

export class AssessmentAttemptError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "AssessmentAttemptError";
  }
}

function assertNonEmpty(
  value:
    string,

  name:
    string,
): void {
  if (
    value.trim().length ===
    0
  ) {
    throw new AssessmentAttemptError(
      `${name} must not be empty.`,
    );
  }
}

export function createAssessmentAttempt<TResponse>(
  input:
    CreateAssessmentAttemptInput,
): AssessmentAttempt<TResponse> {
  assertNonEmpty(
    input.attemptId,
    "Attempt ID",
  );

  assertNonEmpty(
    input.activityId,
    "Activity ID",
  );

  assertNonEmpty(
    input.activityVersion,
    "Activity version",
  );

  assertNonEmpty(
    input.assessmentId,
    "Assessment ID",
  );

  assertNonEmpty(
    input.assessmentVersion,
    "Assessment version",
  );

  if (
    !Number.isInteger(
      input.attemptNumber,
    ) ||
    input.attemptNumber <
      1
  ) {
    throw new AssessmentAttemptError(
      "Attempt number must be a positive integer.",
    );
  }

  return {
    version:
      ASSESSMENT_ATTEMPT_VERSION,

    identity: {
      attemptId:
        input.attemptId,

      activityId:
        input.activityId,

      activityVersion:
        input.activityVersion,

      assessmentId:
        input.assessmentId,

      assessmentVersion:
        input.assessmentVersion,
    },

    attemptNumber:
      input.attemptNumber,

    status:
      "draft",

    response:
      null,

    result:
      null,
  };
}

export function submitAssessmentAttempt<TResponse>(
  attempt:
    AssessmentAttempt<TResponse>,

  response:
    TResponse,
): AssessmentAttempt<TResponse> {
  if (
    attempt.status !==
    "draft"
  ) {
    throw new AssessmentAttemptError(
      "Only a draft assessment attempt can be submitted.",
    );
  }

  return {
    ...attempt,

    status:
      "submitted",

    response,

    result:
      null,
  };
}

export function evaluateAssessmentAttempt<TResponse>(
  attempt:
    AssessmentAttempt<TResponse>,

  result:
    AssessmentResult,
): AssessmentAttempt<TResponse> {
  if (
    attempt.status !==
    "submitted"
  ) {
    throw new AssessmentAttemptError(
      "Only a submitted assessment attempt can be evaluated.",
    );
  }

  if (
    attempt.response ===
    null
  ) {
    throw new AssessmentAttemptError(
      "Submitted assessment attempt must contain a response.",
    );
  }

  return {
    ...attempt,

    status:
      "evaluated",

    result,
  };
}