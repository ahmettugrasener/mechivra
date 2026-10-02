import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

export type ActivityProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export interface ActivityProgress {
  readonly activityId: EntityId;
  readonly activityVersion: VersionString;

  readonly status: ActivityProgressStatus;

  readonly startedAt?: string;
  readonly completedAt?: string;
}

export interface ModuleProgress {
  readonly moduleId: EntityId;
  readonly moduleVersion: VersionString;

  readonly activityProgress: readonly ActivityProgress[];
}

export interface ProgressRepository {
  getModuleProgress(
    moduleId: EntityId,
  ): Promise<ModuleProgress | null>;

  saveModuleProgress(
    progress: ModuleProgress,
  ): Promise<void>;

  resetModuleProgress(
    moduleId: EntityId,
  ): Promise<void>;
}