import {
  ChoiceAssessmentError,
  evaluateChoiceAssessment,
} from "@/domain/assessment/choice-evaluation";

import type {
  ChoiceAssessmentDefinition,
  ChoiceAssessmentEvaluation,
  ChoiceAssessmentResponse,
} from "@/domain/assessment/choice-evaluation";

export type PredictionAssessmentDefinition =
  Omit<
    ChoiceAssessmentDefinition,
    "kind"
  > & {
    readonly kind:
      "prediction";
  };

export type PredictionAssessmentResponse =
  ChoiceAssessmentResponse;

export type PredictionAssessmentEvaluation =
  ChoiceAssessmentEvaluation;

export function evaluatePredictionAssessment(
  definition:
    PredictionAssessmentDefinition,

  response:
    PredictionAssessmentResponse,
): PredictionAssessmentEvaluation {
  if (
    definition.kind !==
    "prediction"
  ) {
    throw new ChoiceAssessmentError(
      "Prediction assessment definition must use kind \"prediction\".",
    );
  }

  return evaluateChoiceAssessment(
    definition,
    response,
  );
}