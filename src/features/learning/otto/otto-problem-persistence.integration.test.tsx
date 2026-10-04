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
  OttoProblemAnswer,
} from "@/domain/assessment/otto-problem";

import type {
  ActivityProgress,
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgress,
  ModuleProgressIdentity,
  ProgressRepository,
} from "@/domain/progress";

import {
  OttoProblemActivity,
} from "@/features/learning/otto/otto-problem-activity";

import {
  createOttoEngineeringProblemDefinition,
  createOttoEngineeringProblemResponse,
} from "@/features/learning/otto/otto-problem-adapter";

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

function createCorrectResponse():
  OttoProblemAnswer {
  return {
    state2TemperatureK:
      655.255,

    state2PressureKPa:
      1474.324,

    state2SpecificVolumeM3PerKg:
      0.127556,

    state3TemperatureK:
      1491.492,

    state3PressureKPa:
      3355.857,

    state4TemperatureK:
      728.384,

    state4PressureKPa:
      273.144,

    heatRejectedKJPerKg:
      293.016,

    netWorkKJPerKg:
      306.984,

    thermalEfficiencyPercent:
      51.164,
  };
}

function createPersistedHistory():
  AssessmentAttemptHistory<
    OttoProblemAnswer
  > {
  const response =
    createCorrectResponse();

  const engineeringDefinition =
    createOttoEngineeringProblemDefinition();

  const result =
    evaluateEngineeringProblem(
      engineeringDefinition,

      createOttoEngineeringProblemResponse(
        response,
      ),
    ).result;

  const draft =
    createAssessmentAttempt<
      OttoProblemAnswer
    >({
      attemptId:
        "activity-otto-05-assessment-attempt-1",

      activityId:
        "activity-otto-05",

      activityVersion:
        "1.0.0",

      assessmentId:
        "activity-otto-05-assessment",

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

const ENGLISH_FIELDS = [
  [
    "State-2 temperature T₂",
    "655.255",
  ],

  [
    "State-2 pressure p₂",
    "1474.324",
  ],

  [
    "State-2 specific volume v₂",
    "0.127556",
  ],

  [
    "State-3 temperature T₃",
    "1491.492",
  ],

  [
    "State-3 pressure p₃",
    "3355.857",
  ],

  [
    "State-4 temperature T₄",
    "728.384",
  ],

  [
    "State-4 pressure p₄",
    "273.144",
  ],

  [
    "Specific heat rejected qout",
    "293.016",
  ],

  [
    "Net specific work wnet",
    "306.984",
  ],

  [
    "Ideal thermal efficiency η",
    "51.164",
  ],
] as const;

describe(
  "Otto problem persistence",
  () => {
    it(
      "rehydrates all ten answers and the evaluated result",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.history =
          createPersistedHistory() as
            AssessmentAttemptHistory<unknown>;

        render(
          <OttoProblemActivity
            locale="en"
            repository={
              repository
            }
          />,
        );

        const activity =
          screen.getByTestId(
            "otto-problem-activity",
          );

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

        for (
          const [
            label,
            value,
          ]
          of ENGLISH_FIELDS
        ) {
          expect(
            screen.getByRole(
              "textbox",
              {
                name:
                  label,
              },
            ),
          ).toHaveValue(
            value,
          );
        }

        expect(
          screen.getByTestId(
            "assessment-feedback-panel",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "persists a complete ten-field Otto attempt",
      async () => {
        const repository =
          new MemoryProgressRepository();

        render(
          <OttoProblemActivity
            locale="en"
            repository={
              repository
            }
          />,
        );

        const activity =
          screen.getByTestId(
            "otto-problem-activity",
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

        for (
          const [
            label,
            value,
          ]
          of ENGLISH_FIELDS
        ) {
          fireEvent.change(
            screen.getByRole(
              "textbox",
              {
                name:
                  label,
              },
            ),
            {
              target: {
                value,
              },
            },
          );
        }

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
          createCorrectResponse(),
        );
      },
    );

    it(
      "restores persisted numeric values using Turkish decimal commas",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.history =
          createPersistedHistory() as
            AssessmentAttemptHistory<unknown>;

        render(
          <OttoProblemActivity
            locale="tr"
            repository={
              repository
            }
          />,
        );

        const activity =
          screen.getByTestId(
            "otto-problem-activity",
          );

        await waitFor(
          () => {
            expect(
              activity,
            ).toHaveAttribute(
              "data-attempt-submitted",
              "true",
            );
          },
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                "İdeal ısıl verim η",
            },
          ),
        ).toHaveValue(
          "51,164",
        );

        expect(
          screen.getByText(
            /γ = 1,4/,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);