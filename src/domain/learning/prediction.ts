import type {
  EntityId,
  LocalizedText,
} from "@/domain/shared/types";

export interface PredictionOption {
  readonly id: EntityId;

  readonly label:
    LocalizedText;

  readonly feedback:
    LocalizedText;
}

export interface PredictionDefinition {
  readonly activityId:
    EntityId;

  readonly prompt:
    LocalizedText;

  readonly options:
    readonly PredictionOption[];

  readonly correctOptionId:
    EntityId;
}

export interface PredictionEvaluation {
  readonly activityId:
    EntityId;

  readonly submittedOptionId:
    EntityId;

  readonly isCorrect:
    boolean;

  readonly feedback:
    LocalizedText;
}

export class PredictionEvaluationError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "PredictionEvaluationError";
  }
}

export function evaluatePrediction(
  definition:
    PredictionDefinition,
  submittedOptionId:
    EntityId,
): PredictionEvaluation {
  const submittedOption =
    definition.options.find(
      (option) =>
        option.id ===
        submittedOptionId,
    );

  if (!submittedOption) {
    throw new PredictionEvaluationError(
      `Prediction option "${submittedOptionId}" does not belong to activity "${definition.activityId}".`,
    );
  }

  return {
    activityId:
      definition.activityId,

    submittedOptionId,

    isCorrect:
      submittedOptionId ===
      definition.correctOptionId,

    feedback:
      submittedOption.feedback,
  };
}