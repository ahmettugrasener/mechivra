import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

export type EngineeringExecutionStatus =
  | "valid"
  | "valid_with_warning"
  | "invalid";

export type EngineeringIssueParameter =
  | string
  | number
  | boolean;

export interface EngineeringWarning {
  readonly code: string;

  /**
   * Optional canonical input/output field related to the warning.
   */
  readonly field?: string;

  /**
   * Translation key.
   * Engineering Core does not own user-facing TR/EN text.
   */
  readonly messageKey: string;

  readonly parameters?: Readonly<
    Record<
      string,
      EngineeringIssueParameter
    >
  >;
}

export interface EngineeringValidityIssue {
  readonly code: string;

  /**
   * Optional canonical input field related to the issue.
   */
  readonly field?: string;

  /**
   * Translation key.
   * The domain layer must not contain localized UI text.
   */
  readonly messageKey: string;

  readonly parameters?: Readonly<
    Record<
      string,
      EngineeringIssueParameter
    >
  >;
}

export interface EngineeringValidity {
  readonly withinDomain: boolean;

  readonly issues: readonly EngineeringValidityIssue[];
}

export interface EngineeringResult<TValues> {
  readonly status: EngineeringExecutionStatus;

  readonly modelId: EntityId;
  readonly modelVersion: VersionString;

  /**
   * Invalid engineering states never expose calculated values.
   */
  readonly values: TValues | null;

  /**
   * Stable assumption identifiers.
   * They are not user-facing localized sentences.
   */
  readonly assumptions: readonly string[];

  readonly warnings: readonly EngineeringWarning[];

  readonly validity: EngineeringValidity;
}

export interface EngineeringModel<
  TInput,
  TOutput
> {
  readonly id: EntityId;
  readonly version: VersionString;

  evaluate(
    input: TInput,
  ): EngineeringResult<TOutput>;
}