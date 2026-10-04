import type {
  BeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

export type EngineeringCriterionStatus =
  | "satisfied"
  | "not_satisfied"
  | "undetermined";

export interface UpperBoundCriterionAssessment {
  readonly status:
    EngineeringCriterionStatus;

  readonly actualValue:
    number;

  readonly limitValue:
    number | null;

  readonly utilization:
    number | null;
}

export interface BeamBendingCriteriaEvaluation {
  readonly bendingStress:
    UpperBoundCriterionAssessment;

  readonly deflection:
    UpperBoundCriterionAssessment;
}

export class EngineeringCriterionEvaluationError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "EngineeringCriterionEvaluationError";
  }
}

function assertFiniteNonNegative(
  value: number,
  name: string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value < 0
  ) {
    throw new EngineeringCriterionEvaluationError(
      `${name} must be finite and greater than or equal to zero.`,
    );
  }
}

export function evaluateUpperBoundCriterion(
  actualValue:
    number,

  limitValue:
    number | null,
): UpperBoundCriterionAssessment {
  assertFiniteNonNegative(
    actualValue,
    "Actual criterion value",
  );

  if (
    limitValue ===
    null
  ) {
    return {
      status:
        "undetermined",

      actualValue,

      limitValue:
        null,

      utilization:
        null,
    };
  }

  if (
    !Number.isFinite(
      limitValue,
    ) ||
    limitValue <= 0
  ) {
    throw new EngineeringCriterionEvaluationError(
      "Criterion limit must be null or a finite value greater than zero.",
    );
  }

  const utilization =
    actualValue /
    limitValue;

  return {
    status:
      actualValue <=
      limitValue
        ? "satisfied"
        : "not_satisfied",

    actualValue,

    limitValue,

    utilization,
  };
}

export function evaluateBeamBendingCriteria(
  maximumAbsoluteStressPa:
    number,

  maximumAbsoluteDeflectionM:
    number,

  configuration:
    BeamBendingConfiguration,
): BeamBendingCriteriaEvaluation {
  return {
    bendingStress:
      evaluateUpperBoundCriterion(
        maximumAbsoluteStressPa,

        configuration.material
          .allowableBendingStressPa,
      ),

    deflection:
      evaluateUpperBoundCriterion(
        maximumAbsoluteDeflectionM,

        configuration.criteria
          .allowableDeflectionM,
      ),
  };
}