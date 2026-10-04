import type {
  AssessmentEvaluationStatus,
  AssessmentItemStatus,
  AssessmentResult,
} from "@/domain/assessment/result";

export const ASSESSMENT_FEEDBACK_VERSION =
  "1.0.0" as const;

export type AssessmentFeedbackReason =
  | "correct"
  | "partial"
  | "incorrect"
  | "missing_input"
  | "invalid_input"
  | "outside_tolerance"
  | "wrong_concept"
  | "wrong_criterion"
  | "unit_mismatch"
  | "model_limit"
  | "not_evaluated";

export type AssessmentFeedbackTone =
  | "success"
  | "guidance"
  | "warning"
  | "info";

export interface AssessmentFeedbackDescriptor {
  readonly code:
    string;

  readonly reason:
    AssessmentFeedbackReason;

  readonly tone:
    AssessmentFeedbackTone;

  readonly retryable:
    boolean;
}

export interface AssessmentItemFeedbackReference {
  readonly itemId:
    string;

  readonly feedback:
    AssessmentFeedbackDescriptor;
}

export interface AssessmentFeedbackPlan {
  readonly version:
    typeof ASSESSMENT_FEEDBACK_VERSION;

  readonly summary:
    AssessmentFeedbackDescriptor;

  readonly items:
    readonly AssessmentItemFeedbackReference[];
}

export type AssessmentFeedbackLookup =
  (
    code:
      string,
  ) =>
    AssessmentFeedbackDescriptor |
    undefined;

export class AssessmentFeedbackError extends Error {
  constructor(
    message:
      string,
  ) {
    super(
      message,
    );

    this.name =
      "AssessmentFeedbackError";
  }
}

const SUMMARY_FEEDBACK_CODES:
  Readonly<
    Record<
      AssessmentEvaluationStatus,
      string
    >
  > =
  {
    not_evaluated:
      "assessment.result.not-evaluated",

    correct:
      "assessment.result.correct",

    partially_correct:
      "assessment.result.partially-correct",

    incorrect:
      "assessment.result.incorrect",

    invalid:
      "assessment.result.invalid",
  };

const ITEM_FALLBACK_FEEDBACK_CODES:
  Readonly<
    Record<
      AssessmentItemStatus,
      string
    >
  > =
  {
    correct:
      "assessment.item.correct",

    incorrect:
      "assessment.item.incorrect",

    invalid:
      "assessment.item.invalid",
  };

function resolveFeedback(
  code:
    string,

  lookup:
    AssessmentFeedbackLookup,
): AssessmentFeedbackDescriptor {
  const feedback =
    lookup(
      code,
    );

  if (
    !feedback
  ) {
    throw new AssessmentFeedbackError(
      `Unknown assessment feedback code "${code}".`,
    );
  }

  if (
    feedback.code !==
    code
  ) {
    throw new AssessmentFeedbackError(
      `Assessment feedback lookup returned mismatched code "${feedback.code}" for "${code}".`,
    );
  }

  if (
    feedback.code.trim().length ===
    0
  ) {
    throw new AssessmentFeedbackError(
      "Assessment feedback code must not be empty.",
    );
  }

  return feedback;
}

export function createAssessmentFeedbackPlan(
  result:
    AssessmentResult,

  lookup:
    AssessmentFeedbackLookup,
): AssessmentFeedbackPlan {
  const summaryCode =
    SUMMARY_FEEDBACK_CODES[
      result.status
    ];

  const summary =
    resolveFeedback(
      summaryCode,
      lookup,
    );

  const items =
    result.items.map(
      (
        item,
      ): AssessmentItemFeedbackReference => {
        const code =
          item.feedbackCode ??
          ITEM_FALLBACK_FEEDBACK_CODES[
            item.status
          ];

        return {
          itemId:
            item.id,

          feedback:
            resolveFeedback(
              code,
              lookup,
            ),
        };
      },
    );

  return {
    version:
      ASSESSMENT_FEEDBACK_VERSION,

    summary,

    items,
  };
}