import {
  AssessmentAttemptError,
  createAssessmentAttempt,
} from "@/domain/assessment/attempt";

import type {
  AssessmentAttempt,
} from "@/domain/assessment/attempt";

export interface CreateAssessmentRevisionInput {
  readonly attemptId:
    string;
}

export function createAssessmentRevision<TResponse>(
  previousAttempt:
    AssessmentAttempt<TResponse>,

  input:
    CreateAssessmentRevisionInput,
): AssessmentAttempt<TResponse> {
  if (
    previousAttempt.status !==
    "evaluated"
  ) {
    throw new AssessmentAttemptError(
      "A revision can only be created from an evaluated assessment attempt.",
    );
  }

  if (
    input.attemptId.trim().length ===
    0
  ) {
    throw new AssessmentAttemptError(
      "Revision attempt ID must not be empty.",
    );
  }

  if (
    input.attemptId ===
    previousAttempt.identity
      .attemptId
  ) {
    throw new AssessmentAttemptError(
      "Revision attempt ID must differ from the previous attempt ID.",
    );
  }

  return createAssessmentAttempt<TResponse>(
    {
      attemptId:
        input.attemptId,

      activityId:
        previousAttempt
          .identity
          .activityId,

      activityVersion:
        previousAttempt
          .identity
          .activityVersion,

      assessmentId:
        previousAttempt
          .identity
          .assessmentId,

      assessmentVersion:
        previousAttempt
          .identity
          .assessmentVersion,

      attemptNumber:
        previousAttempt
          .attemptNumber +
        1,
    },
  );
}