import type {
  EntityId,
  LocalizedText,
} from "@/domain/shared/types";

export interface NumericProblemTolerance {
  readonly absolute:
    number;

  readonly relative:
    number;
}

export type BeamStaticsAnswerRole =
  | "left_reaction"
  | "right_reaction"
  | "left_shear"
  | "right_shear"
  | "maximum_moment"
  | "maximum_moment_position";

export interface NumericProblemFieldDefinition {
  readonly id:
    EntityId;

  readonly answerRole:
    BeamStaticsAnswerRole;

  readonly label:
    LocalizedText;

  readonly unitSymbol:
    string;

  readonly tolerance:
    NumericProblemTolerance;

  readonly hint:
    LocalizedText;
}

export interface BeamStaticsNumericProblemDefinition {
  readonly id:
    EntityId;

  readonly activityId:
    EntityId;

  readonly kind:
    "beam_statics_numeric_problem";

  readonly title:
    LocalizedText;

  readonly instructions:
    LocalizedText;

  readonly input: {
    readonly spanM:
      number;

    readonly pointLoadKN:
      number;

    readonly loadPositionM:
      number;
  };

  readonly fields:
    readonly NumericProblemFieldDefinition[];

  readonly ui: {
    readonly answersHeading:
      LocalizedText;

    readonly submitLabel:
      LocalizedText;

    readonly retryLabel:
      LocalizedText;

    readonly correctLabel:
      LocalizedText;

    readonly missingLabel:
      LocalizedText;

    readonly invalidLabel:
      LocalizedText;

    readonly successMessage:
      LocalizedText;

    readonly incorrectMessage:
      LocalizedText;
  };
}

export type NumericProblemDefinition =
  BeamStaticsNumericProblemDefinition;

export interface NumericProblemAnswerKeyItem {
  readonly fieldId:
    EntityId;

  readonly expectedValue:
    number;
}

export type NumericProblemAnswerKey =
  readonly NumericProblemAnswerKeyItem[];

export type NumericProblemSubmittedValues =
  Readonly<
    Record<
      string,
      number | null | undefined
    >
  >;