export const ASSESSMENT_RESULT_VERSION =
  "1.0.0" as const;

export type AssessmentEvaluationStatus =
  | "not_evaluated"
  | "correct"
  | "partially_correct"
  | "incorrect"
  | "invalid";

export type AssessmentItemStatus =
  | "correct"
  | "incorrect"
  | "invalid";

export interface AssessmentItemResult {
  readonly id:
    string;

  readonly status:
    AssessmentItemStatus;

  readonly score:
    number;

  readonly maxScore:
    number;

  readonly feedbackCode?:
    string;
}

export interface AssessmentResult {
  readonly version:
    typeof ASSESSMENT_RESULT_VERSION;

  readonly status:
    AssessmentEvaluationStatus;

  readonly score:
    number;

  readonly maxScore:
    number;

  readonly normalizedScore:
    number | null;

  readonly correct:
    boolean;

  readonly items:
    readonly AssessmentItemResult[];
}

export class AssessmentResultError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "AssessmentResultError";
  }
}

function assertFiniteNonNegative(
  value:
    number,

  name:
    string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value < 0
  ) {
    throw new AssessmentResultError(
      `${name} must be finite and greater than or equal to zero.`,
    );
  }
}

function assertUniqueItemIds(
  items:
    readonly AssessmentItemResult[],
): void {
  const ids =
    items.map(
      (
        item,
      ) =>
        item.id,
    );

  if (
    new Set(
      ids,
    ).size !==
    ids.length
  ) {
    throw new AssessmentResultError(
      "Assessment item IDs must be unique.",
    );
  }
}

function deriveEvaluationStatus(
  items:
    readonly AssessmentItemResult[],
): AssessmentEvaluationStatus {
  if (
    items.some(
      (
        item,
      ) =>
        item.status ===
        "invalid",
    )
  ) {
    return "invalid";
  }

  if (
    items.every(
      (
        item,
      ) =>
        item.status ===
        "correct",
    )
  ) {
    return "correct";
  }

  if (
    items.every(
      (
        item,
      ) =>
        item.status ===
        "incorrect",
    )
  ) {
    return "incorrect";
  }

  return "partially_correct";
}

export function createAssessmentResult(
  items:
    readonly AssessmentItemResult[],
): AssessmentResult {
  if (
    items.length ===
    0
  ) {
    throw new AssessmentResultError(
      "Assessment result requires at least one evaluated item.",
    );
  }

  assertUniqueItemIds(
    items,
  );

  for (
    const item
    of items
  ) {
    if (
      item.id.trim().length ===
      0
    ) {
      throw new AssessmentResultError(
        "Assessment item ID must not be empty.",
      );
    }

    assertFiniteNonNegative(
      item.score,
      `Score for "${item.id}"`,
    );

    assertFiniteNonNegative(
      item.maxScore,
      `Maximum score for "${item.id}"`,
    );

    if (
      item.maxScore <= 0
    ) {
      throw new AssessmentResultError(
        `Maximum score for "${item.id}" must be greater than zero.`,
      );
    }

    if (
      item.score >
      item.maxScore
    ) {
      throw new AssessmentResultError(
        `Score for "${item.id}" cannot exceed its maximum score.`,
      );
    }

    if (
      item.status ===
        "correct" &&
      item.score !==
        item.maxScore
    ) {
      throw new AssessmentResultError(
        `Correct item "${item.id}" must receive full score.`,
      );
    }

    if (
      item.status ===
        "incorrect" &&
      item.score ===
        item.maxScore
    ) {
      throw new AssessmentResultError(
        `Incorrect item "${item.id}" cannot receive full score.`,
      );
    }
  }

  const score =
    items.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.score,
      0,
    );

  const maxScore =
    items.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.maxScore,
      0,
    );

  const status =
    deriveEvaluationStatus(
      items,
    );

  return {
    version:
      ASSESSMENT_RESULT_VERSION,

    status,

    score,

    maxScore,

    normalizedScore:
      maxScore >
      0
        ? score /
          maxScore
        : null,

    correct:
      status ===
      "correct",

    items:
      items.map(
        (
          item,
        ) => ({
          ...item,
        }),
      ),
  };
}