import type {
  EntityId,
  LocalizedText,
  PublicationStatus,
  VersionedEntity,
} from "@/domain/shared/types";

export interface Course extends VersionedEntity {
  readonly slug: string;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly moduleIds: readonly EntityId[];
  readonly status: PublicationStatus;
}

export interface LearningOutcome extends VersionedEntity {
  readonly moduleId: EntityId;
  readonly code: string;
  readonly description: LocalizedText;
}

export interface Concept extends VersionedEntity {
  readonly slug: string;
  readonly title: LocalizedText;
  readonly shortDefinition: LocalizedText;

  readonly requires: readonly EntityId[];
  readonly relatedTo: readonly EntityId[];
  readonly usedIn: readonly EntityId[];

  readonly sourceIds: readonly EntityId[];
  readonly status: PublicationStatus;
}

export interface LearningModule extends VersionedEntity {
  readonly courseId: EntityId;
  readonly slug: string;

  readonly title: LocalizedText;
  readonly description: LocalizedText;

  readonly learningOutcomeIds: readonly EntityId[];
  readonly prerequisiteConceptIds: readonly EntityId[];
  readonly conceptIds: readonly EntityId[];
  readonly activityIds: readonly EntityId[];

  readonly sourceIds: readonly EntityId[];
  readonly status: PublicationStatus;
}