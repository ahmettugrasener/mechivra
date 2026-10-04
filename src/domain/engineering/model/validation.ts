import type {
  EngineeringValidityIssue,
} from "@/domain/engineering/contracts";

export function validateFiniteNumber(
  field: string,
  value: number,
): EngineeringValidityIssue | null {
  if (Number.isFinite(value)) {
    return null;
  }

  return {
    code: "not_finite",
    field,
    messageKey:
      "engineering.validation.notFinite",
  };
}

export function validateGreaterThan(
  field: string,
  value: number,
  minimum: number,
): EngineeringValidityIssue | null {
  const finiteIssue =
    validateFiniteNumber(
      field,
      value,
    );

  if (finiteIssue) {
    return finiteIssue;
  }

  if (value > minimum) {
    return null;
  }

  return {
    code: "must_be_greater_than",
    field,
    messageKey:
      "engineering.validation.mustBeGreaterThan",

    parameters: {
      minimum,
    },
  };
}

export function validateGreaterThanOrEqual(
  field: string,
  value: number,
  minimum: number,
): EngineeringValidityIssue | null {
  const finiteIssue =
    validateFiniteNumber(
      field,
      value,
    );

  if (finiteIssue) {
    return finiteIssue;
  }

  if (value >= minimum) {
    return null;
  }

  return {
    code:
      "must_be_greater_than_or_equal",
    field,
    messageKey:
      "engineering.validation.mustBeGreaterThanOrEqual",

    parameters: {
      minimum,
    },
  };
}

export function validateExclusiveRange(
  field: string,
  value: number,
  minimum: number,
  maximum: number,
): EngineeringValidityIssue | null {
  const finiteIssue =
    validateFiniteNumber(
      field,
      value,
    );

  if (finiteIssue) {
    return finiteIssue;
  }

  if (
    value > minimum &&
    value < maximum
  ) {
    return null;
  }

  return {
    code:
      "outside_exclusive_range",
    field,
    messageKey:
      "engineering.validation.outsideExclusiveRange",

    parameters: {
      minimum,
      maximum,
    },
  };
}

export function collectValidityIssues(
  issues: readonly (
    | EngineeringValidityIssue
    | null
  )[],
): readonly EngineeringValidityIssue[] {
  return issues.filter(
    (
      issue,
    ): issue is EngineeringValidityIssue =>
      issue !== null,
  );
}