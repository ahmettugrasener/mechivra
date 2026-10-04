import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

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
  ActivityProgress,
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgress,
  ModuleProgressIdentity,
  ProgressRepository,
} from "@/domain/progress";

import {
  ProgressDataSettings,
} from "@/features/learning/progress/progress-data-settings";

afterEach(
  () => {
    cleanup();
  },
);

class MemoryProgressRepository
  implements ProgressRepository {
  clearCount =
    0;

  shouldFail =
    false;

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
    if (
      this.shouldFail
    ) {
      throw new Error(
        "Reset failed",
      );
    }

    this.clearCount +=
      1;
  }
}

describe(
  "ProgressDataSettings",
  () => {
    it(
      "does not delete progress on the first click",
      () => {
        const repository =
          new MemoryProgressRepository();

        render(
          <ProgressDataSettings
            locale="en"
            repository={
              repository
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Reset progress",
            },
          ),
        );

        expect(
          repository.clearCount,
        ).toBe(
          0,
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Yes, delete all",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "supports cancelling the destructive reset",
      () => {
        const repository =
          new MemoryProgressRepository();

        render(
          <ProgressDataSettings
            locale="en"
            repository={
              repository
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Reset progress",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Cancel",
            },
          ),
        );

        expect(
          repository.clearCount,
        ).toBe(
          0,
        );

        expect(
          screen.getByTestId(
            "progress-data-settings",
          ),
        ).toHaveAttribute(
          "data-reset-state",
          "idle",
        );
      },
    );

    it(
      "clears all progress only after explicit confirmation",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const dispatchSpy =
          vi.spyOn(
            window,
            "dispatchEvent",
          );

        render(
          <ProgressDataSettings
            locale="tr"
            repository={
              repository
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "İlerlemeyi sıfırla",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Evet, tümünü sil",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              repository
                .clearCount,
            ).toBe(
              1,
            );
          },
        );

        expect(
          screen.getByTestId(
            "progress-data-settings",
          ),
        ).toHaveAttribute(
          "data-reset-state",
          "success",
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          /silindi/i,
        );

        expect(
          dispatchSpy,
        ).toHaveBeenCalled();
      },
    );

    it(
      "surfaces repository errors without pretending the reset succeeded",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.shouldFail =
          true;

        render(
          <ProgressDataSettings
            locale="en"
            repository={
              repository
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Reset progress",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Yes, delete all",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "progress-data-settings",
              ),
            ).toHaveAttribute(
              "data-reset-state",
              "error",
            );
          },
        );

        expect(
          screen.getByRole(
            "alert",
          ),
        ).toHaveTextContent(
          /could not be cleared/i,
        );

        expect(
          screen.getByRole(
            "alert",
          ),
        ).toHaveTextContent(
          /reset failed/i,
        );
      },
    );
  },
);