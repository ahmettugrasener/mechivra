import type {
  EngineeringResult,
  EngineeringValidityIssue,
  EngineeringWarning,
} from "@/domain/engineering/contracts";

import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

interface ValidEngineeringResultInput<TValues> {
  readonly modelId: EntityId;
  readonly modelVersion: VersionString;

  readonly values: TValues;

  readonly assumptions: readonly string[];

  readonly warnings?: readonly EngineeringWarning[];
}

interface InvalidEngineeringResultInput {
  readonly modelId: EntityId;
  readonly modelVersion: VersionString;

  readonly assumptions: readonly string[];

  readonly issues: readonly EngineeringValidityIssue[];

  readonly warnings?: readonly EngineeringWarning[];
}

export function createValidEngineeringResult<
  TValues,
>({
  modelId,
  modelVersion,
  values,
  assumptions,
  warnings = [],
}: ValidEngineeringResultInput<TValues>): EngineeringResult<TValues> {
  return {
    status:
      warnings.length > 0
        ? "valid_with_warning"
        : "valid",

    modelId,
    modelVersion,

    values,

    assumptions,

    warnings,

    validity: {
      withinDomain: true,
      issues: [],
    },
  };
}

export function createInvalidEngineeringResult<
  TValues = never,
>({
  modelId,
  modelVersion,
  assumptions,
  issues,
  warnings = [],
}: InvalidEngineeringResultInput): EngineeringResult<TValues> {
  if (issues.length === 0) {
    throw new Error(
      "Invalid engineering results require at least one validity issue.",
    );
  }

  return {
    status: "invalid",

    modelId,
    modelVersion,

    values: null,

    assumptions,

    warnings,

    validity: {
      withinDomain: false,
      issues,
    },
  };
}