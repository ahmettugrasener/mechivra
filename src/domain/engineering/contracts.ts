import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

export type EngineeringExecutionStatus =
  | "valid"
  | "valid_with_warning"
  | "invalid";

export type EngineeringWarningSeverity =
  | "info"
  | "warning"
  | "error";

export interface EngineeringWarning {
  readonly code: string;
  readonly severity: EngineeringWarningSeverity;
  readonly messageKey: string;
}

export interface EngineeringValidity {
  readonly withinDomain: boolean;
  readonly reasons: readonly string[];
}

export interface EngineeringResult<TValues> {
  readonly status: EngineeringExecutionStatus;

  readonly modelId: EntityId;
  readonly modelVersion: VersionString;

  readonly values: TValues;

  readonly assumptions: readonly string[];
  readonly warnings: readonly EngineeringWarning[];
  readonly validity: EngineeringValidity;
}

export interface EngineeringModel<TInput, TOutput> {
  readonly id: EntityId;
  readonly version: VersionString;

  evaluate(input: TInput): EngineeringResult<TOutput>;
}