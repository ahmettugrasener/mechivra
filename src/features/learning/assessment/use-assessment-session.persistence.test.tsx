import {
  act,
  cleanup,
  renderHook,
  waitFor,
} from "@testing-library/react";

import {
  afterEach,
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

import type {
  AssessmentAttemptHistory,
} from "@/domain/assessment";

import type {
  ActivityProgress,
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgress,
  ModuleProgressIdentity,
  ProgressRepository,
} from "@/domain/progress";

import {
  useAssessmentSession,
} from "@/features/learning/assessment/use-assessment-session";

afterEach(
  () => {
    cleanup();
  },
);

interface TestResponse {
  readonly value:
    number;
}

function evaluate(
  response:
    TestResponse,
) {
  const correct =
    response.value ===
    10;

  return createAssessmentResult(
    [
      {
        id:
          "answer",

        status:
          correct
            ? "correct"
            : "incorrect",

        score:
          correct
            ? 1
            : 0,

        maxScore:
          1,
      },
    ],
  );
}

function createEvaluatedHistory():
  AssessmentAttemptHistory<TestResponse> {
  const draft =
    createAssessmentAttempt<TestResponse>(
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
      draft,
    );

  const submitted =
    submitAssessmentAttempt(
      draft,
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
      evaluate({
        value:
          5,
      }),
    );

  return replaceLatestAssessmentAttempt(
    submittedHistory,
    evaluated,
  );
}

class MemoryProgressRepository
  implements ProgressRepository {
  history:
    AssessmentAttemptHistory<unknown> | null =
    null;

  saveCount =
    0;

  async getActivityProgress(
    _identity:
      ActivityProgressIdentity,
  ): Promise<
    ActivityProgress | null
  > {
    return null;
  }

  async listActivityProgress(
    _identity:
      ModuleProgressIdentity,
  ): Promise<
    readonly ActivityProgress[]
  > {
    return [];
  }

  async saveActivityProgress(
    _progress:
      ActivityProgress,
  ): Promise<void> {}

  async deleteActivityProgress(
    _identity:
      ActivityProgressIdentity,
  ): Promise<void> {}

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
  ): Promise<void> {}

  async getAssessmentAttemptHistory<
    TResponse,
  >(
    identity:
      AssessmentHistoryIdentity,
  ): Promise<
    AssessmentAttemptHistory<TResponse> | null
  > {
    if (
      !this.history
    ) {
      return null;
    }

    if (
      this.history.activityId !==
        identity.activityId ||
      this.history.activityVersion !==
        identity.activityVersion ||
      this.history.assessmentId !==
        identity.assessmentId ||
      this.history.assessmentVersion !==
        identity.assessmentVersion
    ) {
      return null;
    }

    return this.history as
      AssessmentAttemptHistory<TResponse>;
  }

  async saveAssessmentAttemptHistory<
    TResponse,
  >(
    history:
      AssessmentAttemptHistory<TResponse>,
  ): Promise<void> {
    this.history =
      history as
        AssessmentAttemptHistory<unknown>;

    this.saveCount +=
      1;
  }

  async deleteAssessmentAttemptHistory(
    _identity:
      AssessmentHistoryIdentity,
  ): Promise<void> {
    this.history =
      null;
  }

  async clearAllProgress():
    Promise<void> {
    this.history =
      null;
  }
}

class FailingReadRepository
  extends MemoryProgressRepository {
  override async getAssessmentAttemptHistory<
    TResponse,
  >(
    _identity:
      AssessmentHistoryIdentity,
  ): Promise<
    AssessmentAttemptHistory<TResponse> | null
  > {
    throw new Error(
      "Persistence unavailable",
    );
  }
}

function createConfig(
  repository:
    ProgressRepository,
) {
  return {
    activityId:
      "activity-test",

    activityVersion:
      "1.0.0",

    assessmentId:
      "assessment-test",

    assessmentVersion:
      "1.0.0",

    evaluate,

    repository,
  } as const;
}

