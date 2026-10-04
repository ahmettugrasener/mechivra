import "fake-indexeddb/auto";

import Dexie from "dexie";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  createAssessmentAttempt,
  createAssessmentAttemptHistory,
} from "@/domain/assessment";

import {
  createActivityProgress,
} from "@/domain/progress";

import {
  MECHIVRA_DATABASE_VERSION,
  MechivraDatabase,
} from "@/infrastructure/persistence/mechivra-database";

const databases:
  string[] =
  [];

afterEach(
  async () => {
    for (
      const name
      of databases
    ) {
      await Dexie.delete(
        name,
      );
    }

    databases.splice(
      0,
      databases.length,
    );
  },
);

function createDatabaseName():
  string {
  const name =
    `mechivra-migration-${databases.length + 1}`;

  databases.push(
    name,
  );

  return name;
}

describe(
  "Mechivra database migration",
  () => {
    it(
      "upgrades a real v1 database to v2 without losing progress or assessment history",
      async () => {
        const databaseName =
          createDatabaseName();

        const legacy =
          new Dexie(
            databaseName,
          );

        legacy.version(
          1,
        ).stores({
          activityProgress:
            [
              "[moduleId+moduleVersion+activityId]",
              "[moduleId+moduleVersion]",
              "activityId",
              "activityVersion",
              "status",
            ].join(
              ",",
            ),

          assessmentHistories:
            [
              "[activityId+activityVersion+assessmentId+assessmentVersion]",
              "[activityId+activityVersion]",
              "assessmentId",
              "assessmentVersion",
            ].join(
              ",",
            ),
        });

        await legacy.open();

        const progress =
          createActivityProgress({
            moduleId:
              "module-test",

            moduleVersion:
              "1.0.0",

            activityId:
              "activity-test",

            activityVersion:
              "1.0.0",
          });

        const attempt =
          createAssessmentAttempt<{
            readonly answer:
              number;
          }>({
            attemptId:
              "attempt-1",

            activityId:
              "activity-test",

            activityVersion:
              "1.0.0",

            assessmentId:
              "assessment-test",

            assessmentVersion:
              "1.0.0",

            attemptNumber:
              1,
          });

        const history =
          createAssessmentAttemptHistory(
            attempt,
          );

        await legacy
          .table(
            "activityProgress",
          )
          .put(
            progress,
          );

        await legacy
          .table(
            "assessmentHistories",
          )
          .put(
            history,
          );

        legacy.close();

        const upgraded =
          new MechivraDatabase(
            databaseName,
          );

        await upgraded.open();

        expect(
          upgraded.verno,
        ).toBe(
          MECHIVRA_DATABASE_VERSION,
        );

        expect(
          await upgraded
            .activityProgress
            .get([
              "module-test",
              "1.0.0",
              "activity-test",
            ]),
        ).toEqual(
          progress,
        );

        expect(
          await upgraded
            .assessmentHistories
            .get([
              "activity-test",
              "1.0.0",
              "assessment-test",
              "1.0.0",
            ]),
        ).toEqual(
          history,
        );

        expect(
          upgraded
            .persistenceMeta,
        ).toBeDefined();

        upgraded.close();
      },
    );

    it(
      "creates the v2 metadata store for a fresh database",
      async () => {
        const databaseName =
          createDatabaseName();

        const database =
          new MechivraDatabase(
            databaseName,
          );

        await database.open();

        expect(
          database.verno,
        ).toBe(
          2,
        );

        expect(
          database.tables.map(
            (
              table,
            ) =>
              table.name,
          ),
        ).toEqual(
          expect.arrayContaining([
            "activityProgress",
            "assessmentHistories",
            "persistenceMeta",
          ]),
        );

        database.close();
      },
    );
  },
);