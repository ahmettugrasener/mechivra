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
  NumericProblemSubmittedValues,
} from "@/domain/assessment/numeric-problem";

import type {
  ActivityProgress,
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgress,
  ModuleProgressIdentity,
  ProgressRepository,
} from "@/domain/progress";

import {
  getNumericProblemDefinition,
} from "@/content/statics-problems";

import {
  BeamStaticsProblemActivity,
} from "@/features/learning/problems/beam-statics-problem-activity";

import {
  createBeamStaticsEngineeringProblemDefinition,
  createBeamStaticsEngineeringProblemResponse,
} from "@/features/learning/problems/beam-statics-problem-adapter";

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

function getDefinition() {
  const definition =
    getNumericProblemDefinition(
      "activity-ssb-05",
    );

  if (
    !definition ||
    definition.kind !==
      "beam_statics_numeric_problem"
  ) {
    throw new Error(
      "Expected Statics numeric problem definition.",
    );
  }

  return definition;
}

function createCorrectResponse(
  definition:
    ReturnType<
      typeof getDefinition
    >,
): NumericProblemSubmittedValues {
  return Object.fromEntries(
    definition.fields.map(
      (
        field,
      ) => {
        switch (
          field.answerRole
        ) {
          case "left_reaction":
            return [
              field.id,
              8,
            ];

          case "right_reaction":
            return [
              field.id,
              4,
            ];

          case "left_shear":
            return [
              field.id,
              8,
            ];

          case "right_shear":
            return [
              field.id,
              -4,
            ];

          case "maximum_moment":
            return [
              field.id,
              16,
            ];

          case "maximum_moment_position":
            return [
              field.id,
              2,
            ];
        }
      },
    ),
  );
}

function createPersistedHistory():
  AssessmentAttemptHistory<
    NumericProblemSubmittedValues
  > {
  const definition =
    getDefinition();

  const response =
    createCorrectResponse(
      definition,
    );

  const engineeringDefinition =
    createBeamStaticsEngineeringProblemDefinition(
      definition,
    );

  const result =
    evaluateEngineeringProblem(
      engineeringDefinition,

      createBeamStaticsEngineeringProblemResponse(
        definition,
        response,
      ),
    ).result;

  const draft =
    createAssessmentAttempt<
      NumericProblemSubmittedValues
    >({
      attemptId:
        "activity-ssb-05-assessment-attempt-1",

      activityId:
        "activity-ssb-05",

      activityVersion:
        "1.0.0",

      assessmentId:
        "activity-ssb-05-assessment",

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
  "Beam Statics problem persistence",
  () => {
    it(
      "rehydrates the submitted response and evaluation from persisted Assessment Core history",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.history =
          createPersistedHistory() as
            AssessmentAttemptHistory<unknown>;

        render(
          <BeamStaticsProblemActivity
            definition={
              getDefinition()
            }
            locale="tr"
            repository={
              repository
            }
          />,
        );

        const activity =
          screen.getByTestId(
            "beam-statics-problem-activity",
          );

        /*
         * Session hydration and the component-level
         * response/evaluation projection occur in
         * consecutive React effects.
         *
         * Wait for the complete restored UI state rather
         * than only the lower-level hydration flag.
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
                /Sol mesnet tepkisi RA/i,
            },
          ),
        ).toHaveValue(
          "8",
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                /Sağ mesnet tepkisi RB/i,
            },
          ),
        ).toHaveValue(
          "4",
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                /Yükün solundaki kesme kuvveti/i,
            },
          ),
        ).toHaveValue(
          "8",
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                /Yükün sağındaki kesme kuvveti/i,
            },
          ),
        ).toHaveValue(
          "-4",
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                /Maksimum eğilme momenti/i,
            },
          ),
        ).toHaveValue(
          "16",
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                /Maksimum momentin konumu/i,
            },
          ),
        ).toHaveValue(
          "2",
        );

        expect(
          screen.getByTestId(
            "assessment-feedback-panel",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "persists a newly submitted attempt through the repository",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const definition =
          getDefinition();

        render(
          <BeamStaticsProblemActivity
            definition={
              definition
            }
            locale="en"
            repository={
              repository
            }
          />,
        );

        const activity =
          screen.getByTestId(
            "beam-statics-problem-activity",
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

        const values:
          Readonly<
            Record<
              string,
              string
            >
          > = {
          "problem-ssb-ra":
            "8",

          "problem-ssb-rb":
            "4",

          "problem-ssb-v-left":
            "8",

          "problem-ssb-v-right":
            "-4",

          "problem-ssb-mmax":
            "16",

          "problem-ssb-x-mmax":
            "2",
        };

        for (
          const field
          of definition.fields
        ) {
          fireEvent.change(
            screen.getByRole(
              "textbox",
              {
                name:
                  field.label.en,
              },
            ),
            {
              target: {
                value:
                  values[
                    field.id
                  ] ??
                  "",
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
          createCorrectResponse(
            definition,
          ),
        );
      },
    );
  },
);