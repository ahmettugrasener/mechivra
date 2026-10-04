import {
  createAssessmentResult,
} from "@/domain/assessment/result";

import type {
  AssessmentResult,
} from "@/domain/assessment/result";

export const CHOICE_ASSESSMENT_VERSION =
  "1.0.0" as const;

export type ChoiceAssessmentKind =
  | "choice"
  | "prediction";

export interface ChoiceAssessmentOptionDefinition {
  readonly id:
    string;

  readonly feedbackCode?:
    string;
}

export interface ChoiceAssessmentDefinition {
  readonly id:
    string;

  readonly kind:
    ChoiceAssessmentKind;

  readonly options:
    readonly ChoiceAssessmentOptionDefinition[];

  readonly correctOptionId:
    string;

  readonly maxScore:
    number;

  readonly correctFeedbackCode?:
    string;

  readonly invalidFeedbackCode?:
    string;
}

export interface ChoiceAssessmentResponse {
  readonly selectedOptionId:
    string | null;
}

export interface ChoiceAssessmentEvaluation {
  readonly version:
    typeof CHOICE_ASSESSMENT_VERSION;

  readonly definition:
    ChoiceAssessmentDefinition;

  readonly response:
    ChoiceAssessmentResponse;

  readonly selectedOption:
    ChoiceAssessmentOptionDefinition | null;

  readonly result:
    AssessmentResult;
}

export class ChoiceAssessmentError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "ChoiceAssessmentError";
  }
}

function assertNonEmpty(
  value:
    string,

  name:
    string,
): void {
  if (
    value.trim().length ===
    0
  ) {
    throw new ChoiceAssessmentError(
      `${name} must not be empty.`,
    );
  }
}

function validateDefinition(
  definition:
    ChoiceAssessmentDefinition,
): void {
  assertNonEmpty(
    definition.id,
    "Choice assessment ID",
  );

  if (
    definition.options.length <
    2
  ) {
    throw new ChoiceAssessmentError(
      "Choice assessment must contain at least two options.",
    );
  }

  const optionIds =
    definition.options.map(
      (
        option,
      ) =>
        option.id,
    );

  for (
    const option
    of definition.options
  ) {
    assertNonEmpty(
      option.id,
      "Choice option ID",
    );
  }

  if (
    new Set(
      optionIds,
    ).size !==
    optionIds.length
  ) {
    throw new ChoiceAssessmentError(
      "Choice option IDs must be unique.",
    );
  }

  if (
    !optionIds.includes(
      definition.correctOptionId,
    )
  ) {
    throw new ChoiceAssessmentError(
      "Correct option ID must refer to one of the defined options.",
    );
  }

  if (
    !Number.isFinite(
      definition.maxScore,
    ) ||
    definition.maxScore <=
      0
  ) {
    throw new ChoiceAssessmentError(
      "Choice assessment maximum score must be finite and greater than zero.",
    );
  }
}

export function evaluateChoiceAssessment(
  definition:
    ChoiceAssessmentDefinition,

  response:
    ChoiceAssessmentResponse,
): ChoiceAssessmentEvaluation {
  validateDefinition(
    definition,
  );

  const selectedOption =
    response.selectedOptionId ===
    null
      ? null
      : definition.options.find(
          (
            option,
          ) =>
            option.id ===
            response.selectedOptionId,
        ) ??
        null;

  /*
   * No answer or an unknown option is an invalid submitted
   * response, not a finite-but-wrong conceptual answer.
   */
  if (
    response.selectedOptionId ===
      null ||
    selectedOption ===
      null
  ) {
    return {
      version:
        CHOICE_ASSESSMENT_VERSION,

      definition,

      response,

      selectedOption,

      result:
        createAssessmentResult(
          [
            {
              id:
                definition.id,

              status:
                "invalid",

              score:
                0,

              maxScore:
                definition.maxScore,

              feedbackCode:
                definition
                  .invalidFeedbackCode,
            },
          ],
        ),
    };
  }

  const correct =
    selectedOption.id ===
    definition.correctOptionId;

  return {
    version:
      CHOICE_ASSESSMENT_VERSION,

    definition,

    response,

    selectedOption,

    result:
      createAssessmentResult(
        [
          {
            id:
              definition.id,

            status:
              correct
                ? "correct"
                : "incorrect",

            score:
              correct
                ? definition.maxScore
                : 0,

            maxScore:
              definition.maxScore,

            feedbackCode:
              correct
                ? definition
                    .correctFeedbackCode
                : selectedOption
                    .feedbackCode,
          },
        ],
      ),
  };
}