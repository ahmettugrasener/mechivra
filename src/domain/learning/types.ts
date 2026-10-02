import type {
  EntityId,
  LocalizedText,
  PublicationStatus,
  VersionedEntity,
} from "@/domain/shared/types";

export type LearningActivityType =
  | "problem_context"
  | "concept"
  | "prediction"
  | "worked_example"
  | "interactive"
  | "interpretation"
  | "problem"
  | "quiz"
  | "design_task"
  | "lab"
  | "reflection"
  | "summary";

export type CompletionRuleType =
  | "opened"
  | "reached_end"
  | "submitted_prediction"
  | "meaningful_interaction"
  | "submitted_attempt"
  | "explicit_completion";

export interface CompletionRule {
  readonly type: CompletionRuleType;
}

export interface LearningActivity extends VersionedEntity {
  readonly moduleId: EntityId;

  readonly type: LearningActivityType;
  readonly order: number;

  readonly title: LocalizedText;

  readonly learningOutcomeIds: readonly EntityId[];
  readonly conceptIds: readonly EntityId[];
  readonly sourceIds: readonly EntityId[];

  readonly completionRule: CompletionRule;
  readonly status: PublicationStatus;
}