import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createActivityProgress,
  evaluateActivityProgressStatus,
  recordActivityProgressEvent,
} from "@/domain/progress/activity-progress";

describe(
  "Activity progress",
  () => {
    it(
      "starts with no completion evidence",
      () => {
        const progress =
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

        expect(
          progress.status,
        ).toBe(
          "not_started",
        );

        expect(
          progress.evidence,
        ).toEqual({
          opened:
            false,

          reachedEnd:
            false,

          predictionSubmissions:
            0,

          meaningfulInteractions:
            0,

          attemptsSubmitted:
            0,

          explicitCompletions:
            0,
        });

        expect(
          progress.startedAt,
        ).toBeNull();

        expect(
          progress.updatedAt,
        ).toBeNull();

        expect(
          progress.completedAt,
        ).toBeNull();
      },
    );

    it(
      "keeps correctness and mastery outside the progress record",
      () => {
        const progress =
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

        expect(
          "correct" in
            progress,
        ).toBe(
          false,
        );

        expect(
          "mastered" in
            progress,
        ).toBe(
          false,
        );
      },
    );

    it(
      "becomes in progress when activity evidence exists but the completion rule is not satisfied",
      () => {
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

        const progress =
          recordActivityProgressEvent(
            initial,

            {
              type:
                "reached_end",
            },

            "opened",

            "2026-10-04T10:00:00.000Z",
          );

        expect(
          progress.status,
        ).toBe(
          "in_progress",
        );

        expect(
          progress.startedAt,
        ).toBe(
          "2026-10-04T10:00:00.000Z",
        );

        expect(
          progress.completedAt,
        ).toBeNull();
      },
    );

    it(
      "completes only when the configured learning completion rule is satisfied",
      () => {
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

        const opened =
          recordActivityProgressEvent(
            initial,

            {
              type:
                "reached_end",
            },

            "opened",

            "2026-10-04T10:00:00.000Z",
          );

        const completed =
          recordActivityProgressEvent(
            opened,

            {
              type:
                "reached_end",
            },

            "reached_end",

            "2026-10-04T10:05:00.000Z",
          );

        expect(
          completed.status,
        ).toBe(
          "completed",
        );

        expect(
          completed.completedAt,
        ).toBe(
          "2026-10-04T10:05:00.000Z",
        );
      },
    );

    it(
      "preserves the first completion timestamp after later events",
      () => {
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
                "submitted_attempt",
            },

            "attempt_submitted",

            "2026-10-04T10:05:00.000Z",
          );

        const later =
          recordActivityProgressEvent(
            completed,

            {
              type:
                "submitted_attempt",
            },

            "attempt_submitted",

            "2026-10-04T10:10:00.000Z",
          );

        expect(
          later.status,
        ).toBe(
          "completed",
        );

        expect(
          later.completedAt,
        ).toBe(
          "2026-10-04T10:05:00.000Z",
        );

        expect(
          later.updatedAt,
        ).toBe(
          "2026-10-04T10:10:00.000Z",
        );

        expect(
          later.evidence
            .attemptsSubmitted,
        ).toBe(
          2,
        );
      },
    );

    it(
      "evaluates prediction completion from submission evidence only",
      () => {
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

        expect(
          evaluateActivityProgressStatus(
            {
              type:
                "submitted_prediction",
            },

            initial.evidence,
          ),
        ).toBe(
          "not_started",
        );

        const submitted =
          recordActivityProgressEvent(
            initial,

            {
              type:
                "submitted_prediction",
            },

            "prediction_submitted",

            "2026-10-04T10:00:00.000Z",
          );

        expect(
          submitted.status,
        ).toBe(
          "completed",
        );
      },
    );
  },
);