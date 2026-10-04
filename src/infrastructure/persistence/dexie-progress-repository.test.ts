import "fake-indexeddb/auto";

import Dexie from "dexie";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  createAssessmentAttempt,
  createAssessmentAttemptHistory,
  createAssessmentResult,
  evaluateAssessmentAttempt,
  replaceLatestAssessmentAttempt,
  submitAssessmentAttempt,
} from "@/domain/assessment";

import {
  createActivityProgress,
  createActivityProgressIdentity,
  createAssessmentHistoryIdentity,
  createModuleProgressIdentity,
  recordActivityProgressEvent,
} from "@/domain/progress";

import {
  DexieProgressRepository,
  ProgressPersistenceVersionConflictError,
} from "@/infrastructure/persistence/dexie-progress-repository";

import {
  MechivraDatabase,
} from "@/infrastructure/persistence/mechivra-database";

let databaseCounter =
  0;

let database:
  MechivraDatabase;

let repository:
  DexieProgressRepository;

beforeEach(
  () => {
    databaseCounter +=
      1;

    database =
      new MechivraDatabase(
        `mechivra-test-${databaseCounter}`,
      );

    repository =
      new DexieProgressRepository(
        database,
      );
  },
);

afterEach(
  async () => {
    const databaseName =
      database.name;

    database.close();

    await Dexie.delete(
      databaseName,
    );
  },
);

