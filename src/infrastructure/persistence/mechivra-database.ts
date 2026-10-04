import Dexie from "dexie";

import type {
  Table,
} from "dexie";

import type {
  AssessmentAttemptHistory,
} from "@/domain/assessment";

import type {
  ActivityProgress,
} from "@/domain/progress";

export const MECHIVRA_DATABASE_NAME =
  "mechivra";

export const MECHIVRA_DATABASE_VERSION =
  2 as const;

export const MECHIVRA_PERSISTENCE_SCHEMA_KEY =
  "schema-version" as const;

/*
 * Activity progress deliberately uses:
 *
 * [moduleId + moduleVersion + activityId]
 *
 * as its primary key.
 *
 * activityVersion remains part of the persisted record and
 * is validated by the repository before replacement.
 *
 * This prevents activity-v1 and activity-v2 from silently
 * coexisting inside the same module aggregate.
 */
export type ActivityProgressPrimaryKey = [
  string,
  string,
  string,
];

export type AssessmentHistoryPrimaryKey = [
  string,
  string,
  string,
  string,
];

export interface PersistenceMetadataRecord {
  readonly key:
    string;

  readonly value:
    string;

  readonly updatedAt:
    string | null;
}

const ACTIVITY_PROGRESS_SCHEMA =
  [
    "[moduleId+moduleVersion+activityId]",
    "[moduleId+moduleVersion]",
    "activityId",
    "activityVersion",
    "status",
  ].join(
    ",",
  );

const ASSESSMENT_HISTORY_SCHEMA =
  [
    "[activityId+activityVersion+assessmentId+assessmentVersion]",
    "[activityId+activityVersion]",
    "assessmentId",
    "assessmentVersion",
  ].join(
    ",",
  );

export class MechivraDatabase
  extends Dexie {
  readonly activityProgress!:
    Table<
      ActivityProgress,
      ActivityProgressPrimaryKey
    >;

  readonly assessmentHistories!:
    Table<
      AssessmentAttemptHistory<unknown>,
      AssessmentHistoryPrimaryKey
    >;

  readonly persistenceMeta!:
    Table<
      PersistenceMetadataRecord,
      string
    >;

  constructor(
    databaseName:
      string =
      MECHIVRA_DATABASE_NAME,
  ) {
    super(
      databaseName,
    );

    /*
     * Keep the original v1 declaration permanently.
     *
     * Dexie uses this version chain to upgrade databases that
     * were already created by older Mechivra releases.
     */
    this.version(
      1,
    ).stores({
      activityProgress:
        ACTIVITY_PROGRESS_SCHEMA,

      assessmentHistories:
        ASSESSMENT_HISTORY_SCHEMA,
    });

    /*
     * v2 adds persistence metadata only.
     *
     * No existing progress rows are rewritten or deleted.
     * Activity and assessment stores retain their v1 keys,
     * so the upgrade is intentionally lossless.
     */
    this.version(
      MECHIVRA_DATABASE_VERSION,
    )
      .stores({
        activityProgress:
          ACTIVITY_PROGRESS_SCHEMA,

        assessmentHistories:
          ASSESSMENT_HISTORY_SCHEMA,

        persistenceMeta:
          "&key",
      })
      .upgrade(
        async (
          transaction,
        ) => {
          await transaction
            .table<PersistenceMetadataRecord>(
              "persistenceMeta",
            )
            .put({
              key:
                MECHIVRA_PERSISTENCE_SCHEMA_KEY,

              value:
                String(
                  MECHIVRA_DATABASE_VERSION,
                ),

              updatedAt:
                null,
            });
        },
      );
  }
}

let defaultDatabase:
  MechivraDatabase | null =
  null;

export function getMechivraDatabase():
  MechivraDatabase {
  if (
    typeof globalThis.indexedDB ===
    "undefined"
  ) {
    throw new Error(
      "Mechivra IndexedDB persistence is unavailable in this environment.",
    );
  }

  if (
    defaultDatabase ===
    null
  ) {
    defaultDatabase =
      new MechivraDatabase();
  }

  return defaultDatabase;
}