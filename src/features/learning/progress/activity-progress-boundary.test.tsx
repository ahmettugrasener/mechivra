import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  useState,
} from "react";

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  AssessmentAttemptHistory,
} from "@/domain/assessment";

import type {
  LearningActivity,
} from "@/domain/learning/types";

import {
  createActivityProgress,
  recordActivityProgressEvent,
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
  ActivityProgressBoundary,
} from "@/features/learning/progress/activity-progress-boundary";

afterEach(
  () => {
    cleanup();

    vi.unstubAllGlobals();
  },
);

class MemoryProgressRepository
  implements ProgressRepository {
  progress:
    ActivityProgress | null =
    null;

  async getActivityProgress(
    identity:
      ActivityProgressIdentity,
  ): Promise<
    ActivityProgress | null
  > {
    if (
      !this.progress
    ) {
      return null;
    }

    if (
      this.progress.moduleId !==
        identity.moduleId ||
      this.progress.moduleVersion !==
        identity.moduleVersion ||
      this.progress.activityId !==
        identity.activityId ||
      this.progress.activityVersion !==
        identity.activityVersion
    ) {
      return null;
    }

    return this.progress;
  }

  async listActivityProgress(
    _identity:
      ModuleProgressIdentity,
  ): Promise<
    readonly ActivityProgress[]
  > {
    return this.progress
      ? [
          this.progress,
        ]
      : [];
  }

  async saveActivityProgress(
    progress:
      ActivityProgress,
  ): Promise<void> {
    this.progress =
      progress;
  }

  async deleteActivityProgress(
    _identity:
      ActivityProgressIdentity,
  ): Promise<void> {
    this.progress =
      null;
  }

  async getModuleProgress(
    _identity:
      ModuleProgressIdentity,
  ): Promise<
    ModuleProgress | null
  > {
    return null;
  }

  async deleteModuleActivityProgress(
    _identity:
      ModuleProgressIdentity,
  ): Promise<void> {
    this.progress =
      null;
  }

  async getAssessmentAttemptHistory<
    TResponse,
  >(
    _identity:
      AssessmentHistoryIdentity,
  ): Promise<
    AssessmentAttemptHistory<TResponse> | null
  > {
    return null;
  }

  async saveAssessmentAttemptHistory<
    TResponse,
  >(
    _history:
      AssessmentAttemptHistory<TResponse>,
  ): Promise<void> {}

  async deleteAssessmentAttemptHistory(
    _identity:
      AssessmentHistoryIdentity,
  ): Promise<void> {}

  async clearAllProgress():
    Promise<void> {
    this.progress =
      null;
  }
}

function createActivity(
  type:
    LearningActivity["type"],

  completionRule:
    LearningActivity[
      "completionRule"
    ],
): LearningActivity {
  return {
    id:
      `activity-test-${type}`,

    version:
      "1.0.0",

    moduleId:
      "module-test",

    type,

    order:
      1,

    title: {
      tr:
        "Test",

      en:
        "Test",
    },

    learningOutcomeIds: [
      "outcome-test",
    ],

    conceptIds: [
      "concept-test",
    ],

    sourceIds: [
      "source-test",
    ],

    contentBlocks:
      [],

    completionRule,

    status:
      "draft",
  };
}

function PredictionFixture() {
  const [
    count,
    setCount,
  ] =
    useState(
      0,
    );

  return (
    <button
      type="button"
      data-prediction-activity="activity-test-prediction"
      data-prediction-submitted={
        count >
        0
          ? "true"
          : "false"
      }
      data-attempt-count={
        count
      }
      onClick={() =>
        setCount(
          (
            current,
          ) =>
            current +
            1,
        )
      }
    >
      Submit prediction
    </button>
  );
}

function ProblemFixture() {
  const [
    count,
    setCount,
  ] =
    useState(
      0,
    );

  return (
    <button
      type="button"
      data-attempt-submitted={
        count >
        0
          ? "true"
          : "false"
      }
      data-attempt-count={
        count
      }
      onClick={() =>
        setCount(
          (
            current,
          ) =>
            current +
            1,
        )
      }
    >
      Submit attempt
    </button>
  );
}

function InteractiveFixture() {
  const [
    count,
    setCount,
  ] =
    useState(
      0,
    );

  return (
    <button
      type="button"
      data-meaningful-interaction={
        count >
        0
          ? "true"
          : "false"
      }
      data-interaction-count={
        count
      }
      onClick={() =>
        setCount(
          (
            current,
          ) =>
            current +
            1,
        )
      }
    >
      Change parameter
    </button>
  );
}

