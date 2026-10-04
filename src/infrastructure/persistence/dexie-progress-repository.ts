import type {
  AssessmentAttemptHistory,
} from "@/domain/assessment";

import {
  MODULE_PROGRESS_VERSION,
} from "@/domain/progress";

import type {
  ActivityProgress,
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgress,
  ModuleProgressIdentity,
  ProgressRepository,
} from "@/domain/progress";

import {
  getMechivraDatabase,
} from "@/infrastructure/persistence/mechivra-database";

import type {
  MechivraDatabase,
} from "@/infrastructure/persistence/mechivra-database";

export class ProgressPersistenceVersionConflictError
  extends Error {
  constructor(
    message:
      string,
  ) {
    super(
      message,
    );

    this.name =
      "ProgressPersistenceVersionConflictError";
  }
}

function activityPrimaryKey(
  identity:
    Pick<
      ActivityProgressIdentity,
      | "moduleId"
      | "moduleVersion"
      | "activityId"
    >,
): [
  string,
  string,
  string,
] {
  return [
    identity.moduleId,
    identity.moduleVersion,
    identity.activityId,
  ];
}

function assessmentHistoryPrimaryKey(
  identity:
    AssessmentHistoryIdentity,
): [
  string,
  string,
  string,
  string,
] {
  return [
    identity.activityId,
    identity.activityVersion,
    identity.assessmentId,
    identity.assessmentVersion,
  ];
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

export class DexieProgressRepository
  implements ProgressRepository {
  constructor(
    private readonly database:
      MechivraDatabase,
  ) {}

  async getActivityProgress(
    identity:
      ActivityProgressIdentity,
  ): Promise<
    ActivityProgress | null
  > {
    const record =
      await this.database
        .activityProgress
        .get(
          activityPrimaryKey(
            identity,
          ),
        );

    if (
      !record
    ) {
      return null;
    }

    /*
     * Same logical activity but another version is not
     * treated as current progress.
     *
     * Migration policy is deliberately postponed to 8.9.
     */
    if (
      record.activityVersion !==
      identity.activityVersion
    ) {
      return null;
    }

    return record;
  }

  async listActivityProgress(
    identity:
      ModuleProgressIdentity,
  ): Promise<
    readonly ActivityProgress[]
  > {
    return this.database
      .activityProgress
      .where(
        "[moduleId+moduleVersion]",
      )
      .equals([
        identity.moduleId,
        identity.moduleVersion,
      ])
      .toArray();
  }

  async saveActivityProgress(
    progress:
      ActivityProgress,
  ): Promise<void> {
    const key =
      activityPrimaryKey(
        progress,
      );

    await this.database.transaction(
      "rw",

      this.database
        .activityProgress,

      async () => {
        const existing =
          await this.database
            .activityProgress
            .get(
              key,
            );

        if (
          existing &&
          existing.activityVersion !==
            progress.activityVersion
        ) {
          throw new ProgressPersistenceVersionConflictError(
            `Activity "${progress.activityId}" already has persisted progress for version "${existing.activityVersion}". Version "${progress.activityVersion}" requires an explicit migration.`,
          );
        }

        await this.database
          .activityProgress
          .put(
            progress,
          );
      },
    );
  }

  async deleteActivityProgress(
    identity:
      ActivityProgressIdentity,
  ): Promise<void> {
    const key =
      activityPrimaryKey(
        identity,
      );

    await this.database.transaction(
      "rw",

      this.database
        .activityProgress,

      async () => {
        const existing =
          await this.database
            .activityProgress
            .get(
              key,
            );

        if (
          !existing
        ) {
          return;
        }

        /*
         * Never let a stale version-specific delete remove
         * another activity version.
         */
        if (
          existing.activityVersion !==
          identity.activityVersion
        ) {
          return;
        }

        await this.database
          .activityProgress
          .delete(
            key,
          );
      },
    );
  }

  async getModuleProgress(
    identity:
      ModuleProgressIdentity,
  ): Promise<
    ModuleProgress | null
  > {
    const activities =
      await this.listActivityProgress(
        identity,
      );

    if (
      activities.length ===
      0
    ) {
      return null;
    }

    return {
      version:
        MODULE_PROGRESS_VERSION,

      moduleId:
        identity.moduleId,

      moduleVersion:
        identity.moduleVersion,

      activityProgress:
        activities,

      updatedAt:
        latestUpdatedAt(
          activities,
        ),
    };
  }

  async deleteModuleActivityProgress(
    identity:
      ModuleProgressIdentity,
  ): Promise<void> {
    await this.database
      .activityProgress
      .where(
        "[moduleId+moduleVersion]",
      )
      .equals([
        identity.moduleId,
        identity.moduleVersion,
      ])
      .delete();
  }

  async getAssessmentAttemptHistory<
    TResponse,
  >(
    identity:
      AssessmentHistoryIdentity,
  ): Promise<
    AssessmentAttemptHistory<TResponse> | null
  > {
    const history =
      await this.database
        .assessmentHistories
        .get(
          assessmentHistoryPrimaryKey(
            identity,
          ),
        );

    if (
      !history
    ) {
      return null;
    }

    return history as
      AssessmentAttemptHistory<TResponse>;
  }

  async saveAssessmentAttemptHistory<
    TResponse,
  >(
    history:
      AssessmentAttemptHistory<TResponse>,
  ): Promise<void> {
    await this.database
      .assessmentHistories
      .put(
        history,
      );
  }

  async deleteAssessmentAttemptHistory(
    identity:
      AssessmentHistoryIdentity,
  ): Promise<void> {
    await this.database
      .assessmentHistories
      .delete(
        assessmentHistoryPrimaryKey(
          identity,
        ),
      );
  }

  async clearAllProgress():
    Promise<void> {
    await this.database.transaction(
      "rw",

      this.database
        .activityProgress,

      this.database
        .assessmentHistories,

      async () => {
        await Promise.all([
          this.database
            .activityProgress
            .clear(),

          this.database
            .assessmentHistories
            .clear(),
        ]);
      },
    );
  }
}

export function createDexieProgressRepository(
  database:
    MechivraDatabase =
    getMechivraDatabase(),
): ProgressRepository {
  return new DexieProgressRepository(
    database,
  );
}