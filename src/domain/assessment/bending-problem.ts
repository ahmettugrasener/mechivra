export type BendingProblemNumericFieldId =
  | "second_moment_area"
  | "maximum_moment"
  | "maximum_stress"
  | "maximum_deflection";

export type BendingProblemDecisionFieldId =
  | "stress_criterion"
  | "deflection_criterion";

export type BendingProblemCriterionAnswer =
  | "satisfied"
  | "not_satisfied";

export interface BendingProblemAnswerKey {
  readonly numeric:
    Readonly<
      Record<
        BendingProblemNumericFieldId,
        number
      >
    >;

  readonly decisions:
    Readonly<
      Record<
        BendingProblemDecisionFieldId,
        BendingProblemCriterionAnswer
      >
    >;
}

export interface BendingProblemSubmission {
  readonly numeric:
    Readonly<
      Partial<
        Record<
          BendingProblemNumericFieldId,
          number
        >
      >
    >;

  readonly decisions:
    Readonly<
      Partial<
        Record<
          BendingProblemDecisionFieldId,
          BendingProblemCriterionAnswer
        >
      >
    >;
}