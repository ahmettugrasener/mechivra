import type {
  ChoiceAssessmentOptionDefinition,
} from "@/domain/assessment/choice-evaluation";

export type EngineeringCriterionStatus =
  | "pass"
  | "fail"
  | "unknown"
  | "not_evaluated";

export const ENGINEERING_CRITERION_OPTION_IDS:
  readonly EngineeringCriterionStatus[] =
  [
    "pass",
    "fail",
    "unknown",
    "not_evaluated",
  ];

export function createEngineeringCriterionOptions():
  readonly ChoiceAssessmentOptionDefinition[] {
  return ENGINEERING_CRITERION_OPTION_IDS.map(
    (
      status,
    ) => ({
      id:
        status,
    }),
  );
}

export function isEngineeringCriterionStatus(
  value:
    string,
): value is EngineeringCriterionStatus {
  return ENGINEERING_CRITERION_OPTION_IDS.includes(
    value as EngineeringCriterionStatus,
  );
}