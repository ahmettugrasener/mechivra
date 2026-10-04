import {
  evaluateChoiceAssessment,
} from "@/domain/assessment/choice-evaluation";

import type {
  ChoiceAssessmentDefinition,
  ChoiceAssessmentEvaluation,
} from "@/domain/assessment/choice-evaluation";

import {
  evaluateNumericAssessment,
} from "@/domain/assessment/numeric-evaluation";

import type {
  NumericAssessmentEvaluation,
  NumericAssessmentItemDefinition,
  NumericAssessmentResponse,
} from "@/domain/assessment/numeric-evaluation";

import {
  createAssessmentResult,
} from "@/domain/assessment/result";

import type {
  AssessmentResult,
} from "@/domain/assessment/result";

export const ENGINEERING_PROBLEM_EVALUATION_VERSION =
  "1.0.0" as const;

export type EngineeringChoiceRole =
  | "criterion"
  | "decision"
  | "interpretation";

export interface EngineeringProblemChoiceItemDefinition {
  readonly role:
    EngineeringChoiceRole;

  readonly definition:
    ChoiceAssessmentDefinition;
}

export interface EngineeringProblemDefinition {
  readonly id:
    string;

  readonly version:
    string;

  readonly numericItems:
    readonly NumericAssessmentItemDefinition[];

  readonly choiceItems:
    readonly EngineeringProblemChoiceItemDefinition[];
}

export interface EngineeringProblemChoiceResponse {
  readonly itemId:
    string;

  readonly selectedOptionId:
    string | null;
}

export interface EngineeringProblemResponse {
  readonly numeric:
    readonly NumericAssessmentResponse[];

  readonly choices:
    readonly EngineeringProblemChoiceResponse[];
}

export interface EngineeringProblemChoiceEvaluation {
  readonly role:
    EngineeringChoiceRole;

  readonly evaluation:
    ChoiceAssessmentEvaluation;
}

export interface EngineeringProblemEvaluation {
  readonly version:
    typeof ENGINEERING_PROBLEM_EVALUATION_VERSION;

  readonly problemId:
    string;

  readonly problemVersion:
    string;

  readonly numeric:
    NumericAssessmentEvaluation | null;

  readonly choices:
    readonly EngineeringProblemChoiceEvaluation[];

  readonly result:
    AssessmentResult;
}

export class EngineeringProblemEvaluationError extends Error {
  constructor(
    message:
      string,
  ) {
    super(
      message,
    );

    this.name =
      "EngineeringProblemEvaluationError";
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
    throw new EngineeringProblemEvaluationError(
      `${name} must not be empty.`,
    );
  }
}

function validateDefinition(
  definition:
    EngineeringProblemDefinition,
): void {
  assertNonEmpty(
    definition.id,
    "Engineering problem ID",
  );

  assertNonEmpty(
    definition.version,
    "Engineering problem version",
  );

  if (
    definition.numericItems.length ===
      0 &&
    definition.choiceItems.length ===
      0
  ) {
    throw new EngineeringProblemEvaluationError(
      "Engineering problem requires at least one numeric or choice item.",
    );
  }

  const numericIds =
    definition.numericItems.map(
      (
        item,
      ) =>
        item.id,
    );

  const choiceIds =
    definition.choiceItems.map(
      (
        item,
      ) =>
        item.definition.id,
    );

  const allIds = [
    ...numericIds,
    ...choiceIds,
  ];

  if (
    new Set(
      allIds,
    ).size !==
    allIds.length
  ) {
    throw new EngineeringProblemEvaluationError(
      "Engineering problem item IDs must be unique across numeric and choice items.",
    );
  }

  for (
    const choiceItem
    of definition.choiceItems
  ) {
    if (
      choiceItem.definition.kind !==
      "choice"
    ) {
      throw new EngineeringProblemEvaluationError(
        `Engineering problem choice item "${choiceItem.definition.id}" must use kind "choice".`,
      );
    }
  }
}

function validateChoiceResponses(
  definition:
    EngineeringProblemDefinition,

  responses:
    readonly EngineeringProblemChoiceResponse[],
): void {
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
    throw new EngineeringProblemEvaluationError(
      "Engineering problem choice response IDs must be unique.",
    );
  }

  const knownIds =
    new Set(
      definition.choiceItems.map(
        (
          item,
        ) =>
          item.definition.id,
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
      throw new EngineeringProblemEvaluationError(
        `Unknown engineering problem choice response "${response.itemId}".`,
      );
    }
  }
}

export function evaluateEngineeringProblem(
  definition:
    EngineeringProblemDefinition,

  response:
    EngineeringProblemResponse,
): EngineeringProblemEvaluation {
  validateDefinition(
    definition,
  );

  validateChoiceResponses(
    definition,
    response.choices,
  );

  const numeric =
    definition.numericItems.length >
    0
      ? evaluateNumericAssessment(
          definition.numericItems,
          response.numeric,
        )
      : null;

  if (
    definition.numericItems.length ===
      0 &&
    response.numeric.length >
      0
  ) {
    throw new EngineeringProblemEvaluationError(
      "Engineering problem does not define numeric items.",
    );
  }

  const choiceResponseById =
    new Map(
      response.choices.map(
        (
          choiceResponse,
        ) => [
          choiceResponse.itemId,
          choiceResponse,
        ] as const,
      ),
    );

  const choices =
    definition.choiceItems.map(
      (
        choiceItem,
      ): EngineeringProblemChoiceEvaluation => {
        const choiceResponse =
          choiceResponseById.get(
            choiceItem.definition.id,
          );

        return {
          role:
            choiceItem.role,

          evaluation:
            evaluateChoiceAssessment(
              choiceItem.definition,
              {
                selectedOptionId:
                  choiceResponse
                    ?.selectedOptionId ??
                  null,
              },
            ),
        };
      },
    );

  const combinedItems = [
    ...(
      numeric?.result.items ??
      []
    ),
    ...choices.flatMap(
      (
        choice,
      ) =>
        choice.evaluation
          .result.items,
    ),
  ];

  return {
    version:
      ENGINEERING_PROBLEM_EVALUATION_VERSION,

    problemId:
      definition.id,

    problemVersion:
      definition.version,

    numeric,

    choices,

    result:
      createAssessmentResult(
        combinedItems,
      ),
  };
}