describe(
  "useAssessmentSession persistence",
  () => {
    it(
      "hydrates an existing evaluated history before allowing another action",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.history =
          createEvaluatedHistory() as
            AssessmentAttemptHistory<unknown>;

        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                createConfig(
                  repository,
                ),
              ),
          );

        expect(
          result.current
            .isHydrated,
        ).toBe(
          false,
        );

        expect(
          result.current
            .canSubmit,
        ).toBe(
          false,
        );

        await waitFor(
          () => {
            expect(
              result.current
                .isHydrated,
            ).toBe(
              true,
            );
          },
        );

        expect(
          result.current
            .summary
            .evaluatedAttemptCount,
        ).toBe(
          1,
        );

        expect(
          result.current
            .latestAttempt
            .response,
        ).toEqual({
          value:
            5,
        });

        expect(
          result.current
            .latestAttempt
            .result
            ?.correct,
        ).toBe(
          false,
        );

        expect(
          result.current
            .canRevise,
        ).toBe(
          true,
        );
      },
    );

    it(
      "persists an evaluated submission",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                createConfig(
                  repository,
                ),
              ),
          );

        await waitFor(
          () => {
            expect(
              result.current
                .isHydrated,
            ).toBe(
              true,
            );
          },
        );

        act(
          () => {
            result.current
              .submit({
                value:
                  5,
              });
          },
        );

        expect(
          result.current
            .latestAttempt
            .status,
        ).toBe(
          "evaluated",
        );

        await waitFor(
          () => {
            expect(
              repository
                .saveCount,
            ).toBe(
              1,
            );
          },
        );

        expect(
          repository.history
            ?.attempts[0]
            ?.result
            ?.correct,
        ).toBe(
          false,
        );
      },
    );

    it(
      "persists a newly created revision without overwriting the first attempt",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                createConfig(
                  repository,
                ),
              ),
          );

        await waitFor(
          () => {
            expect(
              result.current
                .isHydrated,
            ).toBe(
              true,
            );
          },
        );

        act(
          () => {
            result.current
              .submit({
                value:
                  5,
              });
          },
        );

        await waitFor(
          () => {
            expect(
              repository
                .saveCount,
            ).toBe(
              1,
            );
          },
        );

        act(
          () => {
            result.current
              .revise();
          },
        );

        await waitFor(
          () => {
            expect(
              repository
                .saveCount,
            ).toBe(
              2,
            );
          },
        );

        expect(
          repository.history
            ?.attempts,
        ).toHaveLength(
          2,
        );

        expect(
          repository.history
            ?.attempts[0]
            ?.status,
        ).toBe(
          "evaluated",
        );

        expect(
          repository.history
            ?.attempts[1]
            ?.status,
        ).toBe(
          "draft",
        );

        expect(
          repository.history
            ?.attempts[1]
            ?.attemptNumber,
        ).toBe(
          2,
        );
      },
    );

    it(
      "continues in memory when hydration fails",
      async () => {
        const repository =
          new FailingReadRepository();

        const {
          result,
        } =
          renderHook(
            () =>
              useAssessmentSession<TestResponse>(
                createConfig(
                  repository,
                ),
              ),
          );

        await waitFor(
          () => {
            expect(
              result.current
                .isHydrated,
            ).toBe(
              true,
            );
          },
        );

        expect(
          result.current
            .persistenceError,
        ).toMatch(
          /persistence unavailable/i,
        );

        expect(
          result.current
            .isPersistenceEnabled,
        ).toBe(
          false,
        );

        expect(
          result.current
            .canSubmit,
        ).toBe(
          true,
        );

        act(
          () => {
            result.current
              .submit({
                value:
                  10,
              });
          },
        );

        expect(
          result.current
            .latestAttempt
            .result
            ?.correct,
        ).toBe(
          true,
        );
      },
    );
  },
);