describe(
  "ActivityProgressBoundary",
  () => {
    it(
      "persists opened evidence without treating it as prediction completion",
      async () => {
        const repository =
          new MemoryProgressRepository();

        render(
          <ActivityProgressBoundary
            activity={
              createActivity(
                "prediction",
                {
                  type:
                    "submitted_prediction",
                },
              )
            }
            moduleVersion="1.0.0"
            repository={
              repository
            }
          >
            <div>
              Prediction
            </div>
          </ActivityProgressBoundary>,
        );

        await waitFor(
          () => {
            expect(
              repository
                .progress
                ?.evidence
                .opened,
            ).toBe(
              true,
            );
          },
        );

        expect(
          repository
            .progress
            ?.status,
        ).toBe(
          "in_progress",
        );

        expect(
          repository
            .progress
            ?.evidence
            .predictionSubmissions,
        ).toBe(
          0,
        );
      },
    );

    it(
      "persists prediction completion independently from correctness",
      async () => {
        const repository =
          new MemoryProgressRepository();

        render(
          <ActivityProgressBoundary
            activity={
              createActivity(
                "prediction",
                {
                  type:
                    "submitted_prediction",
                },
              )
            }
            moduleVersion="1.0.0"
            repository={
              repository
            }
          >
            <PredictionFixture />
          </ActivityProgressBoundary>,
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "activity-progress-boundary",
              ),
            ).toHaveAttribute(
              "data-progress-hydrated",
              "true",
            );
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Submit prediction",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              repository
                .progress
                ?.evidence
                .predictionSubmissions,
            ).toBe(
              1,
            );

            expect(
              repository
                .progress
                ?.status,
            ).toBe(
              "completed",
            );
          },
        );

        expect(
          "correct" in (
            repository.progress ??
            {}
          ),
        ).toBe(
          false,
        );
      },
    );

    it(
      "persists submitted-attempt completion",
      async () => {
        const repository =
          new MemoryProgressRepository();

        render(
          <ActivityProgressBoundary
            activity={
              createActivity(
                "problem",
                {
                  type:
                    "submitted_attempt",
                },
              )
            }
            moduleVersion="1.0.0"
            repository={
              repository
            }
          >
            <ProblemFixture />
          </ActivityProgressBoundary>,
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "activity-progress-boundary",
              ),
            ).toHaveAttribute(
              "data-progress-hydrated",
              "true",
            );
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Submit attempt",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              repository
                .progress
                ?.evidence
                .attemptsSubmitted,
            ).toBe(
              1,
            );

            expect(
              repository
                .progress
                ?.status,
            ).toBe(
              "completed",
            );
          },
        );
      },
    );

    it(
      "adds a new interactive-session count on top of persisted evidence",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const initial =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-test-interactive",

              activityVersion:
                "1.0.0",
            },
          );

        repository.progress =
          recordActivityProgressEvent(
            initial,

            {
              type:
                "meaningful_interaction",
            },

            "meaningful_interaction",

            "2026-10-04T10:00:00.000Z",
          );

        render(
          <ActivityProgressBoundary
            activity={
              createActivity(
                "interactive",
                {
                  type:
                    "meaningful_interaction",
                },
              )
            }
            moduleVersion="1.0.0"
            repository={
              repository
            }
          >
            <InteractiveFixture />
          </ActivityProgressBoundary>,
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "activity-progress-boundary",
              ),
            ).toHaveAttribute(
              "data-progress-hydrated",
              "true",
            );
          },
        );

        expect(
          repository
            .progress
            ?.evidence
            .meaningfulInteractions,
        ).toBe(
          1,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Change parameter",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              repository
                .progress
                ?.evidence
                .meaningfulInteractions,
            ).toBe(
              2,
            );
          },
        );
      },
    );

    it(
      "records reached-end completion only when the end sentinel intersects",
      async () => {
        class TestIntersectionObserver {
          readonly root =
            null;

          readonly rootMargin =
            "0px";

          readonly thresholds = [
            0.25,
          ];

          constructor(
            private readonly callback:
              IntersectionObserverCallback,
          ) {}

          observe(
            target:
              Element,
          ): void {
            this.callback(
              [
                {
                  isIntersecting:
                    true,

                  target,

                  intersectionRatio:
                    1,

                  time:
                    0,

                  boundingClientRect:
                    target.getBoundingClientRect(),

                  intersectionRect:
                    target.getBoundingClientRect(),

                  rootBounds:
                    null,
                } as IntersectionObserverEntry,
              ],

              this as unknown as
                IntersectionObserver,
            );
          }

          unobserve():
            void {}

          disconnect():
            void {}

          takeRecords():
            IntersectionObserverEntry[] {
            return [];
          }
        }

        vi.stubGlobal(
          "IntersectionObserver",
          TestIntersectionObserver,
        );

        const repository =
          new MemoryProgressRepository();

        render(
          <ActivityProgressBoundary
            activity={
              createActivity(
                "summary",
                {
                  type:
                    "reached_end",
                },
              )
            }
            moduleVersion="1.0.0"
            repository={
              repository
            }
          >
            <div>
              Summary
            </div>
          </ActivityProgressBoundary>,
        );

        await waitFor(
          () => {
            expect(
              repository
                .progress
                ?.evidence
                .reachedEnd,
            ).toBe(
              true,
            );

            expect(
              repository
                .progress
                ?.status,
            ).toBe(
              "completed",
            );
          },
        );
      },
    );
  },
);