describe(
  "DexieProgressRepository",
  () => {
    it(
      "persists and restores activity progress",
      async () => {
        const initial =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-test",

              activityVersion:
                "1.0.0",
            },
          );

        const completed =
          recordActivityProgressEvent(
            initial,

            {
              type:
                "reached_end",
            },

            "reached_end",

            "2026-10-04T10:00:00.000Z",
          );

        await repository
          .saveActivityProgress(
            completed,
          );

        const restored =
          await repository
            .getActivityProgress(
              createActivityProgressIdentity(
                "module-test",
                "1.0.0",
                "activity-test",
                "1.0.0",
              ),
            );

        expect(
          restored,
        ).toEqual(
          completed,
        );
      },
    );

    it(
      "keeps another activity version from being treated as current progress",
      async () => {
        const versionOne =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-test",

              activityVersion:
                "1.0.0",
            },
          );

        await repository
          .saveActivityProgress(
            versionOne,
          );

        const versionTwoLookup =
          await repository
            .getActivityProgress(
              createActivityProgressIdentity(
                "module-test",
                "1.0.0",
                "activity-test",
                "2.0.0",
              ),
            );

        expect(
          versionTwoLookup,
        ).toBeNull();
      },
    );

    it(
      "rejects silent activity-version replacement",
      async () => {
        const versionOne =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-test",

              activityVersion:
                "1.0.0",
            },
          );

        const versionTwo =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-test",

              activityVersion:
                "2.0.0",
            },
          );

        await repository
          .saveActivityProgress(
            versionOne,
          );

        await expect(
          repository
            .saveActivityProgress(
              versionTwo,
            ),
        ).rejects.toBeInstanceOf(
          ProgressPersistenceVersionConflictError,
        );
      },
    );

    it(
      "derives module progress from persisted activity progress",
      async () => {
        const activityOne =
          recordActivityProgressEvent(
            createActivityProgress(
              {
                moduleId:
                  "module-test",

                moduleVersion:
                  "1.0.0",

                activityId:
                  "activity-1",

                activityVersion:
                  "1.0.0",
              },
            ),

            {
              type:
                "reached_end",
            },

            "reached_end",

            "2026-10-04T10:00:00.000Z",
          );

        const activityTwo =
          recordActivityProgressEvent(
            createActivityProgress(
              {
                moduleId:
                  "module-test",

                moduleVersion:
                  "1.0.0",

                activityId:
                  "activity-2",

                activityVersion:
                  "1.0.0",
              },
            ),

            {
              type:
                "reached_end",
            },

            "opened",

            "2026-10-04T10:05:00.000Z",
          );

        await repository
          .saveActivityProgress(
            activityOne,
          );

        await repository
          .saveActivityProgress(
            activityTwo,
          );

        const moduleProgress =
          await repository
            .getModuleProgress(
              createModuleProgressIdentity(
                "module-test",
                "1.0.0",
              ),
            );

        expect(
          moduleProgress,
        ).not.toBeNull();

        expect(
          moduleProgress
            ?.activityProgress,
        ).toHaveLength(
          2,
        );

        expect(
          moduleProgress
            ?.updatedAt,
        ).toBe(
          "2026-10-04T10:05:00.000Z",
        );
      },
    );

    it(
      "isolates module versions",
      async () => {
        const versionOne =
          recordActivityProgressEvent(
            createActivityProgress(
              {
                moduleId:
                  "module-test",

                moduleVersion:
                  "1.0.0",

                activityId:
                  "activity-1",

                activityVersion:
                  "1.0.0",
              },
            ),

            {
              type:
                "reached_end",
            },

            "reached_end",

            "2026-10-04T10:00:00.000Z",
          );

        const versionTwo =
          recordActivityProgressEvent(
            createActivityProgress(
              {
                moduleId:
                  "module-test",

                moduleVersion:
                  "2.0.0",

                activityId:
                  "activity-1",

                activityVersion:
                  "2.0.0",
              },
            ),

            {
              type:
                "reached_end",
            },

            "opened",

            "2026-10-04T11:00:00.000Z",
          );

        await repository
          .saveActivityProgress(
            versionOne,
          );

        await repository
          .saveActivityProgress(
            versionTwo,
          );

        const first =
          await repository
            .listActivityProgress(
              createModuleProgressIdentity(
                "module-test",
                "1.0.0",
              ),
            );

        const second =
          await repository
            .listActivityProgress(
              createModuleProgressIdentity(
                "module-test",
                "2.0.0",
              ),
            );

        expect(
          first,
        ).toHaveLength(
          1,
        );

        expect(
          second,
        ).toHaveLength(
          1,
        );

        expect(
          first[0]
            ?.moduleVersion,
        ).toBe(
          "1.0.0",
        );

        expect(
          second[0]
            ?.moduleVersion,
        ).toBe(
          "2.0.0",
        );
      },
    );

    it(
      "persists complete Assessment Core history",
      async () => {
        const firstAttempt =
          createAssessmentAttempt<{
            readonly value:
              number;
          }>(
            {
              attemptId:
                "assessment-test-attempt-1",

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
            },
          );

        const initialHistory =
          createAssessmentAttemptHistory(
            firstAttempt,
          );

        const submitted =
          submitAssessmentAttempt(
            firstAttempt,
            {
              value:
                5,
            },
          );

        const submittedHistory =
          replaceLatestAssessmentAttempt(
            initialHistory,
            submitted,
          );

        const evaluated =
          evaluateAssessmentAttempt(
            submitted,
            createAssessmentResult(
              [
                {
                  id:
                    "answer",

                  status:
                    "incorrect",

                  score:
                    0,

                  maxScore:
                    1,
                },
              ],
            ),
          );

        const evaluatedHistory =
          replaceLatestAssessmentAttempt(
            submittedHistory,
            evaluated,
          );

        await repository
          .saveAssessmentAttemptHistory(
            evaluatedHistory,
          );

        const restored =
          await repository
            .getAssessmentAttemptHistory<{
              readonly value:
                number;
            }>(
              createAssessmentHistoryIdentity(
                "activity-test",
                "1.0.0",
                "assessment-test",
                "1.0.0",
              ),
            );

        expect(
          restored,
        ).toEqual(
          evaluatedHistory,
        );

        expect(
          restored
            ?.attempts[0]
            ?.response,
        ).toEqual({
          value:
            5,
        });

        expect(
          restored
            ?.attempts[0]
            ?.result
            ?.correct,
        ).toBe(
          false,
        );
      },
    );

    it(
      "deletes one exact assessment history",
      async () => {
        const attempt =
          createAssessmentAttempt<{
            readonly value:
              number;
          }>(
            {
              attemptId:
                "assessment-test-attempt-1",

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
            },
          );

        const history =
          createAssessmentAttemptHistory(
            attempt,
          );

        await repository
          .saveAssessmentAttemptHistory(
            history,
          );

        const identity =
          createAssessmentHistoryIdentity(
            "activity-test",
            "1.0.0",
            "assessment-test",
            "1.0.0",
          );

        await repository
          .deleteAssessmentAttemptHistory(
            identity,
          );

        expect(
          await repository
            .getAssessmentAttemptHistory(
              identity,
            ),
        ).toBeNull();
      },
    );

    it(
      "clears activity progress and assessment histories together",
      async () => {
        const activity =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-test",

              activityVersion:
                "1.0.0",
            },
          );

        const attempt =
          createAssessmentAttempt<{
            readonly value:
              number;
          }>(
            {
              attemptId:
                "assessment-test-attempt-1",

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
            },
          );

        await repository
          .saveActivityProgress(
            activity,
          );

        await repository
          .saveAssessmentAttemptHistory(
            createAssessmentAttemptHistory(
              attempt,
            ),
          );

        await repository
          .clearAllProgress();

        expect(
          await database
            .activityProgress
            .count(),
        ).toBe(
          0,
        );

        expect(
          await database
            .assessmentHistories
            .count(),
        ).toBe(
          0,
        );
      },
    );
  },
);