import {
  MODULE_PROGRESS_VERSION,
  createModuleProgressIdentity,
  summarizeModuleProgress,
} from "@/domain/progress";

import type {
  ActivityProgress,
  ModuleProgress,
  ModuleProgressSummary,
  ProgressRepository,
} from "@/domain/progress";

import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

export interface ExpectedModuleActivity {
  readonly id:
    EntityId;

  readonly version:
    VersionString;
}

export interface ModuleProgressAggregationInput {
  readonly moduleId:
    EntityId;

  readonly moduleVersion:
    VersionString;

  /*
   * Order is significant.
   *
   * The returned ModuleProgress.activityProgress array follows
   * current curriculum order rather than IndexedDB row order.
   */
  readonly activities:
    readonly ExpectedModuleActivity[];
}

export interface ModuleProgressAggregation {
  readonly progress:
    ModuleProgress;

  readonly summary:
    ModuleProgressSummary;
}

export class ModuleProgressAggregationError
  extends Error {
  constructor(
    message:
      string,
  ) {
    super(
      message,
    );

    this.name =
      "ModuleProgressAggregationError";
  }
}

function assertNonEmpty(
  value:
    string,

  label:
    string,
): void {
  if (
    value.trim().length ===
    0
  ) {
    throw new ModuleProgressAggregationError(
      `${label} must not be empty.`,
    );
  }
}

function validateExpectedActivities(
  activities:
    readonly ExpectedModuleActivity[],
): void {
  const seen =
    new Set<
      string
    >();

  for (
    const activity
    of activities
  ) {
    assertNonEmpty(
      activity.id,
      "Activity ID",
    );

    assertNonEmpty(
      activity.version,
      `Activity "${activity.id}" version`,
    );

    if (
      seen.has(
        activity.id,
      )
    ) {
      throw new ModuleProgressAggregationError(
        `Expected activity IDs must be unique. Duplicate "${activity.id}".`,
      );
    }

    seen.add(
      activity.id,
    );
  }
}

function latestUpdatedAt(
  activities:
    readonly ActivityProgress[],
): string | null {
  let latest:
    string | null =
    null;

  for (
    const activity
    of activities
  ) {
    if (
      activity.updatedAt ===
      null
    ) {
      continue;
    }

    if (
      latest ===
        null ||
      Date.parse(
        activity.updatedAt,
      ) >
        Date.parse(
          latest,
        )
    ) {
      latest =
        activity.updatedAt;
    }
  }

  return latest;
}

export async function aggregateModuleProgress(
  repository:
    ProgressRepository,

  input:
    ModuleProgressAggregationInput,
): Promise<
  ModuleProgressAggregation
> {
  assertNonEmpty(
    input.moduleId,
    "Module ID",
  );

  assertNonEmpty(
    input.moduleVersion,
    "Module version",
  );

  validateExpectedActivities(
    input.activities,
  );

  const identity =
    createModuleProgressIdentity(
      input.moduleId,
      input.moduleVersion,
    );

  const stored =
    await repository
      .listActivityProgress(
        identity,
      );

  const expectedById =
    new Map(
      input.activities.map(
        (
          activity,
        ) => [
          activity.id,
          activity,
        ],
      ),
    );

  const storedById =
    new Map<
      string,
      ActivityProgress
    >();

  for (
    const progress
    of stored
  ) {
    if (
      progress.moduleId !==
        input.moduleId ||
      progress.moduleVersion !==
        input.moduleVersion
    ) {
      throw new ModuleProgressAggregationError(
        `Repository returned activity progress outside module "${input.moduleId}" version "${input.moduleVersion}".`,
      );
    }

    const expected =
      expectedById.get(
        progress.activityId,
      );

    if (
      !expected
    ) {
      throw new ModuleProgressAggregationError(
        `Persisted activity "${progress.activityId}" does not belong to the current module definition.`,
      );
    }

    if (
      progress.activityVersion !==
      expected.version
    ) {
      throw new ModuleProgressAggregationError(
        `Persisted activity "${progress.activityId}" uses version "${progress.activityVersion}", but the current curriculum expects "${expected.version}". An explicit progress migration is required.`,
      );
    }

    if (
      storedById.has(
        progress.activityId,
      )
    ) {
      throw new ModuleProgressAggregationError(
        `Repository returned duplicate progress for activity "${progress.activityId}".`,
      );
    }

    storedById.set(
      progress.activityId,
      progress,
    );
  }

  /*
   * Stable curriculum order.
   *
   * Activities with no persisted row remain absent from
   * ModuleProgress.activityProgress and are interpreted as
   * not_started by summarizeModuleProgress().
   */
  const orderedProgress =
    input.activities.flatMap(
      (
        activity,
      ) => {
        const progress =
          storedById.get(
            activity.id,
          );

        return progress
          ? [
              progress,
            ]
          : [];
      },
    );

  const progress:
    ModuleProgress = {
      version:
        MODULE_PROGRESS_VERSION,

      moduleId:
        input.moduleId,

      moduleVersion:
        input.moduleVersion,

      activityProgress:
        orderedProgress,

      updatedAt:
        latestUpdatedAt(
          orderedProgress,
        ),
    };

  const summary =
    summarizeModuleProgress(
      progress,

      input.activities.map(
        (
          activity,
        ) =>
          activity.id,
      ),
    );

  return {
    progress,
    summary,
  };
}