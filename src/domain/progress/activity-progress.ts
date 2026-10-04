import {
  createEmptyLearningCompletionEvidence,
  evaluateLearningCompletion,
  recordLearningCompletionEvent,
} from "@/domain/learning/completion";

import type {
  LearningCompletionEvent,
  LearningCompletionEvidence,
} from "@/domain/learning/completion";

import type {
  CompletionRule,
} from "@/domain/learning/types";

import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

import {
  ACTIVITY_PROGRESS_VERSION,
} from "@/domain/progress/types";

import type {
  ActivityProgress,
  ActivityProgressStatus,
} from "@/domain/progress/types";

export interface CreateActivityProgressInput {
  readonly moduleId:
    EntityId;

  readonly moduleVersion:
    VersionString;

  readonly activityId:
    EntityId;

  readonly activityVersion:
    VersionString;
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
    throw new Error(
      `${name} must not be empty.`,
    );
  }
}

function assertTimestamp(
  timestamp:
    string,

  name:
    string,
): void {
  assertNonEmpty(
    timestamp,
    name,
  );

  if (
    Number.isNaN(
      Date.parse(
        timestamp,
      ),
    )
  ) {
    throw new Error(
      `${name} must be a valid date-time string.`,
    );
  }
}

function hasProgressEvidence(
  evidence:
    LearningCompletionEvidence,
): boolean {
  return (
    evidence.opened ||
    evidence.reachedEnd ||
    evidence.predictionSubmissions >
      0 ||
    evidence.meaningfulInteractions >
      0 ||
    evidence.attemptsSubmitted >
      0 ||
    evidence.explicitCompletions >
      0
  );
}

export function evaluateActivityProgressStatus(
  rule:
    CompletionRule,

  evidence:
    LearningCompletionEvidence,
): ActivityProgressStatus {
  const completion =
    evaluateLearningCompletion(
      rule,
      evidence,
    );

  if (
    completion.completed
  ) {
    return "completed";
  }

  if (
    hasProgressEvidence(
      evidence,
    )
  ) {
    return "in_progress";
  }

  return "not_started";
}

export function createActivityProgress(
  input:
    CreateActivityProgressInput,
): ActivityProgress {
  assertNonEmpty(
    input.moduleId,
    "Module ID",
  );

  assertNonEmpty(
    input.moduleVersion,
    "Module version",
  );

  assertNonEmpty(
    input.activityId,
    "Activity ID",
  );

  assertNonEmpty(
    input.activityVersion,
    "Activity version",
  );

  return {
    version:
      ACTIVITY_PROGRESS_VERSION,

    moduleId:
      input.moduleId,

    moduleVersion:
      input.moduleVersion,

    activityId:
      input.activityId,

    activityVersion:
      input.activityVersion,

    status:
      "not_started",

    evidence:
      createEmptyLearningCompletionEvidence(),

    startedAt:
      null,

    updatedAt:
      null,

    completedAt:
      null,
  };
}

export function recordActivityProgressEvent(
  current:
    ActivityProgress,

  rule:
    CompletionRule,

  event:
    LearningCompletionEvent,

  occurredAt:
    string,
): ActivityProgress {
  assertTimestamp(
    occurredAt,
    "Progress event timestamp",
  );

  const evidence =
    recordLearningCompletionEvent(
      current.evidence,
      event,
    );

  const status =
    evaluateActivityProgressStatus(
      rule,
      evidence,
    );

  const startedAt =
    current.startedAt ??
    occurredAt;

  const completedAt =
    current.completedAt ??
    (
      status ===
      "completed"
        ? occurredAt
        : null
    );

  return {
    ...current,

    status,

    evidence,

    startedAt,

    updatedAt:
      occurredAt,

    completedAt,
  };
}