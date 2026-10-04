import type {
  EngineeringProblemDefinition,
  EngineeringProblemResponse,
} from "@/domain/assessment";

import {
  beamStaticsModel,
  createSimplySupportedBeamStateFromDisplayInput,
  fromSI,
} from "@/domain/engineering";

import type {
  BeamStaticsAnswerRole,
  BeamStaticsNumericProblemDefinition,
  NumericProblemAnswerKey,
  NumericProblemSubmittedValues,
} from "@/domain/assessment/numeric-problem";

function getBeamStaticsQuantityId(
  answerRole:
    BeamStaticsAnswerRole,
): string {
  switch (
    answerRole
  ) {
    case "left_reaction":
    case "right_reaction":
    case "left_shear":
    case "right_shear":
      return "force";

    case "maximum_moment":
      return "moment";

    case "maximum_moment_position":
      return "length";

    default:
      return assertNever(
        answerRole,
      );
  }
}

export function createBeamStaticsProblemAnswerKey(
  definition:
    BeamStaticsNumericProblemDefinition,
): NumericProblemAnswerKey {
  const stateResult =
    createSimplySupportedBeamStateFromDisplayInput(
      {
        span: {
          value:
            definition.input
              .spanM,

          unit: "m",
        },

        pointLoad: {
          value:
            definition.input
              .pointLoadKN,

          unit: "kN",
        },

        loadPosition: {
          value:
            definition.input
              .loadPositionM,

          unit: "m",
        },
      },
    );

  if (!stateResult.state) {
    throw new Error(
      `Problem "${definition.id}" contains an invalid beam state.`,
    );
  }

  const result =
    beamStaticsModel.evaluate(
      stateResult.state,
    );

  if (!result.values) {
    throw new Error(
      `Problem "${definition.id}" did not produce valid Engineering Core values.`,
    );
  }

  const values =
    result.values;

  const maximumMomentLocation =
    values.moment.maximum
      .location;

  if (
    maximumMomentLocation.type !==
    "point"
  ) {
    throw new Error(
      `Problem "${definition.id}" requires a unique maximum-moment location.`,
    );
  }

  return definition.fields.map(
    (field) => {
      switch (
        field.answerRole
      ) {
        case "left_reaction":
          return {
            fieldId:
              field.id,

            expectedValue:
              fromSI(
                "force",
                values.leftReactionN,
                "kN",
              ),
          };

        case "right_reaction":
          return {
            fieldId:
              field.id,

            expectedValue:
              fromSI(
                "force",
                values.rightReactionN,
                "kN",
              ),
          };

        case "left_shear":
          return {
            fieldId:
              field.id,

            expectedValue:
              fromSI(
                "force",
                values.shear
                  .leftOfLoadN,
                "kN",
              ),
          };

        case "right_shear":
          return {
            fieldId:
              field.id,

            expectedValue:
              fromSI(
                "force",
                values.shear
                  .rightOfLoadN,
                "kN",
              ),
          };

        case "maximum_moment":
          return {
            fieldId:
              field.id,

            expectedValue:
              fromSI(
                "moment",
                values.moment
                  .maximum
                  .valueNm,
                "kN_m",
              ),
          };

        case "maximum_moment_position":
          return {
            fieldId:
              field.id,

            expectedValue:
              maximumMomentLocation
                .xM,
          };

        default:
          return assertNever(
            field.answerRole,
          );
      }
    },
  );
}

export function createBeamStaticsEngineeringProblemDefinition(
  definition:
    BeamStaticsNumericProblemDefinition,
): EngineeringProblemDefinition {
  const answerKey =
    createBeamStaticsProblemAnswerKey(
      definition,
    );

  const expectedByFieldId =
    new Map(
      answerKey.map(
        (item) => [
          item.fieldId,
          item.expectedValue,
        ],
      ),
    );

  return {
    id:
      definition.id,

    version:
      "1.0.0",

    numericItems:
      definition.fields.map(
        (field) => {
          const expectedValue =
            expectedByFieldId.get(
              field.id,
            );

          if (
            expectedValue ===
            undefined
          ) {
            throw new Error(
              `Missing Engineering Problem expected value for Statics field "${field.id}".`,
            );
          }

          return {
            id:
              field.id,

            expectedValue,

            quantityId:
              getBeamStaticsQuantityId(
                field.answerRole,
              ),

            expectedUnitId:
              field.unitSymbol,

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
          };
        },
      ),

    choiceItems:
      [],
  };
}

export function createBeamStaticsEngineeringProblemResponse(
  definition:
    BeamStaticsNumericProblemDefinition,

  submittedValues:
    NumericProblemSubmittedValues,
): EngineeringProblemResponse {
  return {
    numeric:
      definition.fields.flatMap(
        (field) => {
          const value =
            submittedValues[
              field.id
            ];

          if (
            value ===
              null ||
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

    choices:
      [],
  };
}

function assertNever(
  value: never,
): never {
  throw new Error(
    `Unsupported beam Statics answer role: ${String(
      value,
    )}`,
  );
}