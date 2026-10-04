import type {
  CompletionRule,
  CompletionRuleType,
  LearningActivityType,
} from "@/domain/learning/types";

export type LearningCompletionEvent =
  | "opened"
  | "reached_end"
  | "prediction_submitted"
  | "meaningful_interaction"
  | "attempt_submitted"
  | "explicit_completion";

export interface LearningCompletionEvidence {
  readonly opened:
    boolean;

  readonly reachedEnd:
    boolean;

  readonly predictionSubmissions:
    number;

  readonly meaningfulInteractions:
    number;

  readonly attemptsSubmitted:
    number;

  readonly explicitCompletions:
    number;
}

export interface LearningCompletionEvaluation {
  readonly rule:
    CompletionRuleType;

  readonly completed:
    boolean;
}

export function createEmptyLearningCompletionEvidence():
  LearningCompletionEvidence {
  return {
    opened: false,
    reachedEnd: false,

    predictionSubmissions: 0,
    meaningfulInteractions: 0,
    attemptsSubmitted: 0,
    explicitCompletions: 0,
  };
}

export function recordLearningCompletionEvent(
  current:
    LearningCompletionEvidence,

  event:
    LearningCompletionEvent,
): LearningCompletionEvidence {
  switch (event) {
    case "opened":
      return {
        ...current,
        opened: true,
      };

    case "reached_end":
      return {
        ...current,
        opened: true,
        reachedEnd: true,
      };

    case "prediction_submitted":
      return {
        ...current,
        opened: true,

        predictionSubmissions:
          current.predictionSubmissions +
          1,
      };

    case "meaningful_interaction":
      return {
        ...current,
        opened: true,

        meaningfulInteractions:
          current.meaningfulInteractions +
          1,
      };

    case "attempt_submitted":
      return {
        ...current,
        opened: true,

        attemptsSubmitted:
          current.attemptsSubmitted +
          1,
      };

    case "explicit_completion":
      return {
        ...current,
        opened: true,

        explicitCompletions:
          current.explicitCompletions +
          1,
      };

    default:
      return assertNever(
        event,
      );
  }
}

export function evaluateLearningCompletion(
  rule:
    CompletionRule,

  evidence:
    LearningCompletionEvidence,
): LearningCompletionEvaluation {
  switch (rule.type) {
    case "opened":
      return {
        rule:
          rule.type,

        completed:
          evidence.opened,
      };

    case "reached_end":
      return {
        rule:
          rule.type,

        completed:
          evidence.reachedEnd,
      };

    case "submitted_prediction":
      return {
        rule:
          rule.type,

        completed:
          evidence.predictionSubmissions >
          0,
      };

    case "meaningful_interaction":
      return {
        rule:
          rule.type,

        completed:
          evidence.meaningfulInteractions >
          0,
      };

    case "submitted_attempt":
      return {
        rule:
          rule.type,

        completed:
          evidence.attemptsSubmitted >
          0,
      };

    case "explicit_completion":
      return {
        rule:
          rule.type,

        completed:
          evidence.explicitCompletions >
          0,
      };

    default:
      return assertNever(
        rule.type,
      );
  }
}

export function isCompletionRuleCompatibleWithActivityType(
  activityType:
    LearningActivityType,

  completionRule:
    CompletionRuleType,
): boolean {
  switch (activityType) {
    case "problem_context":
    case "concept":
    case "worked_example":
    case "interpretation":
    case "reflection":
    case "summary":
      return (
        completionRule ===
          "opened" ||
        completionRule ===
          "reached_end" ||
        completionRule ===
          "explicit_completion"
      );

    case "prediction":
      return (
        completionRule ===
        "submitted_prediction"
      );

    case "interactive":
    case "lab":
      return (
        completionRule ===
        "meaningful_interaction"
      );

    case "problem":
    case "quiz":
      return (
        completionRule ===
        "submitted_attempt"
      );

    case "design_task":
      return (
        completionRule ===
          "submitted_attempt" ||
        completionRule ===
          "explicit_completion"
      );

    default:
      return assertNever(
        activityType,
      );
  }
}

function assertNever(
  value: never,
): never {
  throw new Error(
    `Unsupported learning completion value: ${String(
      value,
    )}`,
  );
}