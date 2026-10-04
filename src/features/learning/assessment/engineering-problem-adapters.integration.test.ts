import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluateEngineeringProblem,
} from "@/domain/assessment";

import type {
  BeamStaticsNumericProblemDefinition,
} from "@/domain/assessment/numeric-problem";

import {
  getNumericProblemDefinition,
} from "@/content/statics-problems";

import {
  createBeamStaticsEngineeringProblemDefinition,
  createBeamStaticsEngineeringProblemResponse,
} from "@/features/learning/problems/beam-statics-problem-adapter";

import {
  createBendingEngineeringProblemDefinition,
  createBendingEngineeringProblemResponse,
  createBendingProblemAnswerKey,
} from "@/features/learning/bending/bending-problem-adapter";

import {
  createOttoEngineeringProblemDefinition,
  createOttoEngineeringProblemResponse,
  createOttoProblemDefinition,
} from "@/features/learning/otto/otto-problem-adapter";

function getStaticsProblemDefinition():
  BeamStaticsNumericProblemDefinition {
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

function getCorrectStaticsSubmittedValues(
  definition:
    BeamStaticsNumericProblemDefinition,
): Record<string, number> {
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

          default:
            return assertNever(
              field.answerRole,
            );
        }
      },
    ),
  );
}

describe(
  "MVP Engineering Problem adapters",
  () => {
    it(
      "evaluates all six Statics fields through the generic Engineering Problem evaluator",
      () => {
        const definition =
          getStaticsProblemDefinition();

        const engineeringDefinition =
          createBeamStaticsEngineeringProblemDefinition(
            definition,
          );

        const response =
          createBeamStaticsEngineeringProblemResponse(
            definition,
            getCorrectStaticsSubmittedValues(
              definition,
            ),
          );

        const evaluation =
          evaluateEngineeringProblem(
            engineeringDefinition,
            response,
          );

        expect(
          evaluation.result
            .items,
        ).toHaveLength(
          6,
        );

        expect(
          evaluation.result
            .correct,
        ).toBe(
          true,
        );

        expect(
          evaluation.result
            .score,
        ).toBe(
          6,
        );

        expect(
          evaluation.result
            .maxScore,
        ).toBe(
          6,
        );
      },
    );

    it(
      "preserves invalid Statics input semantics in the generic evaluator",
      () => {
        const definition =
          getStaticsProblemDefinition();

        const engineeringDefinition =
          createBeamStaticsEngineeringProblemDefinition(
            definition,
          );

        const submittedValues =
          getCorrectStaticsSubmittedValues(
            definition,
          );

        const leftReactionField =
          definition.fields.find(
            (
              field,
            ) =>
              field.answerRole ===
              "left_reaction",
          );

        if (
          !leftReactionField
        ) {
          throw new Error(
            "Expected Statics left-reaction field.",
          );
        }

        submittedValues[
          leftReactionField.id
        ] =
          Number.NaN;

        const response =
          createBeamStaticsEngineeringProblemResponse(
            definition,
            submittedValues,
          );

        const evaluation =
          evaluateEngineeringProblem(
            engineeringDefinition,
            response,
          );

        expect(
          evaluation.result
            .correct,
        ).toBe(
          false,
        );

        expect(
          evaluation.result
            .status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.result
            .items,
        ).toHaveLength(
          6,
        );

        expect(
          evaluation.result
            .items.find(
              (
                item,
              ) =>
                item.id ===
                leftReactionField.id,
            )
            ?.status,
        ).toBe(
          "invalid",
        );

        expect(
          evaluation.result
            .score,
        ).toBe(
          5,
        );
      },
    );

    it(
      "evaluates four Bending numeric fields and two independent criteria through one generic result",
      () => {
        const answerKey =
          createBendingProblemAnswerKey();

        const engineeringDefinition =
          createBendingEngineeringProblemDefinition();

        const response =
          createBendingEngineeringProblemResponse(
            {
              numeric: {
                second_moment_area:
                  answerKey.numeric
                    .second_moment_area,

                maximum_moment:
                  answerKey.numeric
                    .maximum_moment,

                maximum_stress:
                  answerKey.numeric
                    .maximum_stress,

                maximum_deflection:
                  answerKey.numeric
                    .maximum_deflection,
              },

              decisions: {
                stress_criterion:
                  answerKey.decisions
                    .stress_criterion,

                deflection_criterion:
                  answerKey.decisions
                    .deflection_criterion,
              },
            },
          );

        const evaluation =
          evaluateEngineeringProblem(
            engineeringDefinition,
            response,
          );

        expect(
          evaluation.numeric
            ?.items,
        ).toHaveLength(
          4,
        );

        expect(
          evaluation.choices,
        ).toHaveLength(
          2,
        );

        expect(
          evaluation.result
            .items,
        ).toHaveLength(
          6,
        );

        expect(
          evaluation.result
            .score,
        ).toBe(
          6,
        );

        expect(
          evaluation.result
            .maxScore,
        ).toBe(
          6,
        );

        expect(
          evaluation.result
            .correct,
        ).toBe(
          true,
        );
      },
    );

    it(
      "keeps Bending criteria independent from the four numerical answers",
      () => {
        const answerKey =
          createBendingProblemAnswerKey();

        const engineeringDefinition =
          createBendingEngineeringProblemDefinition();

        const wrongStressDecision =
          answerKey.decisions
            .stress_criterion ===
          "satisfied"
            ? "not_satisfied"
            : "satisfied";

        const response =
          createBendingEngineeringProblemResponse(
            {
              numeric: {
                second_moment_area:
                  answerKey.numeric
                    .second_moment_area,

                maximum_moment:
                  answerKey.numeric
                    .maximum_moment,

                maximum_stress:
                  answerKey.numeric
                    .maximum_stress,

                maximum_deflection:
                  answerKey.numeric
                    .maximum_deflection,
              },

              decisions: {
                stress_criterion:
                  wrongStressDecision,

                deflection_criterion:
                  answerKey.decisions
                    .deflection_criterion,
              },
            },
          );

        const evaluation =
          evaluateEngineeringProblem(
            engineeringDefinition,
            response,
          );

        expect(
          evaluation.numeric
            ?.result
            .correct,
        ).toBe(
          true,
        );

        expect(
          evaluation.choices[0]
            ?.evaluation
            .result
            .correct,
        ).toBe(
          false,
        );

        expect(
          evaluation.choices[1]
            ?.evaluation
            .result
            .correct,
        ).toBe(
          true,
        );

        expect(
          evaluation.result
            .correct,
        ).toBe(
          false,
        );

        expect(
          evaluation.result
            .score,
        ).toBe(
          5,
        );
      },
    );

    it(
      "evaluates all ten Otto fields through the generic Engineering Problem evaluator",
      () => {
        const problem =
          createOttoProblemDefinition();

        const engineeringDefinition =
          createOttoEngineeringProblemDefinition();

        const response =
          createOttoEngineeringProblemResponse(
            problem.expected,
          );

        const evaluation =
          evaluateEngineeringProblem(
            engineeringDefinition,
            response,
          );

        expect(
          evaluation.numeric
            ?.items,
        ).toHaveLength(
          10,
        );

        expect(
          evaluation.result
            .items,
        ).toHaveLength(
          10,
        );

        expect(
          evaluation.result
            .score,
        ).toBe(
          10,
        );

        expect(
          evaluation.result
            .maxScore,
        ).toBe(
          10,
        );

        expect(
          evaluation.result
            .correct,
        ).toBe(
          true,
        );
      },
    );

    it(
      "marks one wrong Otto field incorrect without collapsing the remaining field results",
      () => {
        const problem =
          createOttoProblemDefinition();

        const engineeringDefinition =
          createOttoEngineeringProblemDefinition();

        const response =
          createOttoEngineeringProblemResponse(
            {
              ...problem.expected,

              thermalEfficiencyPercent:
                problem.expected
                  .thermalEfficiencyPercent +
                10,
            },
          );

        const evaluation =
          evaluateEngineeringProblem(
            engineeringDefinition,
            response,
          );

        expect(
          evaluation.result
            .correct,
        ).toBe(
          false,
        );

        expect(
          evaluation.result
            .score,
        ).toBe(
          9,
        );

        expect(
          evaluation.result
            .maxScore,
        ).toBe(
          10,
        );

        expect(
          evaluation.result
            .items.find(
              (
                item,
              ) =>
                item.id ===
                "thermalEfficiencyPercent",
            )
            ?.status,
        ).toBe(
          "incorrect",
        );
      },
    );
  },
);

function assertNever(
  value:
    never,
): never {
  throw new Error(
    `Unexpected Statics answer role: ${String(
      value,
    )}`,
  );
}