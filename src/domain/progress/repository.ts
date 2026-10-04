import type {
  AssessmentAttemptHistory,
} from "@/domain/assessment";

import type {
  ActivityProgress,
  ModuleProgress,
} from "@/domain/progress/types";

import type {
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgressIdentity,
} from "@/domain/progress/identity";

export interface ProgressRepository {
  /*
   * Activity progress is the canonical writable
   * learning-progress state.
   */
  getActivityProgress(
    identity:
      ActivityProgressIdentity,
  ): Promise<
    ActivityProgress | null
  >;

  listActivityProgress(
    identity:
      ModuleProgressIdentity,
  ): Promise<
    readonly ActivityProgress[]
  >;

  saveActivityProgress(
    progress:
      ActivityProgress,
  ): Promise<void>;

  deleteActivityProgress(
    identity:
      ActivityProgressIdentity,
  ): Promise<void>;

  /*
   * ModuleProgress is a derived aggregate.
   * There is intentionally no saveModuleProgress().
   */
  getModuleProgress(
    identity:
      ModuleProgressIdentity,
  ): Promise<
    ModuleProgress | null
  >;

  deleteModuleActivityProgress(
    identity:
      ModuleProgressIdentity,
  ): Promise<void>;

  /*
   * Assessment history is persisted independently
   * from learning completion.
   *
   * Correctness therefore does not leak into
   * ActivityProgress.
   */
  getAssessmentAttemptHistory<
    TResponse,
  >(
    identity:
      AssessmentHistoryIdentity,
  ): Promise<
    AssessmentAttemptHistory<TResponse> | null
  >;

  saveAssessmentAttemptHistory<
    TResponse,
  >(
    history:
      AssessmentAttemptHistory<TResponse>,
  ): Promise<void>;

  deleteAssessmentAttemptHistory(
    identity:
      AssessmentHistoryIdentity,
  ): Promise<void>;

  /*
   * Intended for Settings / explicit reset only.
   *
   * This clears both learning progress and
   * persisted assessment histories.
   */
  clearAllProgress():
    Promise<void>;
}