import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

import type {
  LearningCompletionEvidence,
} from "@/domain/learning/completion";

export const ACTIVITY_PROGRESS_VERSION =
  "1.0.0" as const;

export const MODULE_PROGRESS_VERSION =
  "1.0.0" as const;

export type ActivityProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export type ModuleProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export interface ActivityProgress {
  readonly version:
    typeof ACTIVITY_PROGRESS_VERSION;

  readonly moduleId:
    EntityId;

  readonly moduleVersion:
    VersionString;

  readonly activityId:
    EntityId;

  readonly activityVersion:
    VersionString;

  readonly status:
    ActivityProgressStatus;

  readonly evidence:
    LearningCompletionEvidence;

  readonly startedAt:
    string | null;

  readonly updatedAt:
    string | null;

  readonly completedAt:
    string | null;
}

export interface ModuleProgress {
  readonly version:
    typeof MODULE_PROGRESS_VERSION;

  readonly moduleId:
    EntityId;

  readonly moduleVersion:
    VersionString;

  readonly activityProgress:
    readonly ActivityProgress[];

  readonly updatedAt:
    string | null;
}

export interface ModuleProgressSummary {
  readonly status:
    ModuleProgressStatus;

  readonly totalActivityCount:
    number;

  readonly startedActivityCount:
    number;

  readonly completedActivityCount:
    number;

  readonly completionRatio:
    number;
}