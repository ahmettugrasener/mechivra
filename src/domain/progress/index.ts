export {
  ACTIVITY_PROGRESS_VERSION,
  MODULE_PROGRESS_VERSION,
} from "@/domain/progress/types";

export type {
  ActivityProgress,
  ActivityProgressStatus,
  ModuleProgress,
  ModuleProgressStatus,
  ModuleProgressSummary,
} from "@/domain/progress/types";

export {
  createActivityProgress,
  evaluateActivityProgressStatus,
  recordActivityProgressEvent,
} from "@/domain/progress/activity-progress";

export type {
  CreateActivityProgressInput,
} from "@/domain/progress/activity-progress";

export {
  createModuleProgress,
  getActivityProgress,
  summarizeModuleProgress,
  upsertActivityProgress,
} from "@/domain/progress/module-progress";

export type {
  CreateModuleProgressInput,
} from "@/domain/progress/module-progress";

export {
  createActivityProgressIdentity,
  createAssessmentHistoryIdentity,
  createModuleProgressIdentity,
  isSameActivityProgressIdentity,
  isSameAssessmentHistoryIdentity,
  isSameModuleProgressIdentity,
} from "@/domain/progress/identity";

export type {
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgressIdentity,
} from "@/domain/progress/identity";

export type {
  ProgressRepository,
} from "@/domain/progress/repository";