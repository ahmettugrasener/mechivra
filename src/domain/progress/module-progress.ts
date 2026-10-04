import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

import {
  MODULE_PROGRESS_VERSION,
} from "@/domain/progress/types";

import type {
  ActivityProgress,
  ModuleProgress,
  ModuleProgressStatus,
  ModuleProgressSummary,
} from "@/domain/progress/types";

export interface CreateModuleProgressInput {
  readonly moduleId:
    EntityId;

  readonly moduleVersion:
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

export function createModuleProgress(
  input:
    CreateModuleProgressInput,
): ModuleProgress {
  assertNonEmpty(
    input.moduleId,
    "Module ID",
  );

  assertNonEmpty(
    input.moduleVersion,
    "Module version",
  );

  return {
    version:
      MODULE_PROGRESS_VERSION,

    moduleId:
      input.moduleId,

    moduleVersion:
      input.moduleVersion,

    activityProgress:
      [],

    updatedAt:
      null,
  };
}

export function getActivityProgress(
  progress:
    ModuleProgress,

  activityId:
    EntityId,
): ActivityProgress | null {
  return (
    progress.activityProgress.find(
      (
        activityProgress,
      ) =>
        activityProgress.activityId ===
        activityId,
    ) ??
    null
  );
}

export function upsertActivityProgress(
  progress:
    ModuleProgress,

  activityProgress:
    ActivityProgress,
): ModuleProgress {
  if (
    activityProgress.moduleId !==
      progress.moduleId ||
    activityProgress.moduleVersion !==
      progress.moduleVersion
  ) {
    throw new Error(
      "Activity progress must belong to the same module identity and version.",
    );
  }

  const existingIndex =
    progress.activityProgress.findIndex(
      (
        current,
      ) =>
        current.activityId ===
        activityProgress.activityId,
    );

  if (
    existingIndex >=
    0
  ) {
    const existing =
      progress.activityProgress[
        existingIndex
      ];

    if (
      !existing
    ) {
      throw new Error(
        "Existing activity progress could not be resolved.",
      );
    }

    if (
      existing.activityVersion !==
      activityProgress.activityVersion
    ) {
      throw new Error(
        "Activity progress version cannot change without an explicit migration.",
      );
    }

    const next =
      [
        ...progress.activityProgress,
      ];

    next[
      existingIndex
    ] =
      activityProgress;

    return {
      ...progress,

      activityProgress:
        next,

      updatedAt:
        activityProgress.updatedAt ??
        progress.updatedAt,
    };
  }

  return {
    ...progress,

    activityProgress: [
      ...progress.activityProgress,
      activityProgress,
    ],

    updatedAt:
      activityProgress.updatedAt ??
      progress.updatedAt,
  };
}

function resolveModuleStatus(
  totalActivityCount:
    number,

  startedActivityCount:
    number,

  completedActivityCount:
    number,
): ModuleProgressStatus {
  if (
    totalActivityCount ===
      0 ||
    startedActivityCount ===
      0
  ) {
    return "not_started";
  }

  if (
    completedActivityCount ===
    totalActivityCount
  ) {
    return "completed";
  }

  return "in_progress";
}

export function summarizeModuleProgress(
  progress:
    ModuleProgress,

  expectedActivityIds:
    readonly EntityId[],
): ModuleProgressSummary {
  const uniqueExpectedIds =
    new Set(
      expectedActivityIds,
    );

  if (
    uniqueExpectedIds.size !==
    expectedActivityIds.length
  ) {
    throw new Error(
      "Expected module activity IDs must be unique.",
    );
  }

  const storedIds =
    progress.activityProgress.map(
      (
        activityProgress,
      ) =>
        activityProgress.activityId,
    );

  if (
    new Set(
      storedIds,
    ).size !==
    storedIds.length
  ) {
    throw new Error(
      "Stored activity progress IDs must be unique.",
    );
  }

  for (
    const activityProgress
    of progress.activityProgress
  ) {
    if (
      !uniqueExpectedIds.has(
        activityProgress.activityId,
      )
    ) {
      throw new Error(
        `Unexpected activity progress "${activityProgress.activityId}" for module "${progress.moduleId}".`,
      );
    }
  }

  const progressByActivityId =
    new Map(
      progress.activityProgress.map(
        (
          activityProgress,
        ) => [
          activityProgress.activityId,
          activityProgress,
        ] as const,
      ),
    );

  let startedActivityCount =
    0;

  let completedActivityCount =
    0;

  for (
    const activityId
    of expectedActivityIds
  ) {
    const activityProgress =
      progressByActivityId.get(
        activityId,
      );

    if (
      !activityProgress ||
      activityProgress.status ===
        "not_started"
    ) {
      continue;
    }

    startedActivityCount +=
      1;

    if (
      activityProgress.status ===
      "completed"
    ) {
      completedActivityCount +=
        1;
    }
  }

  const totalActivityCount =
    expectedActivityIds.length;

  return {
    status:
      resolveModuleStatus(
        totalActivityCount,
        startedActivityCount,
        completedActivityCount,
      ),

    totalActivityCount,

    startedActivityCount,

    completedActivityCount,

    completionRatio:
      totalActivityCount ===
      0
        ? 0
        : completedActivityCount /
          totalActivityCount,
  };
}