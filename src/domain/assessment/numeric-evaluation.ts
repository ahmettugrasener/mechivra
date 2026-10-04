import {
  createAssessmentResult,
} from "@/domain/assessment/result";

import type {
  AssessmentItemResult,
  AssessmentResult,
} from "@/domain/assessment/result";

import {
  evaluateNumericTolerance,
  validateNumericTolerance,
} from "@/domain/assessment/numeric-tolerance";

import type {
  NumericTolerance,
  NumericToleranceEvaluation,
} from "@/domain/assessment/numeric-tolerance";

export const NUMERIC_ASSESSMENT_VERSION =
  "1.0.0" as const;

export interface NumericAssessmentItemDefinition {
  readonly id:
    string;

  readonly expectedValue:
    number;

  /*
   * Metadata only at this layer.
   * Unit conversion must happen before evaluation.
   */
  readonly quantityId:
    string;

  readonly expectedUnitId:
    string;

  readonly tolerance:
    NumericTolerance;

  readonly maxScore:
    number;

  readonly correctFeedbackCode?:
    string;

  readonly incorrectFeedbackCode?:
    string;

  readonly invalidFeedbackCode?:
    string;
}

export interface NumericAssessmentResponse {
  readonly itemId:
    string;

  /*
   * Value must already be expressed in expectedUnitId.
   */
  readonly value:
    number;
}

export interface NumericAssessmentItemEvaluation {
  readonly definition:
    NumericAssessmentItemDefinition;

  readonly response:
    NumericAssessmentResponse | null;

  readonly toleranceEvaluation:
    NumericToleranceEvaluation | null;

  readonly result:
    AssessmentItemResult;
}

export interface NumericAssessmentEvaluation {
  readonly version:
    typeof NUMERIC_ASSESSMENT_VERSION;

  readonly items:
    readonly NumericAssessmentItemEvaluation[];

  readonly result:
    AssessmentResult;
}

export class NumericAssessmentError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "NumericAssessmentError";
  }
}

function assertDefinition(
  definition:
    NumericAssessmentItemDefinition,
): void {
  if (
    definition.id.trim().length ===
    0
  ) {
    throw new NumericAssessmentError(
      "Numeric assessment item ID must not be empty.",
    );
  }

  if (
    definition.quantityId.trim().length ===
    0
  ) {
    throw new NumericAssessmentError(
      `Quantity ID for "${definition.id}" must not be empty.`,
    );
  }

  if (
    definition.expectedUnitId.trim().length ===
    0
  ) {
    throw new NumericAssessmentError(
      `Expected unit ID for "${definition.id}" must not be empty.`,
    );
  }

  if (
    !Number.isFinite(
      definition.expectedValue,
    )
  ) {
    throw new NumericAssessmentError(
      `Expected value for "${definition.id}" must be finite.`,
    );
  }

  if (
    !Number.isFinite(
      definition.maxScore,
    ) ||
    definition.maxScore <=
      0
  ) {
    throw new NumericAssessmentError(
      `Maximum score for "${definition.id}" must be finite and greater than zero.`,
    );
  }

  validateNumericTolerance(
    definition.tolerance,
  );
}

function assertUniqueIds(
  definitions:
    readonly NumericAssessmentItemDefinition[],

  responses:
    readonly NumericAssessmentResponse[],
): void {
  const definitionIds =
    definitions.map(
      (
        definition,
      ) =>
        definition.id,
    );

  if (
    new Set(
      definitionIds,
    ).size !==
    definitionIds.length
  ) {
    throw new NumericAssessmentError(
      "Numeric assessment definition IDs must be unique.",
    );
  }

  const responseIds =
    responses.map(
      (
        response,
      ) =>
        response.itemId,
    );

  if (
    new Set(
      responseIds,
    ).size !==
    responseIds.length
  ) {
    throw new NumericAssessmentError(
      "Numeric assessment response IDs must be unique.",
    );
  }
}

function evaluateItem(
  definition:
    NumericAssessmentItemDefinition,

  response:
    NumericAssessmentResponse |
    null,
): NumericAssessmentItemEvaluation {
  /*
   * Missing or non-finite response means that the submitted
   * item cannot be numerically evaluated. This is distinct
   * from a finite but incorrect engineering value.
   */
  if (
    response ===
      null ||
    !Number.isFinite(
      response.value,
    )
  ) {
    return {
      definition,

      response,

      toleranceEvaluation:
        null,

      result: {
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
    };
  }

  const toleranceEvaluation =
    evaluateNumericTolerance(
      response.value,
      definition.expectedValue,
      definition.tolerance,
    );

  const correct =
    toleranceEvaluation
      .withinTolerance;

  return {
    definition,

    response,

    toleranceEvaluation,

    result: {
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
          : definition
              .incorrectFeedbackCode,
    },
  };
}

export function evaluateNumericAssessment(
  definitions:
    readonly NumericAssessmentItemDefinition[],

  responses:
    readonly NumericAssessmentResponse[],
): NumericAssessmentEvaluation {
  if (
    definitions.length ===
    0
  ) {
    throw new NumericAssessmentError(
      "Numeric assessment requires at least one item definition.",
    );
  }

  assertUniqueIds(
    definitions,
    responses,
  );

  for (
    const definition
    of definitions
  ) {
    assertDefinition(
      definition,
    );
  }

  const knownIds =
    new Set(
      definitions.map(
        (
          definition,
        ) =>
          definition.id,
      ),
    );

  for (
    const response
    of responses
  ) {
    if (
      !knownIds.has(
        response.itemId,
      )
    ) {
      throw new NumericAssessmentError(
        `Unknown numeric assessment response item "${response.itemId}".`,
      );
    }
  }

  const responseById =
    new Map(
      responses.map(
        (
          response,
        ) => [
          response.itemId,
          response,
        ] as const,
      ),
    );

  const items =
    definitions.map(
      (
        definition,
      ) =>
        evaluateItem(
          definition,

          responseById.get(
            definition.id,
          ) ??
            null,
        ),
    );

  return {
    version:
      NUMERIC_ASSESSMENT_VERSION,

    items,

    result:
      createAssessmentResult(
        items.map(
          (
            item,
          ) =>
            item.result,
        ),
      ),
  };
}