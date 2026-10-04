import type {
  EngineeringProblemDefinition,
  EngineeringProblemResponse,
} from "@/domain/assessment";

import type {
  BendingProblemAnswerKey,
  BendingProblemSubmission,
} from "@/domain/assessment/bending-problem";

import {
  createSimplySupportedBeamStateFromDisplayInput,
  fromSI,
} from "@/domain/engineering";

import {
  createBeamBendingConfiguration,
  evaluateBeamBending,
} from "@/domain/engineering/beam/bending";

const BENDING_NUMERIC_ASSESSMENT_FIELDS =
  [
    {
      id:
        "second_moment_area" as const,

      quantityId:
        "second_moment_area",

      expectedUnitId:
        "cm4",

      tolerance: {
        absolute:
          0.5,

        relative:
          0.001,
      },
    },

    {
      id:
        "maximum_moment" as const,

      quantityId:
        "moment",

      expectedUnitId:
        "kN_m",

      tolerance: {
        absolute:
          0.01,

        relative:
          0.001,
      },
    },

    {
      id:
        "maximum_stress" as const,

      quantityId:
        "stress",

      expectedUnitId:
        "MPa",

      tolerance: {
        absolute:
          0.02,

        relative:
          0.001,
      },
    },

    {
      id:
        "maximum_deflection" as const,

      quantityId:
        "length",

      expectedUnitId:
        "mm",

      tolerance: {
        absolute:
          0.005,

        relative:
          0.001,
      },
    },
  ] as const;

const BENDING_CRITERION_OPTIONS =
  [
    {
      id:
        "satisfied",
    },

    {
      id:
        "not_satisfied",
    },
  ] as const;

export function createBendingProblemAnswerKey():
  BendingProblemAnswerKey {
  const beamStateResult =
    createSimplySupportedBeamStateFromDisplayInput(
      {
        span: {
          value:
            3,

          unit:
            "m",
        },

        pointLoad: {
          value:
            8,

          unit:
            "kN",
        },

        loadPosition: {
          value:
            1.5,

          unit:
            "m",
        },
      },
    );

  if (
    !beamStateResult.state
  ) {
    throw new Error(
      "Bending problem beam state is invalid.",
    );
  }

  const configurationResult =
    createBeamBendingConfiguration(
      {
        sectionWidthM:
          0.08,

        sectionHeightM:
          0.16,

        elasticModulusPa:
          70e9,

        allowableBendingStressPa:
          20e6,

        allowableDeflectionM:
          0.002,
      },
    );

  if (
    !configurationResult.configuration
  ) {
    throw new Error(
      "Bending problem configuration is invalid.",
    );
  }

  const result =
    evaluateBeamBending(
      beamStateResult.state,
      configurationResult.configuration,
    );

  if (
    !result.values
  ) {
    throw new Error(
      "Bending problem Engineering Core result is invalid.",
    );
  }

  const stressStatus =
    result.values
      .criteria
      .bendingStress
      .status;

  const deflectionStatus =
    result.values
      .criteria
      .deflection
      .status;

  if (
    stressStatus ===
      "undetermined" ||
    deflectionStatus ===
      "undetermined"
  ) {
    throw new Error(
      "Bending problem requires determinate engineering criteria.",
    );
  }

  return {
    numeric: {
      second_moment_area:
        fromSI(
          "second_moment_area",
          result.values
            .section
            .secondMomentAreaM4,
          "cm4",
        ),

      maximum_moment:
        fromSI(
          "moment",
          result.values
            .maximumMomentNm,
          "kN_m",
        ),

      maximum_stress:
        fromSI(
          "stress",
          result.values
            .stress
            .maximumAbsoluteStressPa,
          "MPa",
        ),

      maximum_deflection:
        fromSI(
          "length",
          result.values
            .deflection
            .maximumAbsoluteDeflectionM,
          "mm",
        ),
    },

    decisions: {
      stress_criterion:
        stressStatus,

      deflection_criterion:
        deflectionStatus,
    },
  };
}

export function createBendingEngineeringProblemDefinition():
  EngineeringProblemDefinition {
  const answerKey =
    createBendingProblemAnswerKey();

  return {
    id:
      "bending-problem",

    version:
      "1.0.0",

    numericItems:
      BENDING_NUMERIC_ASSESSMENT_FIELDS.map(
        (
          field,
        ) => ({
          id:
            field.id,

          expectedValue:
            answerKey.numeric[
              field.id
            ],

          quantityId:
            field.quantityId,

          expectedUnitId:
            field.expectedUnitId,

          tolerance: {
            absolute:
              field.tolerance
                .absolute,

            relative:
              field.tolerance
                .relative,
          },

          maxScore:
            1,
        }),
      ),

    choiceItems: [
      {
        role:
          "criterion",

        definition: {
          id:
            "stress_criterion",

          kind:
            "choice",

          options:
            BENDING_CRITERION_OPTIONS,

          correctOptionId:
            answerKey.decisions
              .stress_criterion,

          maxScore:
            1,
        },
      },

      {
        role:
          "criterion",

        definition: {
          id:
            "deflection_criterion",

          kind:
            "choice",

          options:
            BENDING_CRITERION_OPTIONS,

          correctOptionId:
            answerKey.decisions
              .deflection_criterion,

          maxScore:
            1,
        },
      },
    ],
  };
}

export function createBendingEngineeringProblemResponse(
  submission:
    BendingProblemSubmission,
): EngineeringProblemResponse {
  return {
    numeric:
      BENDING_NUMERIC_ASSESSMENT_FIELDS.flatMap(
        (
          field,
        ) => {
          const value =
            submission.numeric[
              field.id
            ];

          if (
            value ===
            undefined
          ) {
            return [];
          }

          return [
            {
              itemId:
                field.id,

              value,
            },
          ];
        },
      ),

    choices: [
      {
        itemId:
          "stress_criterion",

        selectedOptionId:
          submission.decisions
            .stress_criterion ??
          null,
      },

      {
        itemId:
          "deflection_criterion",

        selectedOptionId:
          submission.decisions
            .deflection_criterion ??
          null,
      },
    ],
  };
}