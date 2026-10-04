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
} from "vitest";

import {
  createAssessmentAttempt,
  createAssessmentAttemptHistory,
  evaluateAssessmentAttempt,
  evaluateEngineeringProblem,
  replaceLatestAssessmentAttempt,
  submitAssessmentAttempt,
} from "@/domain/assessment";

import type {
  AssessmentAttemptHistory,
} from "@/domain/assessment";

import type {
  BendingProblemSubmission,
} from "@/domain/assessment/bending-problem";

import type {
  ActivityProgress,
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgress,
  ModuleProgressIdentity,
  ProgressRepository,
} from "@/domain/progress";

import {
  BendingProblemActivity,
} from "@/features/learning/bending/bending-problem-activity";

import {
  createBendingEngineeringProblemDefinition,
  createBendingEngineeringProblemResponse,
} from "@/features/learning/bending/bending-problem-adapter";

afterEach(
  () => {
    cleanup();
  },
);

class MemoryProgressRepository
  implements ProgressRepository {
  history:
    AssessmentAttemptHistory<unknown> | null =
    null;

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

function createCorrectSubmission():
  BendingProblemSubmission {
  return {
    numeric: {
      second_moment_area:
        2730.667,

      maximum_moment:
        6,

      maximum_stress:
        17.578,

      maximum_deflection:
        2.354,
    },

    decisions: {
      stress_criterion:
        "satisfied",

      deflection_criterion:
        "not_satisfied",
    },
  };
}

function createPersistedHistory():
  AssessmentAttemptHistory<
    BendingProblemSubmission
  > {
  const response =
    createCorrectSubmission();

  const engineeringDefinition =
    createBendingEngineeringProblemDefinition();

  const result =
    evaluateEngineeringProblem(
      engineeringDefinition,

      createBendingEngineeringProblemResponse(
        response,
      ),
    ).result;

  const draft =
    createAssessmentAttempt<
      BendingProblemSubmission
    >({
      attemptId:
        "activity-bending-05-assessment-attempt-1",

      activityId:
        "activity-bending-05",

      activityVersion:
        "1.0.0",

      assessmentId:
        "activity-bending-05-assessment",

      assessmentVersion:
        "1.0.0",

      attemptNumber:
        1,
    });

  const initialHistory =
    createAssessmentAttemptHistory(
      draft,
    );

  const submitted =
    submitAssessmentAttempt(
      draft,
      response,
    );

  const submittedHistory =
    replaceLatestAssessmentAttempt(
      initialHistory,
      submitted,
    );

  const evaluated =
    evaluateAssessmentAttempt(
      submitted,
      result,
    );

  return replaceLatestAssessmentAttempt(
    submittedHistory,
    evaluated,
  );
}

describe(
  "Bending problem persistence",
  () => {
    it(
      "rehydrates four numeric values, two criteria, and the evaluated result",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.history =
          createPersistedHistory() as
            AssessmentAttemptHistory<unknown>;

        render(
          <BendingProblemActivity
            locale="tr"
            repository={
              repository
            }
          />,
        );

        const activity =
          screen.getByTestId(
            "bending-problem-activity",
          );

        /*
         * Session hydration and the component-level UI
         * projection happen in consecutive React effects.
         *
         * Therefore wait for the complete restored UI state,
         * not only for the lower-level session hydration flag.
         */
        await waitFor(
          () => {
            expect(
              activity,
            ).toHaveAttribute(
              "data-assessment-hydrated",
              "true",
            );

            expect(
              activity,
            ).toHaveAttribute(
              "data-attempt-submitted",
              "true",
            );

            expect(
              activity,
            ).toHaveAttribute(
              "data-attempt-correct",
              "true",
            );

            expect(
              activity,
            ).toHaveAttribute(
              "data-attempt-count",
              "1",
            );
          },
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                "Alan atalet momenti I",
            },
          ),
        ).toHaveValue(
          "2730,667",
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                "Maksimum eğilme momenti",
            },
          ),
        ).toHaveValue(
          "6",
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                "Maksimum eğilme gerilmesi",
            },
          ),
        ).toHaveValue(
          "17,578",
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                "Maksimum sehim",
            },
          ),
        ).toHaveValue(
          "2,354",
        );

        const satisfied =
          screen.getAllByRole(
            "radio",
            {
              name:
                "Sağlandı",
            },
          );

        const notSatisfied =
          screen.getAllByRole(
            "radio",
            {
              name:
                "Sağlanmadı",
            },
          );

        expect(
          satisfied[0],
        ).toBeChecked();

        expect(
          notSatisfied[1],
        ).toBeChecked();

        expect(
          screen.getByTestId(
            "assessment-feedback-panel",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "persists a complete new Bending attempt",
      async () => {
        const repository =
          new MemoryProgressRepository();

        render(
          <BendingProblemActivity
            locale="en"
            repository={
              repository
            }
          />,
        );

        const activity =
          screen.getByTestId(
            "bending-problem-activity",
          );

        await waitFor(
          () => {
            expect(
              activity,
            ).toHaveAttribute(
              "data-assessment-hydrated",
              "true",
            );
          },
        );

        const submission =
          createCorrectSubmission();

        fireEvent.change(
          screen.getByRole(
            "textbox",
            {
              name:
                "Second moment of area I",
            },
          ),
          {
            target: {
              value:
                String(
                  submission.numeric
                    .second_moment_area,
                ),
            },
          },
        );

        fireEvent.change(
          screen.getByRole(
            "textbox",
            {
              name:
                "Maximum bending moment",
            },
          ),
          {
            target: {
              value:
                String(
                  submission.numeric
                    .maximum_moment,
                ),
            },
          },
        );

        fireEvent.change(
          screen.getByRole(
            "textbox",
            {
              name:
                "Maximum bending stress",
            },
          ),
          {
            target: {
              value:
                String(
                  submission.numeric
                    .maximum_stress,
                ),
            },
          },
        );

        fireEvent.change(
          screen.getByRole(
            "textbox",
            {
              name:
                "Maximum deflection",
            },
          ),
          {
            target: {
              value:
                String(
                  submission.numeric
                    .maximum_deflection,
                ),
            },
          },
        );

        const satisfied =
          screen.getAllByRole(
            "radio",
            {
              name:
                "Satisfied",
            },
          );

        const notSatisfied =
          screen.getAllByRole(
            "radio",
            {
              name:
                "Not satisfied",
            },
          );

        fireEvent.click(
          satisfied[0]!,
        );

        fireEvent.click(
          notSatisfied[1]!,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Check answers",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              repository
                .history
                ?.attempts[0]
                ?.status,
            ).toBe(
              "evaluated",
            );
          },
        );

        expect(
          repository.history
            ?.attempts[0]
            ?.result
            ?.correct,
        ).toBe(
          true,
        );

        expect(
          repository.history
            ?.attempts[0]
            ?.response,
        ).toEqual(
          submission,
        );
      },
    );
  },
);