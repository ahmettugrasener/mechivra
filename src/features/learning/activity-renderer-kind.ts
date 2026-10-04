import type {
  LearningActivityType,
} from "@/domain/learning/types";

export type LearningActivityRendererKind =
  | "narrative"
  | "response"
  | "interactive"
  | "design";

export function getLearningActivityRendererKind(
  activityType:
    LearningActivityType,
): LearningActivityRendererKind {
  switch (activityType) {
    case "problem_context":
    case "concept":
    case "worked_example":
    case "interpretation":
    case "reflection":
    case "summary":
      return "narrative";

    case "prediction":
    case "problem":
    case "quiz":
      return "response";

    case "interactive":
    case "lab":
      return "interactive";

    case "design_task":
      return "design";

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
    `Unsupported learning activity type: ${String(
      value,
    )}`,
  );
}