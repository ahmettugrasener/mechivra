import type {
  EntityId,
  LocalizedText,
  VersionedEntity,
} from "@/domain/shared/types";

export type ProblemType =
  | "numeric"
  | "multiple_choice"
  | "conceptual"
  | "multi_step"
  | "matching"
  | "ordering"
  | "design_decision"
  | "explanation";

export interface ProblemTemplate extends VersionedEntity {
  readonly moduleId: EntityId;
  readonly type: ProblemType;

  readonly title: LocalizedText;
  readonly prompt: LocalizedText;

  readonly learningOutcomeIds: readonly EntityId[];
  readonly conceptIds: readonly EntityId[];

  readonly engineeringModelId?: EntityId;
  readonly sourceIds: readonly EntityId[];
}

export interface ProblemAttempt {
  readonly id: EntityId;

  readonly problemTemplateId: EntityId;
  readonly problemTemplateVersion: string;

  readonly engineeringModelId?: EntityId;
  readonly engineeringModelVersion?: string;

  readonly attemptNumber: number;

  readonly submittedAt: string;
  readonly hintUsed: boolean;
}

export interface GradingResult {
  readonly correct: boolean;
  readonly feedbackKey: string;
}