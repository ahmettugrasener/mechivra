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

export type CalloutTone =
  | "info"
  | "engineering"
  | "warning";

export interface HeadingContentBlock {
  readonly id: EntityId;
  readonly type: "heading";
  readonly level: 2 | 3;
  readonly text: LocalizedText;
}

export interface ParagraphContentBlock {
  readonly id: EntityId;
  readonly type: "paragraph";
  readonly text: LocalizedText;
}

export interface EquationContentBlock {
  readonly id: EntityId;
  readonly type: "equation";
  readonly expression: string;
  readonly description?: LocalizedText;
}

export interface CalloutContentBlock {
  readonly id: EntityId;
  readonly type: "callout";
  readonly tone: CalloutTone;
  readonly title?: LocalizedText;
  readonly body: LocalizedText;
}

export interface FigureContentBlock {
  readonly id: EntityId;
  readonly type: "figure";
  readonly assetId: EntityId;
  readonly alt: LocalizedText;
  readonly caption?: LocalizedText;
}

export type LearningContentBlock =
  | HeadingContentBlock
  | ParagraphContentBlock
  | EquationContentBlock
  | CalloutContentBlock
  | FigureContentBlock;

export interface LearningActivity extends VersionedEntity {
  readonly moduleId: EntityId;

  readonly type: LearningActivityType;
  readonly order: number;

  readonly title: LocalizedText;

  readonly learningOutcomeIds: readonly EntityId[];
  readonly conceptIds: readonly EntityId[];
  readonly sourceIds: readonly EntityId[];

  readonly contentBlocks: readonly LearningContentBlock[];

  readonly completionRule: CompletionRule;
  readonly status: PublicationStatus;
}